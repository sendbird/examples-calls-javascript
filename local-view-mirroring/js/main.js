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
  };

  call.onEnded = (call) => {
    console.log("Call Ended");
    console.log(call);
    document.getElementById('btnDial').disabled = false;
    document.getElementById('btnAccept').disabled = false;
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

function localViewMirror(){
  let localView = document.getElementById('local_view');
  if(localView.classList.contains('mirror')) {
    localView.classList.remove('mirror');
  } else {
    localView.classList.add('mirror');
  }
}