var io = require('socket.io')(3000);

const arrUser = [];

io.on('connection', socket => {
    socket.on('REGISTER_USER', user => {
        // const isExist = user.some(e => e.ten === user.ten)
        // if (isExist) {
        //     return socket.emit('REGISTER_FAIL');
        // }
        socket.peerId  = user.peerId;
        arrUser.push(user);
        socket.emit('USER_ONLINE', arrUser);
        socket.broadcast.emit('NEW_USER_ONLINE', arrUser);// gửi cho mọi người trừ người gửi ra
    });
    socket.on('disconnect', () => {
        const index = arrUser.findIndex(user => user.peerId === socket.peerId);
        arrUser.splice(index,1);
        io.sockets.emit('NEW_USER_ONLINE', arrUser);
    });
});


