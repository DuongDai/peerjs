const socket = io('https://mypeer0611.herokuapp.com/');

$('#div-chat').hide();

socket.on('USER_ONLINE', arrUser => {
    $('#div-chat').show();
    $('#div-register').hide();

    arrUser.forEach(user => {
        const li = "<li id='" + user.peerId  + "'>" + user.ten + "</li>";
        $('#ulUser').append(li);
    });
    socket.on('NEW_USER_ONLINE', arrUser => {
        $('#ulUser').html('');
        arrUser.forEach(user => {
            const li = "<li id='" + user.peerId  + "'>" + user.ten + "</li>";
            $('#ulUser').append(li);
        })
    });
});

socket.on('REGISTER_FAIL', () => {
    alert('Vui lòng chọn username khác');
});

socket.on('DIS-AI-DO', userId => {

});
function openStream() {
    const config = { audio: false, video: true};
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

const peer = new Peer(
    {
        key: 'peerjs',
        host: 'https://mypeer0611.herokuapp.com/',
        secure: true,
        port: 443,
    }
);

peer.on('open', id => {
    $('#my-peer').append(id);
    $('#btnSignUp').click(() => {
        const  username = $('#txtUserName').val();
        // gửi sự kiện có người đăng ký lên socketio
        socket.emit('REGISTER_USER', { ten: username, peerId: id});
    });
});

$('#btnCall').click(() => {
    const id = $('#remoteId').val();
    openStream()
        .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id,stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        })
});


//
peer.on('call', call => {
    openStream()
        .then(stream => {
            call.answer(stream);
            playStream('localStream', stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        })
});

$('#ulUser').on('click','li', function () {
   const id = $(this).attr('id');
    openStream()
        .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id,stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        })
});

