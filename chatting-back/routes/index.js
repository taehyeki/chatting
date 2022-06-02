const express = require("express");
const router = express.Router();
const { postApi } = require("../modules/api.js");
const Pool = require("../modules/pool");
const { uploadImg, uploadVideo } = require("../modules/multer");

router.post("/get_chat_rooms", (req, res, next) => {
  let data = [req.body.params];
  postApi("sp_admin_get_chat_rooms", data, res);
});

router.post("/upload_img_to_s3", uploadImg.array("file"), (req, res, next) => {
  let urlArr = [];
  req.files.forEach(async (v) => {
    urlArr.push(v.location);
  });
  res.send(urlArr);
});

router.post(
  "/upload_video_to_s3",
  uploadVideo.single("file"),
  (req, res, next) => {
    const url = req.file.location;
    res.send(url);
  }
);

router.post("/insert_chat", async (req, res, next) => {
  // db에 유저아이디, 방아이디, 메시지를 전
  try {
    const roomId = JSON.parse(req.body.params)[0].ROOM_ID;
    const rawData = JSON.parse(req.body.params)[0];
    const size = req.app.get("io").sockets.adapter.rooms.get(roomId).size;
    let flg = 0;
    if (size < 2) {
      flg = 1;
      rawData["IS_READ"] = 0;
    } else {
      rawData["IS_READ"] = 1;
    }
    const addData = JSON.stringify([rawData]);
    const address = "sp_admin_insert_chat";
    const pool = new Pool();
    var sql = `CALL ${address}(?)`;
    if (addData == null) sql = `CALL ${address}()`;
    pool.execute((conn) => {
      conn.queryAsync(sql, addData, (error, rows) => {
        if (error) {
          return console.error(error.message);
        } else {
          const payload = {
            state: rows[0][0]["rtn_val"],
            message: rows[0][0]["msg_txt"],
            addData: JSON.parse(rows[0][0]["json_data"]),
          };
          req.app.get("io").to(roomId).emit("chat", payload.addData[0]);
          if (flg) {
            req.app.get("io").to(`${roomId}-1`).emit("reloadChatRooms");
          }

          res.send("ok");
        }
      });
      pool.end();
    });
    // 해당 방에 있는 소켓들에게 방금 받은 chat을 보냄
  } catch (e) {
    console.log(e);
  }
});
// 방에 처음 들어왔을 때 프론트에서 받아온 USER_ID와 ROOM_ID를
// DB에 보낸 뒤 해당 방의 기존 채팅등을 불러온다.
router.post("/get_chats", async (req, res, next) => {
  try {
    const data = [req.body.params];
    await postApi("sp_admin_retrieve_chats", data, res);
  } catch (e) {
    console.log(e);
  }
});

router.post("/delete_chats", async (req, res, next) => {
  try {
    const data = [req.body.params];
    await postApi("sp_admin_delete_chat", data, res);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
