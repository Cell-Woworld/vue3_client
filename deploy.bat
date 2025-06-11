@echo off
set path=%path%;C:\Android\android-sdk\ndk-bundle\build;C:\Android\android-sdk\platform-tools;C:\Data\Projects\Tools\gradle-7.3.3\bin
set ANDROID_HOME=C:\Android\android-sdk
set ANDROID_SDK_ROOT=C:\Android\android-sdk
set ANDROID_NDK_HOME=C:\Android\android-sdk\ndk-bundle
call npm run build
cd cordova_app
call cordova run android