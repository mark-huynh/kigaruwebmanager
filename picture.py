import sys

infile = open("./kigaruweb/src/food/" + str(sys.argv[1]) + ".js", 'r')
lines = infile.readlines()
infile.close()

outfile = open("./kigaruweb/src/food/" + str(sys.argv[1]) + ".js", 'w')

outfile.write("import " + sys.argv[2] + " from './pictures/food/" + sys.argv[2] + ".jpg'\n")


skip = False

counter = 0

for line in lines:
    if counter == 2:
        outfile.write("    picture: " + sys.argv[2] + ',\n')
        counter = 0
        skip = False
        continue
    if skip == True:
        counter += 1
    if str(sys.argv[3]) in line and 'name:' in line.split():
        skip = True
    outfile.write(line)

outfile.close()


# user on UI will choose name from dropdown and then type name of image
