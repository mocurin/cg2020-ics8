import sys
import os
import json

if __name__ == '__main__':
    cmd, *args = sys.argv
    if len(args) > 1: raise ValueError(f"Got {' '.join(args)}, expected signle .obj file")
    path, ext = os.path.splitext(args[0])
    if ext != '.obj': raise ValueError(f"Got {ext} file, expected .obj file")
    with open(path + ext, 'r') as file:
        lines = list(file)
        vertices = [list(map(float, line.split()[1:])) for line in lines if line[0] == 'v']
        faces = [list(map(int, line.split()[1:])) for line in lines if line[0] == 'f']
        with open(path + '.json', 'w') as jsfile:
            jsfile.write(json.dumps({'v' : vertices, 'f': faces}))
