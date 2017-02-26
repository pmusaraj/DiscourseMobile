#!/usr/bin/env node

var replace = require("replace");
require("./global.js");

replace({
    regex: "Discourse",
    replacement: global.appName,
    paths: ['app.json', 'ios/Discourse/Info.plist']
});

replace({
    regex: "discourse",
    replacement: global.urlScheme,
    paths: ['ios/Discourse/Info.plist']
});

replace({
    regex: "ONESIGNAL-APP-ID-HERE",
    replacement: global.oneSignalAppId,
    paths: ['ios/Discourse/AppDelegate.m']
});
