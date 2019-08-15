import sys

infile = open("./kigaruweb/src/food/" + str(sys.argv[1]) + ".js", 'r')
lines = infile.readlines()
infile.close()

outfile = open("./kigaruweb/src/food/" + str(sys.argv[1]) + ".js", 'w')


skip = False

counter = 0

for line in lines:
    if counter == 1:
        outfile.write("    description: \"" + sys.argv[3] + '\",\n')
        counter = 0
        skip = False
        continue
    if skip == True:
        counter += 1
    if str(sys.argv[2]) in line and 'name:' in line.split():
        skip = True
    outfile.write(line)
        
outfile.close()
