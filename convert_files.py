import os
from camel_converter import to_snake
import shutil


olddir = 'old'
newdir = 'cleaned'

#copy and rename all files

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

for root, dirs, files in os.walk(newdir):
    for filename in files:
        print(f'Working on {filename}')
