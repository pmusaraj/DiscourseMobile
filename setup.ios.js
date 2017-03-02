#!/usr/bin/env node

var replace = require("replace");
require("./global.js");

replace({
    regex: "Discourse",
    replacement: global.appName,
    paths: ['app.json', 'ios/Discourse/Info.plist']
});

replace({
    regex: "ONESIGNAL-APP-ID-HERE",
    replacement: global.oneSignalAppId,
    paths: ['ios/Discourse/AppDelegate.m']
});

replace({
    regex: "<string>discourse</string>",
    replacement: "<string>" + global.URLscheme + "</string>",
    paths: ['ios/Discourse/Info.plist']
});

console.log('Done replacing global variables')

