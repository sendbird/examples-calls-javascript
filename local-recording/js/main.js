const { RecordingStatus } = require("sendbird-calls");

let directCall;
let recordingId;

function init() {
  const recordingOtion = document.getElementById('selectRecordingOption');

  let option = document.createElement("option");
  option.text = "remote(audio/video)";
  option.value = SendBirdCall.RecordingType.REMOTE_AUDIO_AND_VIDEO;
  recordingOtion.add(option);

  option = document.createElement("option");
  option.text = "remote(audio)";
  option.value = SendBirdCall.RecordingType.REMOTE_AUDIO_ONLY;
  recordingOtion.add(option);

  option = document.createElement("option");
  option.text = "local(audio) and remote(audio)";
  option.value = SendBirdCall.RecordingType.LOCAL_REMOTE_AUDIOS;
  recordingOtion.add(option);

  option = document.createElement("option");
  option.text = "local(audio) and remote(audio/video)";
  option.value = SendBirdCall.RecordingType.LOCAL_AUDIO_REMOTE_AUDIO_AND_VIDEO;
  option.defaultSelected = true;
  recordingOtion.add(option);

  option = document.createElement("option");
  option.text = "local(audio/video) and remote(audio)";
  option.value = SendBirdCall.RecordingType.LOCAL_AUDIO_AND_VIDEO_REMOTE_AUDIO;
  recordingOtion.add(option);
}

function sdkInit() {
  const app_id = document.getElementById('appId').value;
  if(app_id){
    SendBirdCall.init(app_id);
    registSendBirdEventHandler()
    console.log('sendbird-call SDK init');
    document.getElementById('btnInit').disabled = true;
  } else {
    alert('need APP ID');
  }
}

function registSendBirdEventHandler(){
  SendBirdCall.addListener("unique-id", {
    onRinging: (call) => {
      console.log(`Call Is Ringing Call ID ==> ${call._callId}`);
      console.log('Caller Info: ', call.caller);
      console.log('Custom Items: ',call.customItems);
      document.getElementById('btnDial').disabled = true;
      registCallEvent(call);
    }
  });

  SendBirdCall.addRecordingListener("unique-id-1", {
    onRecordingSucceeded: (callId, recordingId, options, fileName) => {
      console.log(`recording succeeded callid=${callId}, recordingId=${recordingId}, recordingFileName=${fileName}`);
    },
    onRecordingFailed: (callId, recordingId, error) => {
      console.log(`recording failed callid=${callId}, recordingId=${recordingId}, error=${error}`);
    }
  });
}

function registCallEvent(call){
  directCall = call;

  call.onEstablished = (call) => {
    console.log("Call is Established");
    console.log(call);
  };

  call.onConnected = (call) => {
    console.log("Call is Connected");
    console.log(call);
    document.getElementById('btnStartRecording').disabled = false;
  };

  call.onEnded = (call) => {
    console.log("Call Ended");
    console.log(call);
    document.getElementById('btnDial').disabled = false;
    document.getElementById('btnAccept').disabled = false;
    document.getElementById('btnStartRecording').disabled = true;
  };

  call.onRemoteAudioSettingsChanged = (call) => {
    if(call.isRemoteAudioEnabled){
      console.log(`Remote Audio unmuted`);
    } else {
      console.log(`Remote Audio muted`);
    }
  };

  call.onRemoteVideoSettingsChanged = (call) => {
    if(call.isRemoteVideoEnabled){
      console.log(`Remote Video started`);
    } else {
      console.log(`Remote Video stoped`);
    }
  };

  call.onRemoteRecordingStatusChanged = (call) => {
    if(call.remoteRecordingStatus === RecordingStatus.RECORDING){
      console.log('The remote user has started recording');
    } else if (call.remoteRecordingStatus == RecordingStatus.NONE){
      console.log('The remote user has stopped recording');
    }
  }
}

function auth(){
  let userId = document.getElementById('userId').value;
  if(userId){
    const authOption = { userId: userId, accessToken: "" };

    SendBirdCall.authenticate(authOption,(user,error)=>{
      if (error) {
        console.error(`SendBird Authenticate Error = ${error}`);
        return ;
      } else {
        console.log('authenticated');
        console.log(user);
        
        // request connect websocekt server
        SendBirdCall.connectWebSocket();
        document.getElementById('btnAuth').disabled = true;
      }
    });
  } else {
    alert('need user id');
  }
}

async function callDial(){
  const calleeId = document.getElementById('calleeId').value;
  if(calleeId){
    const dialParams = {
        userId: calleeId,
        isVideoCall: true,
        callOption: {
            localMediaView: document.getElementById('local_view'),
            remoteMediaView: document.getElementById('remote_view'),
            audioEnabled: true,
            videoEnabled: true
        }
    };

    try{
      const call = await SendBirdCall.dial(dialParams);
      console.log('dial');
      document.getElementById('btnDial').disabled = true;
      document.getElementById('btnAccept').disabled = true;
      registCallEvent(call);
    } catch(error){
      console.error(`dial fail error = ${error}`);
    }
    
  } else {
    alert('need target user id');
  }
}

function callAccept(){
  const acceptParams = {
    callOption: {
      remoteMediaView: document.getElementById('remote_view'),
      localMediaView: document.getElementById('local_view'),
      audioEnabled: true,
      videoEnabled: true
    }
  };
  console.log("Call Accepted");
  document.getElementById('btnAccept').disabled = true;
  directCall.accept(acceptParams);
}

function callEnd() {
  if(directCall) directCall.end();
}

function startVideo(){
  console.log(`start video`);
  directCall.startVideo();
}

function stopVideo(){
  console.log(`stop video`);
  directCall.stopVideo();
}

function muteAudio(){
  console.log(`mute audio`);
  directCall.muteMicrophone();
}

function unmuteAudio(){
  console.log(`unmute audio`);
  directCall.unmuteMicrophone();
}

function startRecording(){
  const recordingOption = document.getElementById('selectRecordingOption').value;
  let option = new SendBirdCall.DirectCallRecordOption({
    recordingType: recordingOption,
    callId: directCall.callId,
    fileName: 'recording_file.mp4'
  });

  recordingId = directCall.startRecording(option);
  if(recordingId){
    console.log(`recording succeed recordingID = ${recordingId}`);
    document.getElementById('btnStartRecording').disabled = true;
    document.getElementById('btnStopRecording').disabled = false;
  } else {
    console.log('recording faile');
  }
}

function stopRecording(){
  directCall.stopRecording(recordingId);
  document.getElementById('btnStartRecording').disabled = false;
  document.getElementById('btnStopRecording').disabled = true;
}