<template>
  <div class="chat-container">
    <!--삭제기능 보류-->
    <!-- <button id="forDelBtn">
      편집
    </button>
    <button
      id="deleteBtn"
      class="dpnone"
    >
      메시지 삭제
    </button>
    <button
      id="cancelBtn"
      class="dpnone"
    >
      취소
    </button> -->
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
    <div v-else>
      <div
        class="chat-wrapper"
      >
        <PreviousChat />
        <PresentChat />
      </div>
      <div>
        <ChatInput />
      </div>
    </div>
  </div>
</template>
<script>
import PreviousChat from '@/components/chat/PreviousChat.vue';
import PresentChat from '@/components/chat/PresentChat.vue';
import ChatInput from '@/components/chat/ChatInput.vue';

import {mapMutations,mapGetters,mapActions} from "vuex"

export default {
  components : {
    PreviousChat,PresentChat,ChatInput
  },
  computed : {
  ...mapGetters('Chat',['getUserId','getChats','getSocket','getRoomId','getNewChats','getDelChatList','getErrorState']),
  },
  watch : {
    // 소켓이 변경될 때 즉, 서버와의 연결이 끊기면 소켓이 재 연결 하려고 한다
    // 이 때 서버와 다시 연결이 되면 socket이 변경되는데 이를 감지하기 위해서 getSocket이라는 것을 사용하였다.
    // getSocket은 숫자이며 소켓이 서버와 연결되면 +1이 되는 구조이다. 단순히 소켓을 watch하면 변화를 인식 하지 못하기 때문에
    // 이런 구조로 만들었다.
    getSocket(){
      // 먼저 소켓에 채팅이벤트를 주었던 것을 off로 해주자
      this.$socket.off('chat');
      this.$socket.off('disconnect');
      this.$socket.off('reload');
      this.$socket.off('yesDelete');

      // 재연결되면 방에 다시 입장해주고,
      this.$enterRoom(this.getRoomId)
      // 재연결 되었을 때 다시 글을 적으면 화면에 보일 수 있도록 다시 이벤트를 넣어주는 것이다.
      // 이렇게 하지 않으면 새로운 소켓에는 이벤트가 달려있지 않기때문에 화면에 글이 올라오지 않는 현상이 생긴다.
      this.$chatSet(this.showNewChat)
      this.$disconnetFromServer(this.addErrorMsg)
      this.$reload(this.changeIsReadState)
      this.addErrorMsg('재연결 되었습니다.')
      this.changeErrorState(false)
      // 이건 방에있는 모두에게 보여질 메시지(시스템)이다.
      // 아마 아직 안보임

      // 삭제기능 보류
      // this.$deleteChat(this.changeIsReadState)
    },
  },
  async created(){


    // 먼저 방이 생성이되면 url을 따서 방 번호를 가져온다.
    const url = window.location.href
    const splitedUrl = url.split('/')
    const roomId = splitedUrl[splitedUrl.length - 1]
    this.setRoomId(roomId)
    try {
      // store에 chat의 내용을 저장한다.
      await this.chats({roomId : this.getRoomId})
    } catch(e){
      console.log(e)
    }
    // fn2를 따로 만들어준 이유는 브라우저의 소켓이 서버와 disconnect된 경우에
    // 들어오는 메시지는 tranport close? 라는 것이 들어온다. 이건 defualt로
    // 연결이 끊어졌을 때 들어오는 메시지 같다. 따라서 이를 바꿔줄 필요가 있기에
    // 다른 함수를 만들어주었다.
    // 방에 들어가는 작업
    this.$enterRoom(this.getRoomId)
    // 채팅을 받으면 fn함수를 실행시키는 작업
    this.$chatSet(this.showNewChat)
    // 브라우저가 서버와 연결이 끊길 때 addErrorMsg함수 실행시키는 작업
    this.$disconnetFromServer(this.addErrorMsg)
    // 상대방이 채팅방에 들어왔을 때 실행되는 작업들
    this.$reload(this.changeIsReadState)
    // 상대방이 채팅 삭제 했을 때 실행되는 작업들
    // 삭제기능 보류
    // this.$deleteChat(this.changeIsReadState)
  },

  // 업데이트 될 때 마다 스크롤을 아래로 내림

  //삭제기능 보류
  // mounted(){
  //   const delBtn = document.querySelector('#deleteBtn')
  //   const cancelBtn = document.querySelector('#cancelBtn')
  //   const forDelbtn = document.querySelector('#forDelBtn')
  //   // 편집 버튼을 눌렀을 당시에 존재하는 채팅만 클릭할 수 있도록
  //   // checkBoxes를 미리 선언해두었다.
  //   let checkBoxes
  //   const btnsHandler = (a,b,c) => {
  //     a.classList.toggle('dpnone')
  //       b.classList.toggle('dpnone')
  //       c.classList.toggle('dpnone')
  //   }
  //   const checkBoxHandler = (a) => {
  //     a.forEach(v=>{
  //       v.classList.toggle('dpnone')
  //       v.checked =false
  //       })
  //     this.resetDelChatList()
  //   }
  //   // 편집 버튼
  //   forDelbtn.addEventListener('click',()=>{
  //     checkBoxes = document.querySelectorAll('.checkBoxes')
  //     btnsHandler(delBtn,cancelBtn,forDelbtn)
  //     checkBoxHandler(checkBoxes)
  //   })
  //   // 취소 버튼
  //   cancelBtn.addEventListener('click',()=>{
  //     btnsHandler(delBtn,cancelBtn,forDelbtn)
  //     checkBoxHandler(checkBoxes)
  //   })
  //   delBtn.addEventListener('click',async ()=>{
  //    if(confirm('삭제하시겠습니까?')==true){
  //       await this.beforeDeleteChat()
  //       btnsHandler(delBtn,cancelBtn,forDelbtn)
  //       checkBoxHandler(checkBoxes)
  //    }
  //   })
  // },
  destroyed(){
    // 아래와 같이 해주는 이유는 crated훅에서 만들어지는 이벤트 리스너들이
    // 중복으로 적용이 되는 현상이 발생 예를 들어 ( 통계 -> 채팅 -> 통계 -> 채팅 )
    // 으로 이동했다면 화면에서 채팅이 2번 적히는 현상
    // 채팅방에서 빠져나가면 ( 다른 화면으로 이동 ) 방을 빠져나가는 작업
    this.$leaveRoom(this.getRoomId)
    // 채팅 이벤트를 없애는 작업
    this.$socket.off('chat');
    // 디스코넥 이벤트를 없애는 작업
    this.$socket.off('disconnect');
    this.$socket.off('reload');
    this.$socket.off('yesDelete');
    this.setNewChatsReset()
    this.setChatsReset()
  },
  methods : {
    ...mapMutations('Chat',['setChats','setChatsReset','setRoomId','addNewChats','setNewChatsReset','resetDelChatList','changeErrorState']),
    ...mapActions('Chat',['beforeSetChats','deleteChat','chats','uploadImgToS3','uploadVideoToS3']),
    // 채팅을 보내는 작업 백에 유저아이디, 방아이디, 메시지를 전송

    // 시간 처리해주는 메서드
  showCreated(time){
  // return time.slice(11,16)
  let hour = Number(time.slice(11,13))
  let minuate = time.slice(14,16)

  if( hour == 0) {
    hour = '오전 12'
  } else if (hour == 12) {
    hour = '오후 12'
  } else if (hour > 12) {
    hour = `오후 ${hour-12}`
  } else {
    hour = `오전 ${hour}`
  }
  return `${hour}:${minuate}`
  },
    // 읽음 표시 처리해주는 메서드
    isRead(tf){
      if(!tf){
        return '안읽음'
      }
      return ''
    },
    // fn 함수는 채팅을 적으면 화면에 뿌려주는 역할을 한다.
    // data에는 백엔드에서 보낸 채팅 내용이 들어있다. ( req.app.get("io").to(roomId).emit("chat", chat) )
    showNewChat(data){
      console.log(data,'데이터요')
      if (
        // 내가 적은 글
        // 글의 작성자가 나여야 하고,
        data.USER_ID == this.getUserId &&
        // 채팅 ( 디비에서 가져온 채팅이 아닌 채팅창에서 적은) 이 존재해야하며
        this.getNewChats[this.getNewChats.length - 1] &&
        // 전 채팅 작성시각이 같아야하고
        this.getNewChats[this.getNewChats.length - 1].CREATED_AT == this.showCreated(data.CREATED_AT) &&
        // 전 채팅 작성자가 나와 같아야 한다.
        this.getNewChats[this.getNewChats.length - 1].USER_ID == this.getUserId
      ){
        // 전 글의 시각을 숨김

        this.getNewChats[this.getNewChats.length - 1].CREATED_AT = ''
      }
      // 상대가 적은 글
      else if (
        data.USER_ID != this.getUserId &&
        this.getNewChats[this.getNewChats.length - 1] &&
        this.getNewChats[this.getNewChats.length - 1].CREATED_AT == this.showCreated(data.CREATED_AT) &&
        this.getNewChats[this.getNewChats.length - 1].USER_ID != this.getUserId
        ){
        this.getNewChats[this.getNewChats.length - 1].CREATED_AT = ''
        }
      let newChat = {
        IS_READ : this.isRead(data.IS_READ),
        MESSAGE : data.MESSAGE,
        CREATED_AT  : this.showCreated(data.CREATED_AT),
        USER_ID :  data.USER_ID,
        CHAT_ID : data.CHAT_ID,
        DELETED : data.DELETED,
        MEDIA : data.MEDIA,
        FIRST : false
        }
      if (
        // 첫번째 채팅
        this.getNewChats.length == 0 ||
        (this.getNewChats[this.getNewChats.length - 1] &&
        this.getNewChats[this.getNewChats.length - 1].CREATED_AT != '')
      ) {
        newChat.FIRST = true
      }
       // 채팅 추가
      this.addNewChats(newChat)
    },


    // 이건 상대방이 들어왔을 때 안읽음 표시 처리해주는 기능
    async changeIsReadState(){
      console.log('changeIsReadState')
      try {
        // store에 chat의 내용을 저장한다.
        await this.chats({roomId:this.getRoomId})
      } catch(e){
        console.log(e)
      }
    },
    addErrorMsg(data){
      if (data == 'transport close'){
        this.addNewChats({USER_ID : 'system', MESSAGE : '서버와의 연결이 끊겼습니다.'})
      }
      else {
        this.addNewChats({USER_ID : 'system', MESSAGE : data})
      }
    },

    // 삭제기능 보류
    // async beforeDeleteChat(){
    //   const delList = this.getDelChatList.join(',')
    //   // 여기랑 chat.js의  deleteChat 둘다 async await 안해주면
    //   // 삭제반영이 된 데이터를 불러오지 못하는 것 같다..
    //   await this.deleteChat(delList)
    //   this.resetDelChatList()
    //   await this.chats({roomId:this.getRoomId})
    //   //  this.newChats = []를 this.chats앞에 적어주면 화면이 부자연스럽고,
    //   // 뒤에 적어주면서 await을 붙여주면 자연스럽게 바뀐다. 이유가뭘까..? (await안붙여주면 부자연스러움)
    //   this.setNewChatsReset()
    //   this.$socket.emit('didYouDelete',{roomId : this.getRoomId})
    // }

  }
}
</script>
<style  scoped>
  .chat-wrapper{
    margin-left : 16px;
    margin-right : 16px;
    margin-bottom : 50px;
  }
  .dpnone {
    display: none;
  }
