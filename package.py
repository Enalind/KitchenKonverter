import shutil
import os
import subprocess
import time

def copyToBoth(source, target):
    shutil.copy(os.getcwd() +  "\\" + source, unpackagedPath + "\\" + target)
    shutil.copy(os.getcwd() +  "\\" + source, sourcePath + "\\" + target)

newVersionNr = input("Give me the new versionNr: ")

newPath = os.path.dirname(os.getcwd()) + "\\V" + newVersionNr
unpackagedPath = newPath + "\\" + "Unpackaged"
sourcePath = newPath + "\\" + "Kitchen_Konverter_Source"
zipsPath = newPath + "\\" + "Zips"
os.mkdir(newPath)

os.mkdir(newPath + "\\" + "CRX and PEM")
os.mkdir(sourcePath)
os.mkdir(unpackagedPath)
os.mkdir(zipsPath)
os.mkdir(unpackagedPath + "\\scripts")
###
cwd = os.getcwd()
os.chdir(cwd+"\\scripts")
process = subprocess.Popen("npm run build", shell=True)
os.chdir(cwd)
###
time.sleep(2)
process.kill()
shutil.copy(os.getcwd() +  "\\scripts\\dist\\bundle.js", unpackagedPath + "\\scripts\\bundle.js")

shutil.copy(os.getcwd() +  "\\scripts\\dist\\popup.js", unpackagedPath + "\\scripts\\popup.js")

shutil.copy(os.getcwd() +  "\\scripts\\dist\\background.js", unpackagedPath + "\\scripts\\background.js")

copyToBoth("index.html", "index.html")
copyToBoth("manifest.json", "manifest.json")
copyToBoth("styles.css", "styles.css")


shutil.copytree(os.getcwd() + "\\assets", unpackagedPath + "\\assets")
shutil.copytree(os.getcwd() + "\\assets", sourcePath + "\\assets")

shutil.copytree(os.getcwd() + "\\icon", unpackagedPath + "\\icon")
shutil.copytree(os.getcwd() + "\\icon", sourcePath + "\\icon")
filedata = None
with open(unpackagedPath + "\\manifest.json", "r") as f:
    filedata = f.read()

filedata = filedata.replace('"js": ["scripts/dist/bundle.js"],', '"js": ["scripts/bundle.js"],')
filedata = filedata.replace('"scripts/dist/background.js"', '"scripts/background.js"')

with open(unpackagedPath + "\\manifest.json", "w") as f:
    f.write(filedata)

shutil.copytree(os.getcwd() + "\\scripts\\src", sourcePath + "\\scripts\\src")
shutil.copytree(os.getcwd() + "\\scripts\\dist", sourcePath + "\\scripts\\dist")

shutil.copy(os.getcwd() +  "\\scripts\\.babelrc", sourcePath + "\\scripts\\.babelrc")
shutil.copy(os.getcwd() +  "\\scripts\\package.json", sourcePath + "\\scripts\\package.json")
shutil.copy(os.getcwd() +  "\\scripts\\package-lock.json", sourcePath + "\\scripts\\package-lock.json")


shutil.copytree(unpackagedPath, newPath + "\\Firefox")

with open(newPath + "\\Firefox\\manifest.json", "r") as f:
    filedata2 = f.readlines()
filedata2.insert(1, '    "browser_specific_settings": {"gecko": {"id": "enalindstrom@gmail.com"}}, \n')
with open(newPath + "\\Firefox\\manifest.json", "w") as f:
    f.writelines(filedata2)

shutil.make_archive(zipsPath + "\\Kitchen_Konverter", "zip", unpackagedPath)
shutil.make_archive(zipsPath + "\\Kitchen_Konverter_Source", "zip", sourcePath)

print("Done!")