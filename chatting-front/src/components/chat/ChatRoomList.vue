<template>
  <div>
    <div v-if="getErrorState">
      <h3 style="text-align : center; margin-bottom : 30px;">
        서버와의 연결이 불안정합니다.
      </h3>
      <img
        src="https://chium.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20220506_110153004.png"
        alt="img"
        style="width:100%; "
      >
    </div>
    <div
      v-for="room in getChatRooms"
      v-else
      :key="room.ROOM_ID"
      style=""
      class="msg-box"
      @click="toRoom(room)"
    >
      <div class="img-info-box">
        <div class="img-box">
          <div
            v-if="room.IM_ON"
            class="im-on"
          />
          <img
            :src="room.AVATAR_PATH"
            alt="img"
          >
        </div>
        <div class="info-box">
          <p class="site-name">
            {{ room.SITE_NAME }}
          </p>

          <p class="last-msg">
            {{ shortenMsg(room.MESSAGE) }}
          </p>
        </div>
      </div>
      <div class="time-box">
        <div class="last-msg-time">
          {{ room.CREATED_AT }}
        </div>
        <div
          v-if="room.UNREAD != 0"
          class="is-unread"
        >
          {{ room.UNREAD }}
        </div>
        <div
          v-else
          class="no-unread"
        />
      </div>
    </div>
  </div>
</template>
<script>
import {mapActions,mapGetters,mapMutations} from "vuex"
export default {

  computed : {
    ...mapGetters('Chat',['getChatRooms','getSocket','getUserId','getAreYouInAppList','getErrorState'])
  },
  watch : {
    // 소켓이 변경될 때 즉, 서버와의 연결이 끊기면 소켓이 재 연결 하려고 한다
    // 이 때 서버와 다시 연결이 되면 socket이 변경되는데 이를 감지하기 위해서 getSocket이라는 것을 사용하였다.
    // getSocket은 숫자이며 소켓이 서버와 연결되면 +1이 되는 구조이다. 단순히 소켓을 watch하면 변화를 인식 하지 못하기 때문에
    // 이런 구조로 만들었다.
    getSocket(){
      this.getChatRooms.map(v => {
      this.$enterRoom(`${v.ROOM_ID}-1`)
      })
      this.$reloadChatRooms(()=>{
        this.chatRooms()
      })
      this.$deleteChatReloadRoomList(()=>{
        this.chatRooms()
      })
      this.$imOnApp((payload)=>{

        this.setAreYouOn(payload)
      })
      this.changeErrorState(false)
    },
  },
  async created(){

    // 상대가 있는지 확인할 수 있는 용도
    this.$imOnApp((payload)=>{
      this.setAreYouOn(payload)
    })
    // 채팅방 요청 await을 안하면 getChatRooms가 빈값이 들어옴
    await this.chatRooms()
    // 채팅방 목록에 들어오면 현재 상대가 있는지 채팅서버로 요청을 보내는 용도
    await this.$socket.emit('areYouInApp',this.getAreYouInAppList)

    // 각 채팅방아이디-1로 소켓 방에 입장시킴
    this.getChatRooms.map(v => {
      this.$enterRoom(`${v.ROOM_ID}-1`)
    })
    // 각 채팅방 목록을 실시간으로 업데이트 해주기 위한 용도
    this.$reloadChatRooms(()=>{
        this.chatRooms()
    })
    // 메시지가 삭제 되었을 때 리프레쉬 되도록 하는 용도
    // 나중에 마지막 메시지가 삭제되었을 때 바뀌도록 수정하는게 좋을 듯?
    this.$deleteChatReloadRoomList(()=>{
        this.chatRooms()
    })

  },
  destroyed(){
      // 지금 현재는 단순히 화면이 바뀔 때 방을 나가도록 하였지만
      // 방을 삭제하는 기능을 넣을 경우 그 때 가서 이 부분을 한번 더 생각해보아야 할듯
      this.getChatRooms.map(v => {
        this.$leaveRoom(`${v.ROOM_ID}-1`)
      })
      this.$socket.off('yesDeleteForRoomList')
      this.$socket.off('reloadChatRooms')
      this.$socket.off('imOnApp')
  },
  methods : {
    ...mapActions('Chat',['chatRooms']),
    ...mapMutations('Chat',['setAreYouOn','setOpponentAvatar','setOpponentSiteName','changeErrorState']),
    toRoom(room){
      this.$router.push(`./${room.ROOM_ID}`)

    },
    shortenMsg(msg){
      if (msg == null){
        return ''
      }
      if (msg.length > 12){
        return msg.slice(0,12)+'...'
      }
      return msg
    }
  },

}
</script>
<style lang="scss" scoped >
.msg-box {
  display : flex;
  margin-left: 24px;
  margin-right: 24px;
  margin-top : 32px;
  height: 54px;
  justify-content: space-between;
  .img-info-box {
    display: flex;
    .img-box {

      img {
      width : 54px;
      height : 54px;
      border-radius: 16px;
      }
      .im-on{
        position: absolute;
        width: 8px;
        height: 8px;
        top: 0;
        right: 0;
        background-color: #00B286 ;
        border: 1.5px solid #F8F8FA;
        border-radius: 100%;
      }
      position: relative;
      margin-right : 12px;
    }
    .info-box {
      display: flex;
      flex-direction: column;
      justify-content: space-around ;
      width : 50vw;
      .site-name{
        font-size : 16px;
        font-weight: 700;
      }
      .last-msg{
        font-size :14px;
        color : #737373;
      }
    }
  }

  .time-box {
    width : 16vw;
    display: flex;
    flex-direction: column;
    justify-content: space-around ;
    .last-msg-time {
      text-align: end;
      font-size : 12px;
      color : #737373;

    }
    .is-unread {
      width: 24px;
      height: 24px;
      background-color: #FF0000;
      color : white;
      margin-left: auto;
      line-height: 24px;
      border-radius: 8px;
      text-align: center;
      font-size: 12px;

    }
    .no-unread {
      width: 24px;
      height: 24px;
    }
  }
  p {
    margin : 0px;
  }
}
</style>


