const io = require('socket.io')(3000);

const getClientRoom = () => {
  let index = 0;
  while (true) {
    if (
      !io.sockets.adapter.rooms[index] ||
      io.sockets.adapter.rooms[index].length < 2
    ) {
      return index;
    }
    index++;
  }
};

io.on('connect', (socket) => {
  const clientRoom = getClientRoom(); // Lấy room thỏa mãn điều kiện

  socket.join(clientRoom);

  if (io.sockets.adapter.rooms[clientRoom].length < 2) {
    io.in(clientRoom).emit('statusRoom', 'Đang chờ người lạ ...');
  } else {
    io.in(clientRoom).emit('statusRoom', 'Người lạ đã vào phòng');

    socket.on('disconnect', (reason) => {
      socket
        .to(clientRoom)
        .emit('statusRoom', 'Người lạ đã thoát. Đang chờ người tiếp theo ....');
    });

    socket.on('sendMessage', function (message) {
      socket.to(clientRoom).emit('receiveMessage', message);
    });
  }
});
