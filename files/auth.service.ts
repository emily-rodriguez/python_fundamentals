import {
  AdminAddUserToGroupCommand,
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminSetUserPasswordCommand,
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { EncryptCommand, KMSClient } from '@aws-sdk/client-kms';
import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import config from 'config';
import { randomUUID } from 'crypto';
import { generate } from 'generate-password';
import { EmailLayoutDto } from '../common/dto/email-layout.dto';
import {
  dealerDetailsDocument,
  getDeal,
  personByUsernameDocument,
} from '../common/queries';
import { UserDto } from '../hasura/dto/user.dto';
import { graphql } from '../hasura/gql';
import {
  createHasuraDelegateClient,
  createHasuraServiceClient,
  createHasuraUserClient,
} from '../hasura/utils';
import { AuthTokenDto } from './dto/auth-token.dto';
import { CoBorrowerEmailDto } from './dto/co-borrower-email.dto';
import { ImpersonateDto } from './dto/impersonate.dto';
import { ImpersonationDto } from './dto/impersonation.dto';
import { Coborrower, InviteCoborrowersDto } from './dto/invite-coborrower.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterCoborrowerDto } from './dto/register-coborrower.dto';
import { RegisterLoanOfficerDto } from './dto/register-loan-officer.dto';
import { RegisterDto } from './dto/register.dto';
import { RegistrationDto } from './dto/registration.dto';

const primaryDealPartyDocument = graphql(`
  query deal_party($deal_id: Int!) {
    deal_assigned_parties(
      where: {
        dealID: { _eq: $deal_id }
        party: { lut_party_role_id: { _eq: 1 } }
      }
    ) {
      party {
        person {
          pii__full_name
          pii__primary_email
          username
        }
      }
    }
  }
`);

const coborrowersDocument = graphql(`
  query coborrowers($deal_id: Int!) {
    deal_assigned_parties(
      where: {
        deal_id: { _eq: $deal_id }
        party: { lut_party_role_id: { _eq: 2 } }
      }
    ) {
      party {
        person {
          pii__primary_email
          username
        }
      }
    }
  }
`);

const personDocument = graphql(`
  query person($email: String!) {
    person(where: { pii__primary_email: { _eq: $email } }) {
      id
      pii__first_name
      username
    }
  }
`);

const rolesDocument = graphql(`
  query roles {
    lut_user_role {
      id
      name
    }
    lut_contact_point_role {
      id
      name
    }
  }
`);

const buyerProfileDocument = graphql(`
  query buyerProfile($id: Int!) {
    buyerProfile(where: { id: { _eq: $id } }) {
      assetsLiquidTotal
      assetsNonLiquidTotal
      bankruptcyDate
      bankruptcyIndicator
      borrowerPersonID
      currentMonthlyIncome
      currentlyMonthlyIncomeLastUpdated
      employmentStandingID
      employmentStandingOtherDescription
      isActive_
      liabilitiesTotal
      noDebtReported
      noIncomeReported
      profileTypeID
      selfDeclaredMilitaryServiceIndicator
      selfReportedCreditScore
      submissionResultResponseID
      workGapDescription
    }
  }
`);

const insertPersonDocument = graphql(`
  mutation insertPerson(
    $username: String!
    $email: String!
    $firstName: String
    $lastName: String
    $phone: String
    $fullName: String
    $suffix: String
  ) {
    insert_person_one(
      object: {
        username: $username
        primaryEmail: $email
        firstName: $firstName
        lastName: $lastName
        primaryPhone: $phone
        fullName: $fullName
        suffixName: $suffix
      }
      on_conflict: { constraint: person_username_key, update_columns: [] }
    ) {
      id
    }
  }
`);

const insertTasksDocument = graphql(`
  mutation insertTasks(
    $borrowerID: Int!
    $shouldCreateDeal: Boolean!
    $dealerCompanyID: Int
    $profileTypeID: Int!
  ) {
    insert_buyerProfile_one(
      object: {
        borrowerPersonID: $borrowerID
        tasks: {
          data: [
            { personID: $borrowerID, name: "Setup My Borrower Profile" }
            { personID: $borrowerID, name: "My Accounts" }
            { personID: $borrowerID, name: "My Properties" }
            { personID: $borrowerID, name: "My Income" }
            { personID: $borrowerID, name: "My Debt" }
            { personID: $borrowerID, name: "My Credit Score" }
          ]
        }
        profileTypeID: $profileTypeID
      }
    ) {
      id
    }

    insert_deal(
      objects: {
        dealStatusID: 1
        isActive_: true
        loans: { data: { loanStatusID: 1 } }
        assignedDealParties: {
          data: [
            {
              party: {
                data: { sortOrder: 1, partyRoleID: 1, personID: $borrowerID }
              }
            }
            { party: { data: { partyRoleID: 3, companyID: $dealerCompanyID } } }
          ]
        }
      }
    ) @include(if: $shouldCreateDeal) {
      returning {
        id
      }
    }
  }
`);

const deletePersonDocument = graphql(`
  mutation deletePerson($email: String!) {
    delete_person(where: { primaryEmail: { _eq: $email } }) {
      affected_rows
    }
  }
`);

const registerCoborrowerDocument = graphql(`
  mutation registerCoborrower(
    $dealId: Int!
    $id: Int!
    $dealParty: assignedDealParties_insert_input!
  ) {
    delete_party(
      where: {
        _and: {
          personID: { _eq: $id }
          assignedDealParties: { dealID: { _eq: $dealId } }
        }
      }
    ) {
      affected_rows
    }

    insert_assignedDealParties_one(object: $dealParty) {
      partyID
    }
  }
`);

const insertBuyerProfileDocument = graphql(`
  mutation insertBuyerProfile(
    $assetsLiquidTotal: numeric = 0
    $assetsNonLiquidTotal: numeric = 0
    $bankruptcyDate: date
    $bankruptcyIndicator: Boolean
    $borrowerPersonID: Int!
    $currentMonthlyIncome: numeric = 0
    $currentlyMonthlyIncomeLastUpdated: date
    $employmentStandingID: Int
    $employmentStandingOtherDescription: String
    $isActive_: Boolean
    $liabilitiesTotal: numeric = 0
    $noDebtReported: Boolean
    $noIncomeReported: Boolean
    $profileTypeID: Int!
    $selfDeclaredMilitaryServiceIndicator: Boolean
    $selfReportedCreditScore: Int
    $submissionResultResponseID: Int
    $workGapDescription: String
  ) {
    insert_buyerProfile_one(
      object: {
        assetsLiquidTotal: $assetsLiquidTotal
        assetsNonLiquidTotal: $assetsNonLiquidTotal
        bankruptcyDate: $bankruptcyDate
        bankruptcyIndicator: $bankruptcyIndicator
        borrowerPersonID: $borrowerPersonID
        currentMonthlyIncome: $currentMonthlyIncome
        currentlyMonthlyIncomeLastUpdated: $currentlyMonthlyIncomeLastUpdated
        employmentStandingID: $employmentStandingID
        employmentStandingOtherDescription: $employmentStandingOtherDescription
        isActive_: $isActive_
        liabilitiesTotal: $liabilitiesTotal
        noDebtReported: $noDebtReported
        noIncomeReported: $noIncomeReported
        profileTypeID: $profileTypeID
        selfDeclaredMilitaryServiceIndicator: $selfDeclaredMilitaryServiceIndicator
        selfReportedCreditScore: $selfReportedCreditScore
        submissionResultResponseID: $submissionResultResponseID
        workGapDescription: $workGapDescription
      }
    ) {
      id
    }
  }
`);

@Injectable()
export class AuthService {
  private kms: KMSClient;
  private cognito: CognitoIdentityProviderClient;

  constructor(private readonly mailerService: MailerService) {
    this.kms = new KMSClient({});
    this.cognito = new CognitoIdentityProviderClient({});
  }

  private async createAuthToken(data: AuthTokenDto): Promise<string> {
    const command = new EncryptCommand({
      KeyId: config.get<string>('auth.token_encryption_key_id'),
      Plaintext: Buffer.from(JSON.stringify(data), 'utf-8'),
    });
    const resp = await this.kms.send(command);

    return Buffer.from(resp.CiphertextBlob!).toString('base64');
  }

  private async initAuthFlow(username: string): Promise<string> {
    const token = await this.createAuthToken({
      username: username,
      expiry: Date.now() + config.get<number>('magic_link.timeout'),
    });

    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: config.get<string>('auth.pool_id'),
      Username: username,
      UserAttributes: [
        { Name: config.get<string>('auth.challenge_attribute'), Value: token },
      ],
    });

    await this.cognito.send(command);
    return token;
  }

  private getFullName(name: {
    firstName: string;
    lastName: string;
    suffix?: string;
  }) {
    const { firstName, lastName, suffix } = name;
    return `${firstName} ${lastName}${suffix ? ` ${suffix}` : ''}`;
  }

  async login(input: LoginDto): Promise<void> {
    const client = createHasuraServiceClient();

    const personData = await client.request(personDocument, {
      email: input.email,
    });
    const username = personData.person[0].username;

    const dealData = await client.request(getDeal, {
      username,
    });
    const dealerData = await client.request(dealerDetailsDocument, {
      dealID: dealData.deal[0].id,
      now: new Date().toISOString(),
    });
    const dealer = dealerData.assignedDealParties[0].party!.company!;

    let token: string;
    try {
      token = await this.initAuthFlow(username);
    } catch (err: any) {
      throw new NotFoundException(err.message);
    }

    await this.mailerService.sendMail({
      to: input.email,
      template: 'new-magic-link',
      subject: 'Your temporary magic link login',
      context: {
        url: this.buildMagicLink(
          dealer.dealerDetails[0].subdomain,
          username,
          token,
          input.email,
        ),
        dealerLogoURL: dealer.document!.locationUrl!,
      } satisfies EmailLayoutDto,
    });
  }

  async impersonate(
    user: UserDto,
    input: ImpersonateDto,
  ): Promise<ImpersonationDto> {
    const client = createHasuraUserClient(user);

    const dealData = await client.request(getDeal, {
      username: user.id,
    });

    const coborrowersData = await client.request(coborrowersDocument, {
      dealID: dealData.deal[0].id,
    });

    const coborrowers = coborrowersData.assignedDealParties.map(
      (dp) => dp.party!.person!.primaryEmail!,
    );

    if (!coborrowers.includes(input.coborrowerEmail)) {
      throw new InternalServerErrorException('Something went wrong!');
    }
    const coborrowerUsername = coborrowersData.assignedDealParties.find(
      (dp) => dp.party!.person!.primaryEmail === input.coborrowerEmail,
    )!.party!.person!.username;

    let token: string;
    try {
      token = await this.initAuthFlow(coborrowerUsername);
    } catch (err: any) {
      throw new NotFoundException(err.message);
    }

    return {
      token,
    };
  }

  private getCognitoCreateUserCommand(username: string, email: string) {
    return new AdminCreateUserCommand({
      Username: username,
      UserPoolId: config.get<string>('auth.pool_id'),
      MessageAction: 'SUPPRESS',
      UserAttributes: [{ Name: 'email', Value: email }],
    });
  }

  private getCogintoAddUserToGroupCommand(username: string, role: string) {
    return new AdminAddUserToGroupCommand({
      GroupName: role,
      UserPoolId: config.get<string>('auth.pool_id'),
      Username: username,
    });
  }

  private getCognitoSetUserPwdCommand(username: string) {
    return new AdminSetUserPasswordCommand({
      UserPoolId: config.get<string>('auth.pool_id'),
      Username: username,
      Password: generate({
        length: 20,
        lowercase: true,
        numbers: true,
        symbols: true,
        uppercase: true,
        strict: true,
      }),
      Permanent: true,
    });
  }

  private getCognitoDeleteUserCommand(username: string) {
    return new AdminDeleteUserCommand({
      Username: username,
      UserPoolId: config.get<string>('auth.pool_id'),
    });
  }

  async createCognitoUser(username: string, email: string, role: string) {
    const createUserCommand = await this.getCognitoCreateUserCommand(
      username,
      email,
    );
    const addToGroupCommand = await this.getCogintoAddUserToGroupCommand(
      username,
      role,
    );
    const setUserPwdCommand = await this.getCognitoSetUserPwdCommand(username);

    await this.cognito.send(createUserCommand);
    await this.cognito.send(addToGroupCommand);
    await this.cognito.send(setUserPwdCommand);
  }

  async register(input: RegisterDto): Promise<RegistrationDto> {
    const client = createHasuraServiceClient();

    const { userRole } = await client.request(rolesDocument);
    const role = userRole.find((r) => r.id === input.data.roleId);
    if (!role) throw new BadRequestException('Invalid role ID');

    const existingPersons = await client.request(personDocument, {
      email: input.data.email,
    });
    if (existingPersons.person.length > 0) {
      throw new ConflictException();
    }

    const username = randomUUID();
    try {
      const { roleId, dealerCompanyId, ...other } = input.data;

      const [response] = await Promise.all([
        client.request(insertPersonDocument, {
          email: other.email,
          firstName: other.firstName,
          lastName: other.lastName,
          suffix: other.suffix,
          phone: other.phone,
          username: username,
          fullName: this.getFullName(other),
        }),
        this.createCognitoUser(username, other.email, role.name!),
      ]);

      if (roleId == 1) {
        const hasDealer = !!dealerCompanyId;
        await client.request(insertTasksDocument, {
          borrowerID: response.insert_person_one!.id,
          dealerCompanyID: dealerCompanyId,
          shouldCreateDeal: other.isPrimaryBorrower && hasDealer,
          profileTypeID: other.buyerProfileType ?? 1,
        });
      }

      const token = await this.initAuthFlow(username);
      return {
        id: response.insert_person_one!.id,
        token,
        username,
      };
    } catch (err) {
      await Promise.all([
        this.cognito.send(
          new AdminDeleteUserCommand({
            Username: username,
            UserPoolId: config.get<string>('auth.pool_id'),
          }),
        ),
        client.request(deletePersonDocument, { email: input.data.email }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function
      ]).catch(() => {});

      throw err;
    }
  }

  async registerLoanOfficer(
    input: RegisterLoanOfficerDto,
  ): Promise<RegistrationDto> {
    const client = createHasuraServiceClient();

    const existingPersons = await client.request(personDocument, {
      email: input.data.email,
    });
    if (existingPersons.person.length > 0) {
      throw new ConflictException();
    }

    const username = randomUUID();
    try {
      const [response] = await Promise.all([
        client.request(insertPersonDocument, {
          email: input.data.email,
          firstName: input.data.firstName,
          lastName: input.data.lastName,
          suffix: input.data.suffix,
          phone: input.data.phone,
          username: username,
          fullName: this.getFullName(input.data),
        }),
        this.createCognitoUser(username, input.data.email, 'loan-officer'),
      ]);

      const token = await this.initAuthFlow(username);
      return {
        id: response.insert_person_one!.id,
        token,
        username,
      };
    } catch (err) {
      await Promise.all([
        this.getCognitoDeleteUserCommand(username),
        client.request(deletePersonDocument, { email: input.data.email }),
        // eslint-disable-next-line @typescript-eslint/no-empty-function
      ]).catch(() => {});

      throw err;
    }
  }

  async invite(coborrower: Coborrower) {
    const client = createHasuraServiceClient();

    const { userRole } = await client.request(rolesDocument);
    const role = userRole.find((r) => r.id === coborrower.roleId);
    if (!role) throw new BadRequestException('Invalid role ID');

    let username = randomUUID();
    const createCommand = this.getCognitoCreateUserCommand(
      username,
      coborrower.email,
    );

    let skipPasswordCreation = false;
    let newPersonID = 0;

    const data = await client.request(personDocument, {
      email: coborrower.email,
    });

    if (data.person.length > 0) {
      skipPasswordCreation = true;
      username = data.person[0].username as ReturnType<typeof randomUUID>;
      newPersonID = data.person[0].id;
    } else {
      await this.cognito.send(createCommand);
    }

    let groupCommand = null;
    let passwordCommand = null;
    if (!skipPasswordCreation) {
      passwordCommand = this.getCognitoSetUserPwdCommand(username);
      groupCommand = this.getCogintoAddUserToGroupCommand(username, role.name!);

      try {
        const [response] = await Promise.all([
          client.request(insertPersonDocument, {
            username: username,
            email: coborrower.email,
          }),
          groupCommand && this.cognito.send(groupCommand),
          passwordCommand && this.cognito.send(passwordCommand),
        ]);

        newPersonID = response.insert_person_one!.id!;
      } catch (err) {
        await Promise.all([
          !skipPasswordCreation &&
            this.cognito.send(this.getCognitoDeleteUserCommand(username)),
          client.request(deletePersonDocument, { email: coborrower.email }),
          // eslint-disable-next-line @typescript-eslint/no-empty-function
        ]).catch(() => {});
        throw err;
      }
    }
    await client.request(insertTasksDocument, {
      borrowerID: newPersonID,
      shouldCreateDeal: false,
      profileTypeID: coborrower.profileTypeId,
    });

    if (!newPersonID)
      throw new InternalServerErrorException('Something went wrong!');

    return {
      id: newPersonID,
      username: username,
    };
  }

  async inviteCoborrowers(user: UserDto, dto: InviteCoborrowersDto) {
    const client = createHasuraUserClient(user);
    const userDetails = await client.request(personByUsernameDocument, {
      username: user.id,
    });
    const dealerData = await client.request(dealerDetailsDocument, {
      dealID: dto.data.dealId,
      now: new Date().toISOString(),
    });
    const dealer = dealerData.assignedDealParties[0].party!.company!;
    const serviceClient = createHasuraDelegateClient(user);
    await Promise.all(
      dto.data.coborrowers.map(async (c) => {
        // creates cognito user and inserts into person table
        const { id: newPersonID, username } = await this.invite(c);
        try {
          await serviceClient.request(registerCoborrowerDocument, {
            dealId: dto.data.dealId,
            id: newPersonID,
            dealParty: {
              dealID: dto.data.dealId,
              party: {
                data: {
                  personID: newPersonID,
                  partyRoleID: 2,
                },
              },
            },
          });
        } catch (err) {
          console.log('err', err);
          throw err;
        }

        let token: string;
        try {
          token = await this.initAuthFlow(username);
        } catch (err: any) {
          throw new NotFoundException(err.message);
        }

        this.mailerService.sendMail({
          to: c.email,
          template: 'coborrower-welcome-email',
          subject: `${userDetails.person[0].fullName!} needs your help`,
          context: {
            primaryBorrower: userDetails.person[0].fullName!,
            dealerLogoURL: dealer.document!.locationUrl!,
            url: this.buildMagicLink(
              dealer.dealerDetails[0].subdomain,
              username,
              token,
              c.email,
            ),
          } satisfies CoBorrowerEmailDto,
        });
      }),
    ).catch((err) => {
      throw err;
    });
  }

  async registerCoborrower(
    user: UserDto,
    dto: RegisterCoborrowerDto,
  ): Promise<RegistrationDto> {
    const client = createHasuraUserClient(user);

    const dealData = await client.request(getDeal, {
      username: user.id,
    });

    const dealerData = await client.request(dealerDetailsDocument, {
      dealID: dealData.deal[0].id,
      now: new Date().toISOString(),
    });
    const dealer = dealerData.assignedDealParties[0].party!.company!;

    const primaryParty = await client.request(primaryDealPartyDocument, {
      dealID: dealData.deal[0].id,
    });
    if (
      user.id !== primaryParty.assignedDealParties[0].party!.person!.username
    ) {
      throw new ForbiddenException(
        'Only primary borrower can invite coborrower',
      );
    }

    const userDetails = await client.request(personByUsernameDocument, {
      username: user.id,
    });
    const coborrower = await this.register({
      data: {
        ...dto.coborrower,
        buyerProfileType: dto.coborrower.buyerProfileType ?? 1,
        isPrimaryBorrower: false,
        roleId: 1,
      },
    })
      .then((resp) => resp)
      .catch(async (err) => {
        throw err;
      });

    const serviceClient = createHasuraDelegateClient(user);
    await serviceClient.request(registerCoborrowerDocument, {
      dealId: dto.dealId,
      id: coborrower.id,
      dealParty: {
        dealID: dto.dealId,
        party: {
          data: {
            personID: coborrower.id,
            partyRoleID: 2,
          },
        },
      },
    });

    this.mailerService.sendMail({
      to: dto.coborrower.email,
      template: 'coborrower-welcome-email',
      subject: `${userDetails.person[0].fullName!} needs your help`,
      context: {
        primaryBorrower: userDetails.person[0].fullName!,
        dealerLogoURL: dealer.document!.locationUrl!,
        url: this.buildMagicLink(
          dealer.dealerDetails[0].subdomain,
          coborrower.username,
          coborrower.token!,
          dto.coborrower.email,
        ),
      } satisfies CoBorrowerEmailDto,
    });

    return {
      id: coborrower.id,
      token: coborrower.token,
      username: coborrower.username,
    };
  }
  buildMagicLink(
    subdomain: string,
    username: string,
    token: string,
    email: string,
  ): string {
    const baseUrl = new URL(config.get<string>('web_base_url'));
    baseUrl.host = subdomain + '.' + baseUrl.host;
    const base = baseUrl.toString().slice(0, baseUrl.toString().length - 1);

    return (
      base +
      config.get<string>('magic_link.callback_url') +
      `?username=${encodeURIComponent(username)}` +
      `&token=${encodeURIComponent(token)}` +
      `&email=${encodeURIComponent(email)}`
    );
  }
}
