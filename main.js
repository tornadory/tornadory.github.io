//const socket = io('http://localhost:3000');
const socket = io('https://webrtc-peerjs-test.herokuapp.com');

$('#div-chat').hide();

socket.on('DANH_SACH_ONLINE', arrUserInfo => {
   $('#div-chat').show();
   $('#div-dang-ky').hide();
   console.log("user info : ");
   console.log(arrUserInfo);
   arrUserInfo.forEach(user=>{
       const{ten, peerId} = user;
       $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
   });

   socket.on('CO_NGUOI_DUNG_MOI', user => {
       console.log("user info : ");
       console.log(user);
       const{ten, peerId} = user;
       $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
   });

   socket.on('AI_DO_NGAT_KET_NOI',peerId => {
       $(`#${peerId}`).remove();
   });

});

socket.on('DANG_KY_THAT_BAT', ()=>alert('Vui long chon username khac!'));



function openStream(){
    const config = {audio:false, video:true};
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream){
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

//openStream().then(stream => playStream('localStream', stream));

//const conn = peer.connect('lfpz7smzx1e2ke29');

//const peer = new Peer({key: 'lfpz7smzx1e2ke29'});

//const peer = new Peer({key:'peerjs', host:'peerjs-webrtc-server.herokuapp.com', secure:true, port: 443});

//use xirsys
// This object will take in an array of XirSys STUN / TURN servers
// and override the original config object
var customConfig;

// Call XirSys ICE servers
$.ajax({
  url: "https://service.xirsys.com/ice",
  data: {
    ident: "tornadory",
    secret: "c689720a-5a45-11e7-9db9-18a16628344d",
    domain: "tornadory.github.io",
    application: "default",
    room: "default",
    secure: 1
  },
  success: function (data, status) {
    // data.d is where the iceServers object lives
    customConfig = data.d;
    console.log(customConfig);
  },
  async: false
});

// PeerJS object
const peer = new Peer({
  key:'peerjs',
  host:'peerjs-webrtc-server.herokuapp.com',
  secure:true,
  port: 443,
  config: customConfig
});
//var peer = new Peer({
//  key: 'Your PeerServer cloud API key',
//  debug: 3,
//  config: customConfig
//});
//end use xirsys

peer.on('open', id => {
    $('#my-peer').append(id);
    $('#btnSignUp').click(()=>{
        const username = $('#txtUsername').val();
        socket.emit('NGUOI_DUNG_DANG_KY', {ten: username, peerId: id});
    });
});

//caller
$('#btnCall').click(() => {
    const id = $('#remoteId').val();
    openStream().then(stream => {
       playStream('localStream', stream);
       const call = peer.call(id, stream);
       call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

peer.on('call', call => {
    openStream().then( stream =>{
        call.answer(stream);
        playStream('localStream', stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

$('#ulUser').on('click', 'li', function(){
    console.log($(this).attr('id')); //peerId
    const id = $(this).attr('id');
    openStream().then(stream => {
        playStream('localStream', stream);
       const call = peer.call(id, stream);
       call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});
