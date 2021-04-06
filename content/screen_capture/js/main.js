let APP_ID="773D12BD-8A51-4DB6-AF33-F59D189F006C";

let directCall;

function init() {
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
  let uniqueid = "unique-id";
  SendBirdCall.addListener(uniqueid, {
    onRinging: (call) => {
      console.log(`Call Is Ringing Call ID ==> ${call._callId}`);
      console.log('Caller Info: ', call.caller);
      console.log('Custom Items: ',call.customItems);
      document.getElementById('btnDial').disabled = true;
      registCallEvent(call);
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
    document.getElementById('btnLocalViewCapture').disabled = false;
    document.getElementById('btnRemoteViewCapture').disabled = false;
  };

  call.onEnded = (call) => {
    console.log("Call Ended");
    console.log(call);
    document.getElementById('btnDial').disabled = false;
    document.getElementById('btnAccept').disabled = false;

    document.getElementById('btnLocalViewCapture').disabled = true;
    document.getElementById('btnRemoteViewCapture').disabled = true;
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
        // regist effect sound
        SendBirdCall.addDirectCallSound(SendBirdCall.SoundType.DIALING, '../../resource/sound/Dialing.mp3');
        SendBirdCall.addDirectCallSound(SendBirdCall.SoundType.RINGING, '../../resource/sound/Ringing.mp3');
        SendBirdCall.addDirectCallSound(SendBirdCall.SoundType.RECONNECTING, '../../resource/sound/Reconnecting.mp3');
        SendBirdCall.addDirectCallSound(SendBirdCall.SoundType.RECONNECTED, '../../resource/sound/Reconnected.mp3');

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

async function localViewCapture(){
  try {
    const resultImage = await directCall.captureLocalVideoView();
    console.log('local video view captured');
    console.log(resultImage);
    document.getElementById('captureResult').src = resultImage.data;
  } catch(e) {
    console.error('local video view capture error');
    console.error(e);
  }
}

async function remoteViewCapture(){
  try {
    const resultImage = await directCall.captureRemoteVideoView();
    console.log('local remote view captured');
    console.log(resultImage);
    document.getElementById('captureResult').src = resultImage.data;
  } catch(e) {
    console.error('remote video view capture error');
    console.error(e);
  }
}