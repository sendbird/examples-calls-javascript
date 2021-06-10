let directCall;
let callLogQuery = null;

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
    console.log(`call log = ${JSON.stringify(call.callLog)}`);
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
        document.getElementById('btnGetCallHistory').disabled = false;
        callLogQuery = null;
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
            localMediaView: document.getElementById('localView'),
            remoteMediaView: document.getElementById('remoteView'),
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
      remoteMediaView: document.getElementById('removeView'),
      localMediaView: document.getElementById('localView'),
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

function getCallLogs(){
  callLogQuery.next((directCallLog) => {
    if(directCallLog.length > 0){
      directCallLog.forEach( (callLog) => {
        insertCallLog(callLog);
      });

      if(callLogQuery.hasNext || callLogQuery.isLoading) {
        document.getElementById('btnGetMoreCallHistory').disabled = false;
      } else {
        document.getElementById('btnGetMoreCallHistory').disabled = true;
      }
    } else {
      console.log('Call History is Empty');
    }
  });
}

function getCallHistory(){
  const params = {
    limit: 30,
  };
  callLogQuery = SendBirdCall.createDirectCallLogListQuery(params);
  getCallLogs();
}

function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours || 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  let strTime = hours + ':' + minutes + ampm;
  return strTime;
}

function insertCallLog(callLog){
  const element = document.getElementById('tblCallLog');
  let tr = document.createElement('tr');
  tr.setAttribute('id', callLog.callId);
  tr.style = "vertical-align: top";
  let callTypeColumn = document.createElement('td');

  // get call type
  callTypeColumn.appendChild(document.createTextNode(callLog.isVideoCall?'video':'audio'));
  tr.appendChild(callTypeColumn);

  // get call start time
  let startTimeColumn = document.createElement('td');
  let callStartTime = new Date(callLog.startedAt);
  let callStartTimeLabel = `${callStartTime.getFullYear()}/${callStartTime.toLocaleString(['en-US'], {month: '2-digit'})}/${callStartTime.toLocaleString(['en-US'], {day: '2-digit'})} ${this.formatAMPM(callStartTime)}`;
  startTimeColumn.appendChild(document.createTextNode(callStartTimeLabel));
  tr.appendChild(startTimeColumn);

  // get call duration
  let callDurationTime = '';
  if(callLog.duration > 0){
    let tempDuration = Math.ceil(callLog.duration / 1000);
    let hour = parseInt(tempDuration / 3600);
    let min = parseInt((tempDuration - (hour * 3600)) / 60);
    let sec = tempDuration - (hour * 3600) - (min * 60);
    if(hour > 0){
      callDurationTime = hour + 'h ';
    }
    if(min > 0){
      callDurationTime += (min + 'm ');
    }
    callDurationTime += (sec + 's');
  } else {
    callDurationTime = '0s';
  }

  let durationColumn = document.createElement('td');
  durationColumn.appendChild(document.createTextNode(callDurationTime));
  tr.appendChild(durationColumn);

  // get name & direction
  let displayName = "";
  let direction = "";
  if(callLog.userRole === 'dc_caller'){
    displayName = callLog.callee.nickname || callLog.callee.userId;
    direction = "send";
  } else {
    displayName = callLog.caller.nickname || callLog.caller.userId;
    direction = "recv";
  }

  let nameColumn = document.createElement('td');
  nameColumn.appendChild(document.createTextNode(displayName));
  tr.appendChild(nameColumn);

  let directionColumn = document.createElement('td');
  directionColumn.appendChild(document.createTextNode(direction));
  tr.appendChild(directionColumn);

  element.appendChild(tr);
}