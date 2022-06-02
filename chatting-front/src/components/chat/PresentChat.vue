<template lang="">
  <div>
    <div
      v-for="chat,idx in getNewChats"
      :key="chat+idx"
    >
      <div
        v-if="getUserId==chat.USER_ID"
        class="my-msg-created-and-isread"
      >
        <!-- 삭제 보류 -->
        <!-- <input
          v-if="chat.DELETED == 0"
          type="checkbox"
          class="checkBoxes dpnone"
          @change="selectedToDelete(chat.CHAT_ID)"
        > -->
        <div
          v-if="chat.IS_READ != '' "
          class="my-msg-isread"
        />
        <div
          v-if="chat.CREATED_AT != '' "
          class="my-msg-created"
        >
          {{ chat.CREATED_AT }}
        </div>
        <div
          v-if="chat.MEDIA==0"
          class="my-msg"
        >
          <span>
            {{ chat.MESSAGE }}
          </span>
        </div>
        <div v-else-if="chat.MEDIA==1">
          <ChatImages :images="chat.MESSAGE" />
        </div>
        <div v-else-if="chat.MEDIA==2">
          <video

            style="width:300px"
            :src="chat.MESSAGE"
            alt=""
            controls
          />
        </div>
      </div>
      <div
        v-else-if="chat.USER_ID == 'system'"
        class="system-msg-box"
      >
        <div class="system-msg-divider" />
        <div class="system-msg">
          {{ chat.MESSAGE }}
        </div>
        <div class="system-msg-divider" />
      </div>
      <div
        v-else
      >
        <div
          v-if="chat.FIRST"
          class="opponent-first-msg-box"
        >
          <img
            :src="getOpponentAvatar"
            class="opponent-first-img"
          >
          <div class="opponent-first-info-box">
            <p class="opponent-site-name">
              {{ getOpponentSiteName }}
            </p>
            <div class="opponent-msg-and-created">
              <div
                v-if="chat.MEDIA==0"
                class="opponent-msg"
              >
                <span>
                  {{ chat.MESSAGE }}
                </span>
              </div>
              <div v-else-if="chat.MEDIA==1">
                <ChatImages :images="chat.MESSAGE" />
              </div>
              <div v-else-if="chat.MEDIA==2">
                <video

                  style="width:300px"
                  :src="chat.MESSAGE"
                  alt=""
                  controls
                />
              </div>
              <div class="opponent-msg-created">
                {{ chat.CREATED_AT }}
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="opponent-msg-and-created not-first">
            <div
              v-if="chat.MEDIA==0"
              class="opponent-msg"
            >
              <span>
                {{ chat.MESSAGE }}
              </span>
            </div>
            <div v-else-if="chat.MEDIA==1">
              <ChatImages :images="chat.MESSAGE" />
            </div>
            <div v-else-if="chat.MEDIA==2">
              <video

                style="width:300px"
                :src="chat.MESSAGE"
                alt=""
                controls
              />
            </div>

            <div class="opponent-msg-created">
              {{ chat.CREATED_AT }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ChatImages from "@/components/chat/ChatImages.vue"
import {mapGetters,mapMutations} from "vuex"
export default {
  components : {
    ChatImages
  },
  computed : {
  ...mapGetters('Chat',['getChats','getUserId','getNewChats','getDelChatList','getOpponentAvatar','getOpponentSiteName','getSocket']),
  },
  async updated(){
    const chatBox = document.querySelector('.chat-container')
    chatBox.scrollIntoView(false);
  },
  methods : {
    ...mapMutations('Chat',['addDelChatList','addNewChats']),
    selectedToDelete(chatId){
      const index = this.getDelChatList.indexOf(chatId)
      if (index != -1){
        this.getDelChatList.splice(index,1)
      } else {
        this.addDelChatList(chatId)
      }
    },

  },
}
</script>
<style lang="scss" scoped>

.dpnone {
  display: none;
}

.system-msg-box {
  display : flex;
  align-items: center;

  .system-msg-divider {

    width: 100%;
    border-top: 1px solid #C4C4C4;
  }
  .system-msg{
    min-width: 140px;

    text-align: center;
    font-size : 12px;
    color : #737373;
  }
}




.opponent-first-msg-box{
  margin-top : 16px;
  display: flex;
  .opponent-first-img {
    width : 40px;
    height: 40px;
    border-radius: 8px;
    margin-right : 8px;
  }
  .opponent-first-info-box{

    .opponent-site-name {
      font-size : 12px;
      color: #737373;
      margin : 0px 0px 4px 0px;
    }
  }
}
.opponent-msg-and-created{
  display : flex;
  align-items : flex-end;

  .opponent-msg{

    word-break: break-all;
    word-wrap: normal;
    max-width: 200px;
    padding : 10px 20px;
    font-size : 14px;
    background-color: #D1EBE580;
    border-radius: 8px;
  }
  .opponent-msg-created {
    margin-left : 10px;
    color : #C4C4C4;
    font-size : 12px;
  }
}

.not-first {
  margin-left : 48px;
  margin-top : 16px;
}

.my-msg-created-and-isread {
  justify-content: flex-end;
  margin-top : 16px;
  align-items : flex-end;
  display : flex;
  .my-msg-isread{
    width: 8px;
    height: 8px;
    background-color: #FF6C03;
    border-radius: 100%;
    margin-right : 8px;
    margin-bottom : 4px;
  }
  .my-msg-created {
    margin-right : 8px;
    color : #C4C4C4;
    font-size : 12px;
  }
  .my-msg{
    word-break: break-all;
    word-wrap: normal;
    max-width: 230px;
    padding : 10px 20px;
    font-size : 14px;
    color : white;
    background-color: #00B286;
    border-radius: 8px;
  }
}

</style>
