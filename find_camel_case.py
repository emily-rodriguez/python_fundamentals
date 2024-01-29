import os

def is_camel_case(s):
    if s != s.lower() and s != s.upper() and "_" not in s and sum(i.isupper() for i in s[1:-1]) == 1:
        return True
    return False


def find_camel_case(line):
    for s in line.split():
        if is_camel_case(s):
            print(f'Found Camel Case: {s}')

dir = 'files'

for root, dirs, files in os.walk(dir):
    for filename in files:
        print(f'Working on {filename}')

    old_file = os.path.join(os.path.abspath(root), filename)

    with open(old_file, 'r') as f:
        contents = f.readlines()

    for line in contents:
        find_camel_case(line)
