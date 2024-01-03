import os
from camel_converter import to_snake


olddir = 'old'
newdir = 'cleaned'


def is_camel_case(s):
    return s != s.lower() and s != s.upper() and "_" not in s and "-" not in s


def handle_id(s):
    print(f'STRING: {s}')
    if "ID" in s:
        return s.replace("ID", "Id")
    else:
        return s

def handle_special_cases(str):
    if is_camel_case(str):
        return to_snake(str)
    elif str[-1] == '_':
        split_str = str.split('_')
        return to_snake(split_str[0]) + '_'
    elif str[0] == '_':
        split_str = str.split('_')
        return '_' + to_snake(split_str[1])
    elif str[0] == 'pii_':
        split_str = str.split('_')
        return 'pii_' + to_snake(split_str[1])
    else:
        return str


for root, dirs, files in os.walk(olddir):
    for filename in files:
        print(f'Working on {filename}')

        old_file = os.path.join(os.path.abspath(root), filename)

        print(f'Copying {old_file}...')

        base, extension = os.path.splitext(filename)
        new_name = to_snake(filename)
        new_file = open(os.path.join(newdir, new_name), 'w')

        with open(old_file, 'r+') as f:
            contents = f.readlines()

        for line in contents:
            for s in line.split():
                edited = handle_id(s)
                replaced = handle_special_cases(edited)
                line = line.replace(s, replaced)
            print(f'Replaced Line: {line}')
            new_file.write(line)
