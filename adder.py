import sys

with open("./kigaruweb/src/food/" + str(sys.argv[1]) + ".js") as f_old:
    lines = f_old.readlines()

with open("./kigaruweb/src/food/" + str(sys.argv[1]) + ".js", "w") as f_new:
    for line in lines:
        f_new.write(line)
        if str(sys.argv[2]) in line:
            f_new.write("    {\n      name: \"" + sys.argv[3] + "\",\n      price: " + sys.argv[4] + ",\n      description: \"" + sys.argv[5] + "\"\n    },\n")
