module.exports = (server, app) => {
  // 아래의 옵션을 주지 않으면 오류 발생,
  // 서버에서 소켓을 연결하는 작업
  var io = require("socket.io")(server, {
    cors: {
      credentials: true,
    },
    allowEIO3: true,
  });
  // app 안에 서버의 소켓을 저장
  app.set("io", io);

  // 서버의 소켓이 연결되었다면 아래의 이벤트 리스터 작동
  io.on("connection", function (socket) {
    console.log("Connect from Client: ", socket.id);
    let = roomId = "";

    socket.on("didYouDelete", function (data) {
      socket.to(data.roomId).emit("yesDelete");
      socket.to(`${data.roomId}-1`).emit("yesDeleteForRoomList");
    });

    socket.on("areYouInApp", function (data) {
      // 데이터에는 채팅방 목록에 있는 유저아이디-2 들이 들어있을 테다 (null인 경우는 제외)
      // 그 값을 받아와서 소켓 방이 존재하는지 확인하는 작업,
      // 확인이 된 아이디를 리턴한다.
      let usersInApp = [];
      for (i = 0; i < data.length; i++) {
        if (io.sockets.adapter.rooms.get(data[i])) {
          usersInApp.push(data[i]);
        }
      }
      socket.emit("imOnApp", usersInApp);
    });
    // 방에 들어온 경우
    socket.on("joinRoom", function (data) {
      roomId = data;
      console.log(socket.id + "님이", data + "번 방에 입장");
      // 방에 한명이라도 이미 존재한다면 그 방안에 있는 사람한테 reload를 보낸다
      if (io.sockets.adapter.rooms.get(roomId) != undefined) {
        io.to(data).emit("reload");
      }

      socket.join(data);
    });
    // 방에서 나간 경우
    socket.on("leaveRoom", function (data) {
      console.log(socket.id + "님이", data + "번 방에서 퇴장");
      socket.leave(data);
      roomId = data;
    });
    socket.on("disconnect", () => {
      console.log(socket.id + "님이 연결 끊김");
    });
  });
};
