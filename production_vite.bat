@echo off
set path=%path%;C:\Android\android-sdk\ndk-bundle\build;C:\Android\android-sdk\platform-tools;C:\Data\Projects\Tools\gradle-7.3.3\bin
set ANDROID_HOME=C:\Android\android-sdk
set ANDROID_SDK_ROOT=C:\Android\android-sdk
set ANDROID_NDK_HOME=C:\Android\android-sdk\ndk-bundle
call npx vite build --outDir=cordova_app/www 
cd cordova_app
del /q /s www\.data\images\*.*
call cordova platform rm android
call cordova platform add android
xcopy /s /y ..\icon\android\*.* .\platforms\android\app\src\main\res\
call ..\signcode_release.bat