# Examples for Sendbird Calls
![Platform](https://img.shields.io/badge/platform-javascript-orange.svg)
![Languages](https://img.shields.io/badge/language-javascript-orange.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/sendbird/quickstart-calls-ios/blob/develop/LICENSE.md)

## Introduction
SendBird provides `SendBirdCall` framework for your app enabling real-time `voice and video calls` between your users. This sample introduces an applications based on `SendBirdCall`.

## Prerequisites
- Node
- npm (or yarn)
- Modern browser, supporting WebRTC APIs.

## Creating a SendBird application
1. Login or Sign-up for an account at [dashboard](https://dashboard.sendbird.com/).
2. Create or select an application on the SendBird Dashboard.
3. Note the `Application ID` for future reference.
4. [Contact sales](https://sendbird.com/contact-sales) to get the `Calls` menu enabled in the dashboard. (Self-serve coming soon.)

## Creating test users
1. In the SendBird dashboard, navigate to the `Users` menu.
2. Create at least two new users, one that will be the `caller`, and one that will be the `callee`.
3. Note the `User ID` of each user for future reference.

## Installing and running the sample application
1\. Clone this repository 
```shell script
$ git clone git@github.com:sendbird/examples-calls-javascript.git
```
2\. Install dependencies
```shell script
$ cd examples-calls-javascript
$ npm install
```
3\. Start sample app
```shell script
$ npm start
```
4\. If two devices are available, repeat these steps to install the sample application on both the primary device and the secondary device.

## Samples

### [BaseExample](https://github.com/sendbird/examples-calls-javascript/tree/master/base-example)
`BaseExample` The example contains simple implementation of making and receiving a DirectCall. 

### [AudioOnlyCall](https://github.com/sendbird/examples-calls-javascript/tree/master/audio-call)
`AudioOnlyCall` The example contains simple implementation of making and receiving audio-only type call. 

### [AutoAcceptCall](https://github.com/sendbird/examples-calls-javascript/tree/master/auto-accept-call)
`AutoAcceptCall` The example contains simple implementation of auto accepting a call. 

### [AutoDeclineCall](https://github.com/sendbird/examples-calls-javascript/tree/master/auto-decline-call)
`AutoDeclineCall` The example contains simple implementation of auto declining a call. 

### [LocalRecording](https://github.com/sendbird/examples-calls-javascript/tree/master/local-recording)
`LocalRecording` The example contains simple implementation of local recording during a call.

### [ScreenCapture](https://github.com/sendbird/examples-calls-javascript/tree/master/screen-capture)
`ScreenCapture` The example contains an implementation of capturing local and remote video view during a call.

### [ScreenShare](https://github.com/sendbird/examples-calls-javascript/tree/master/screen-share)
`ScreenShare` The example contains an implementation of screen sharing during a call.

## Reference
[SendBird Calls JS SDK Readme](https://github.com/sendbird/sendbird-calls-javascript/blob/master/README.md)
