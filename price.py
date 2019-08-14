# Changes the price of an item
import sys

infile = open("./kigaruweb/src/food/" + str(sys.argv[1]) + ".js", 'r')
lines = infile.readlines()
infile.close()


outfile = open("./kigaruweb/src/food/" + str(sys.argv[1]) + ".js", 'w')


skip = False



for line in lines:
    if skip == True:
        skip = False
        continue
    if str(sys.argv[2]) in line:
        outfile.write(line)
        outfile.write("    price: " + sys.argv[3] + ',\n')
        skip = True
        continue
    outfile.write(line)

outfile.close()