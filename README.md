# Example app for MiSnap Cordova plugin

Install the plugin from the Github repo

    cordova plugin add https://github.com/moven/moven-cordova-plugin-misnap

Or install the plugin from a local copy

    cordova plugin add path/to/moven-cordova-plugin-misnap

Install the platforms

    cordova platform add android
    cordova platform add ios

Run the app

    cordova run ios
    cordova run android

For development, you can try and link the plugin so edits in this app are reflected in the plugin

    cordova plugin rm cordova-plugin-misnap
    cordova plugin add ~/cordova-plugin-misnap --link

## iOS Troubleshooting

    dyld: Library not loaded: @rpath/MobileFlow.framework/MobileFlow

1. The issue is that Cordova does not support embedded binaries which are required in the newer versions of the Mitek 
SDK.  You can manually add the embedded binary in XCode.  In the project navigator, under Targets, Build Settings, 
Embedded Binaries, add MobileFlow.framework
1. For a permanent solution / hack, see [this StackOverflow question](http://stackoverflow.com/questions/24993752/os-x-framework-library-not-loaded-image-not-found)

Another error you might see is:

    ld: library not found for -lMiSnap
    clang: error: linker command failed with exit code 1 (use -v to see invocation)
    

1. Remove libMiSnap.a from "Linked Frameworks and Libraries"
1. From the Project Navigator in xCode, drag MiSnap/Frameworks/libMiSnap.a onto "Linked Frameworks and Libraries"
1. Compile and redeploy to your phone
