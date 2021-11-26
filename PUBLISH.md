# How to publish new app versions.

This manual describes steps to publish new versions of notarized Mana Security's app. Basically, it
requires 4 steps:
1. (optional) Issue and import necessarry Apple certificates.
2. (optional) Add APPLE_ID and APPLE_ID_PASS to environment variables.
3. Build ".app" and zip it.
4. Publish zip-archive in Mana's admin panel.

## 1. Issue and import necessarry Apple certificates
1. Open https://developer.apple.com/account/resources/certificates/list.
2. Click "+" to create a new certificate.
3. Pick "Developer ID Application" option and press "Continue".
4. Create "Certificate Signing Request" using this instruction: https://help.apple.com/developer-account/#/devbfa00fef7
5. Get back to the browser and upload CSR.
6. Apple should offer you an option to download the necessary certificate.
7. Open it in Finder and add it to the keychain.

## 2. Add APPLE_ID and APPLE_ID_PASS to environment variables.
1. Generate app-specific password for your Apple account here: https://appleid.apple.com.
2. Add your email to APPLE_ID environment variables.
3. Add your app-specific password from 2.1 to APPLE_ID_PASS environment variables.

## 3. Build ".app" and zip it.
1. Run `yarn package --mac` in the terminal.
2. Open `release/mac` folder and zip `.app` file.

## 4. Publish zip-archive in Mana's admin panel
1. Open our admin panel and pick `Electron updates` section.
2. Press "Add electron update" button.
3. Fill in necessary fields (version, platform and architecture) and upload the ZIP file from 3.2.