</style>





<!-- <template>
  <v-app>
    <AppBarPreviousRoute />
    <v-main>
      <v-row
        no-gutters
        style="height: 100% background-color: #e1f5fe !important"
      >
        <v-col
          style="height: 90%; background-color: #e1f5fe !important"
          cols="12"
        >
          <v-card
            elevation="0"
            style="height: 100%"
            class="overflow-auto pa-5 pb-15"
            color="light-blue lighten-5"
          >
            <ChattingMessageForm
              v-for="(msg, index) in msgs"
              :key="index"
              :user-type="msg.userType"
            />
          </v-card>
        </v-col>
        <v-col style="height: 56px">
          <v-bottom-navigation
            style="background-color: white"
            class="px-5 pt-2"
            fixed
          >
            <SendMessageTextField />
          </v-bottom-navigation>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
import AppBarPreviousRoute from '@/components/appbar/AppBarPreviousRoute.vue'
import SendMessageTextField from '@/components/textfield/SendMessageTextField.vue';
import ChattingMessageForm from '@/components/form/ChattingMessageForm.vue';


export default {
  name: "ChattingDetail",
  components: {
    AppBarPreviousRoute,
    SendMessageTextField,
    ChattingMessageForm
  },
  data: () => ({
    msgs: [
      {userType: "명식soft"},
      {userType: "me"},
      {userType: "me"},
      {userType: "sikSoft"},
      {userType: "sikSoft"},
      {userType: "me"},
      {userType: "me"},
      {userType: "sikSoft"},
      {userType: "me"},
    ],
  }),
  mounted() {
    // 채팅방에 들어올 시 스크롤 아래로 이동
    this.underScroll()
  },
  methods: {
    // 화면 스크롤을 아래로 내리는 함수
    underScroll() {
      window.scrollTo(0,document.body.scrollHeight);
    }
  }
}
</script>

<style>

</style>
-->
