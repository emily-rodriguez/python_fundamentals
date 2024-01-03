import os
from camel_converter import to_snake
import shutil
import fileinput


olddir = 'old'
newdir = 'cleaned'

#copy and rename all files

def is_camel_case(s):
  if s != s.lower() and s != s.upper() and "_" not in s and sum(i.isupper() for i in s[1:-1]) == 1:
      return True
  return False


def contains_camel_case(line):
    for s in line.split():
        return is_camel_case(s)


def find_camel_case(line):
    for s in line.split():
        if is_camel_case(s):
            return s


def fix_line(line):
    camel_text = find_camel_case(line)
    print(f'Found camelcase! {camel_text}')
    new_text = to_snake(camel_text)
    return line.replace(camel_text, new_text)



for root, dirs, files in os.walk(olddir):
    for filename in files:
        old_name = os.path.join( os.path.abspath(root), filename )

        print(f'Copying {old_name}...')

        base, extension = os.path.splitext(filename)

        new_name = os.path.join(newdir, to_snake(filename))

        if not os.path.exists(new_name):
            shutil.copy(old_name, new_name)
            print(f'Copied {old_name} as {new_name}')


#replace all camelCase in copied files

for root, dirs, files in os.walk(olddir):
    for filename in files:
        print(f'Working on {filename}')

        old_file = os.path.join( os.path.abspath(root), filename )

        print(f'Copying {old_file}...')

        base, extension = os.path.splitext(filename)
        new_name = to_snake(filename)
        print(f'New file name: {new_name}')
        new_file = open(os.path.join(newdir, new_name), 'w')

        with open(old_file, 'r') as f:
            contents = f.readlines()

        for line in contents:
            # print(f'Line: {line}')
            if contains_camel_case(line):
                for s in line.split():
                    if is_camel_case(s):
                        line = line.replace(s, to_snake(s))
                        print(f'FIXED LINE: {line}')
                    print(f'Line 77 {line}')


            else:
                new_file.write(line)




