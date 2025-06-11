@echo off
if "%1"=="APK" goto APK

call cordova build android --release -- --packageType=bundle
call "%JAVA_HOME%\bin\jarsigner" ^
-verbose -keystore YourKeystorePath\android-release.keystore ^
-signedjar ..\..\deploy\app-release-signed.aab ^
platforms\android\app\build\outputs\bundle\release\app-release.aab ^
android-key  -digestalg SHA1 -tsa http://timestamp.digicert.com
C:\Android\android-sdk\build-tools\30.0.3\zipalign.exe -v 4 ..\..\deploy\app-release-signed.aab ..\..\deploy\app-release-signed-align.aab

:APK
call cordova build android --release -- --packageType=apk
call "%JAVA_HOME%\bin\jarsigner" ^
-verbose -keystore YourKeystorePath\android-release.keystore ^
-signedjar ..\..\deploy\app-release-signed.apk ^
platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk ^
android-key  -digestalg SHA1 -sigalg MD5withRSA  -tsa http://timestamp.digicert.com
C:\Android\android-sdk\build-tools\30.0.3\zipalign.exe -v 4 ..\..\deploy\app-release-signed.apk ..\..\deploy\app-release-signed-align.apk