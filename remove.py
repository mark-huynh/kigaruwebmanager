import sys
import os

def peek_line(f):
    pos = f.tell()
    line = f.readline()
    f.seek(pos)
    return line

infile = open('./kigaruweb/src/food/' + str(sys.argv[1]) + '.js', 'r')
lines = infile.readlines()
numLines = infile.tell()


count = 0

infile_2 = open('./kigaruweb/src/food/' + str(sys.argv[1]) + '.js', 'r')

outfile = open('./kigaruweb/src/food/temp' + str(sys.argv[1]) + '.js', 'w+')


while infile_2.tell() < numLines:
    line = infile_2.readline()
    next = peek_line(infile_2)
    if str(sys.argv[2]) in next and 'name:' in next.split():
        count = 1
    if count == 7:
        count = 0
    if count != 0:
        count += 1
        continue
    outfile.write(line)   

infile.close()
infile_2.close()
outfile.close()

infile = open('./kigaruweb/src/food/temp' + str(sys.argv[1]) + '.js', 'r')
outfile = open('./kigaruweb/src/food/' + str(sys.argv[1]) + '.js', 'w')

lines = infile.readlines()

for line in lines:
    outfile.write(line)

infile.close()
outfile.close()

os.remove('./kigaruweb/src/food/temp' + str(sys.argv[1]) + '.js')