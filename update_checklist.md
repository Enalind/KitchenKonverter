# How To Update The Extension
1. Run tests:
    1. cd scripts
    2. npm run test
2. Make sure to update the version number in the manifest.json
3. Make a new git commit and push to github
    1. git add . 
    2. git commit -m 'Commit message here'
    3. "git push origin master"
4. Package the extension:
    1. conda activate
    2. python package.py
5. Test the packaged extension in all browsers
6. Package to .crx and .pem:
    1. Go to chrome://extensions
    2. Click pack extension in the top left corner
    3. Select the Unpackaged directory
    4. Place the resulting files in the "CRX and PEM" dir
    5. Repeat for the firefox directory
7. Update on [Microsoft Partner Center](https://partner.microsoft.com/en-us/dashboard/microsoftedge/overview) by uploading Kitchen_Konverter.zip
8. Update on [Firefox](https://addons.mozilla.org/en-US/developers/addon/kitchenkonverter/versions/submit/) by uploading Firefox.crx
9. Update on [Chrome](https://chrome.google.com/webstore/devconsole/) by uploading Kitchen_Konverter.zip
10. Update on Opera if you want
