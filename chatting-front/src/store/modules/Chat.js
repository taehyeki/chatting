
import cloneDeep from "lodash/cloneDeep";
import { axiosCommonWithAuth } from '@/api/Index.js'
import axios from "axios";

const INITIAL_STATE = {
  chatRooms : [],
  sockets : 0,
  chats : [],
  areYouInAppList : [],
  nowInAppList : [],
  newChats : [],
  delChatList : [],
  roomId : null,
  opponentInfo : {
    opponentAvatar : null,
    siteName : null
  },
  errorState : false
};
const showCreated = (time) =>{
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
}
const isRead = (tf) => {
  //tf == true false
  if(!tf){
    return '안읽음'
  }
  return ''
}
const ChatRoomsTime = (time) => {
  if(time == null){
    return
  }
  const today = new Date().toISOString().slice(0,10);
  const todayFromCreatedAt = time.slice(0,10);
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

  let month = time.slice(5,7);
  if (month[0]=='0'){
    month = month[1]
  }
  const day = time.slice(8,10);
  if (today != todayFromCreatedAt){
    return `${month}월 ${day}일`
  }
  return `${hour}:${minuate}`

}
export default {
  namespaced: true,
  state: cloneDeep(INITIAL_STATE),
  mutations: {
    setOpponentAvatar(state,payload){
      state.opponentInfo.opponentAvatar = payload
    },
    setOpponentSiteName(state,payload){
      state.opponentInfo.siteName = payload
    },
    setRoomId(state,payload){
      state.roomId = payload
    },
    addNewChats(state,payload) {
      state.newChats.push(payload)
    },
    setChatRooms(state,payload){
      state.chatRooms = payload
    },
    setChats(state,{payload, getters, commit}){
      commit('setNewChatsReset')
      commit('setChatsReset')

      if (payload == null) {
        return
      }

      commit('setOpponentAvatar',payload[0].AVATAR_PATH)
      commit('setOpponentSiteName',payload[0].SITE_NAME)
      for (var i=0; i<payload.length; i++){

        const sysDayMsg = {
          USER_ID : 'system',
          CHAT_ID: null,
          DELETED: 0,
          IS_READ: '',
          MESSAGE: payload[i].VAR_DATE,
          ROOM_ID: null,
        }
        state.chats.push(sysDayMsg)
        for (var j=0; j<payload[i].DAILY_CHATS.length; j++){
          payload[i].DAILY_CHATS[j].FIRST = false
          if (

            j > 0 &&
            // 내가 적은 글
            // 글의 작성자가 나여야 하고,
            payload[i].DAILY_CHATS[j].USER_ID == getters.getUserId &&
            // 채팅 ( 디비에서 가져온 채팅이 아닌 채팅창에서 적은) 이 존재해야하며
            payload[i].DAILY_CHATS[j - 1] &&
            // 전 채팅 작성시각이 같아야하고
            payload[i].DAILY_CHATS[j - 1].CREATED_AT == showCreated(payload[i].DAILY_CHATS[j].CREATED_AT) &&
            // 전 채팅 작성자가 나와 같아야 한다.
            payload[i].DAILY_CHATS[j - 1].USER_ID == getters.getUserId
          ){
            // 전 글의 시각을 숨김
            payload[i].DAILY_CHATS[j - 1].CREATED_AT = ''

          }
        // 상대가 적은 글
          else if (
            j > 0 &&
            payload[i].DAILY_CHATS[j].USER_ID != getters.getUserId &&
            payload[i].DAILY_CHATS[j - 1] &&
            payload[i].DAILY_CHATS[j - 1].CREATED_AT == showCreated(payload[i].DAILY_CHATS[j].CREATED_AT) &&
            payload[i].DAILY_CHATS[j - 1].USER_ID != getters.getUserId

            ){
              payload[i].DAILY_CHATS[j - 1].CREATED_AT = ''
            }

          if (
            // 첫번째 글이거나,
            payload[i].DAILY_CHATS[j].USER_ID != getters.getUserId && (
            j == 0 ||
            // 전 글의 작성시간이 빈 값이 아니라면
            payload[i].DAILY_CHATS[j - 1].CREATED_AT != '')
          ) {
            // 프로필사진, 이름 보여주기 위함
            payload[i].DAILY_CHATS[j].FIRST = true
          }

          payload[i].DAILY_CHATS[j].CREATED_AT = showCreated(payload[i].DAILY_CHATS[j].CREATED_AT)
          payload[i].DAILY_CHATS[j].IS_READ = isRead(payload[i].DAILY_CHATS[j].IS_READ)
          state.chats.push(payload[i].DAILY_CHATS[j])

        }


      }


    },
    setChatsReset(state){
      state.chats = []
    },
    setNewChatsReset(state){
      state.newChats = []
    },
    // 채팅방 목록에 있는 유저 아이디들(-2표시)저장
    setAreYouInAppList(state,payload){
      state.areYouInAppList = payload
    },
    // 서버에서 받아온 값(해당 유저가 현재 앱에 들어있다면 해당 유저의 아이디-2 를 보낸다.)과,
    // 채팅방목록에 있는 값과 비교,
    // 만약 있다면 현재 접속해 있는 상태일 것이므로, IM_ON을 true로 바꿔준다.
    setAreYouOn(state,payload){
      state.nowInAppList = payload
      payload.map(i=>{
        for(var j=0; j<state.chatRooms.length; j++){
          if( i == `${state.chatRooms[j].USER_ID}-2`){
            state.chatRooms[j].IM_ON = true
          }
        }
      })
    },
    addDelChatList(state,payload){
      state.delChatList.push(payload)
    },
    resetDelChatList(state){
      state.delChatList = []
    },
    changeErrorState(state,payload){
      state.errorState = payload
    }

  },
  actions: {
    async chats({getters,dispatch,commit},payload){
      try {
        // const method = 'post'
        // const url = `${process.env.VUE_APP_CHAT_API}/get_chats`;
        let data = {
          params: JSON.stringify([
            {
              USER_ID : getters.getUserId,
              ROOM_ID : payload.roomId,
              // 아직 의미 없는 스크롤, 구현 못함
              PAGE_SIZE : 1000,
              OFFSET_SIZE : 0,
            },
          ]),
        };
        // 그리고 유저아이디와 방 번호를 post로 보내서 서버에보낸다.
        // 해당 방의 기존의 채팅을 받아오는 과정이다.
        const res = await axios.post(`${process.env.VUE_APP_CHAT_API}/get_chats`,data)
        dispatch('beforeSetChats',res.data.data)
      }catch(e){
        console.log(e)
        commit('changeErrorState',true)
      }
    },
    async chatRooms({commit,getters,state }) {
      try{
        const method = 'post'
        const url = `${process.env.VUE_APP_CHAT_API}/get_chat_rooms`;
        let data = {
          params: JSON.stringify([
            {
              USER_ID: getters.getUserId,
            },
          ]),
        };
        const res =  await axiosCommonWithAuth(url, method, data);
        let chatRooms = res.data.data
        console.log(chatRooms,'챗룸')
        // 받아온 채팅방 목록에서, USER_ID가 null이 아니라면 ( 채팅을 한번이라도 했다면 )
        // 그 유저 아이디 뒤에 - 2를 붙인 뒤 배열을 리턴한다.
        const userIds = chatRooms.map((v)=>{
          if (v.OPPONENT_USER_ID != null){
            return `${v.OPPONENT_USER_ID}-2`
          }
        })
        // 그 배열을 세팅해준다.
        await commit('setAreYouInAppList',userIds)
        // 챗룸을 필요한 내용을 추가하여
        chatRooms = chatRooms.map( (v)=>{
          // defaultImOn는 채팅방에서 접속해있으면 true로 바꾸어 표시
          let defaultImOn = false
          if (state.nowInAppList.indexOf(`${v.OPPONENT_USER_ID}-2`) != -1){
            defaultImOn = true
          }
          return {
              // IM_ON과 USER_ID는 현재 접속해있는지 여부를 확인하기 위함
              IM_ON : defaultImOn,
              USER_ID : v.OPPONENT_USER_ID,
              ROOM_ID : v.ROOM_ID,
              MESSAGE : v.MESSAGE,
              UNREAD : v.UNREAD,
              AVATAR_PATH : v.OPPONENT_AVATAR_PATH,
              SITE_NAME: v.SITE_NAME,
              CREATED_AT : ChatRoomsTime( v.CREATED_AT),
            }
          }
        )
        // 저장한다.
        commit('setChatRooms',chatRooms)
      }catch(e){
        console.log(e)
        commit('changeErrorState',true)
      }

    },
    beforeSetChats({commit,getters},payload){
      commit('setChats',{payload,getters,commit})
    },
    async deleteChat({getters},payload){
      try{
        const method = 'post'
        const url = `${process.env.VUE_APP_CHAT_API}/delete_chats`;
        let data = {
          params: JSON.stringify([
            {
              USER_ID: getters.getUserId,
              CHAT_ID_LIST : payload
            },
          ]),
        };
        await axiosCommonWithAuth(url, method, data);
      }
      catch(e){
        console.log(e)
      }
    },
    async uploadImgToS3({getters},{formData, roomId}) {
      try {
        const url = `${process.env.VUE_APP_CHAT_API}/upload_img_to_s3`
        const config = {
          headers: {
            "content-type": "multipart/form-data",
          },
        };
        const res = await axios.post(url, formData, config);
        const imgDataMaker = (data)=>{
          return  {
            params: JSON.stringify([
              {
                USER_ID : getters.getUserId,
                ROOM_ID : roomId,
                MESSAGE : data,
                MEDIA : 1
              },
            ]),
          };
        }
        let data
        if (res.data.length == 1){
          data = imgDataMaker(res.data[0])
        }
        else {
          data = imgDataMaker(res.data.join(','))
        }
        try {
          await axios.post(`${process.env.VUE_APP_CHAT_API}/insert_chat`,data)
        } catch(e){
          console.log('받아온 url을 db로 보낼 때 생기는 오류')
          console.log(e)
        }



        //


      } catch (e) {
        console.log('s3에 업로드할 때 오류')
        console.log(e);
      }
    },
    async uploadVideoToS3({getters},{formData, roomId}) {
      console.log(getters,roomId)
      try {
        const url = `${process.env.VUE_APP_CHAT_API}/upload_video_to_s3`
        const config = {
          headers: {
            "content-type": "multipart/form-data",
          },
        };
        const res = await axios.post(url, formData, config);
          let data = {
            params: JSON.stringify([
              {
                USER_ID : getters.getUserId,
                ROOM_ID : roomId,
                MESSAGE : res.data,
                MEDIA : 2
              },
            ]),
          };
          try {
            await axios.post(`${process.env.VUE_APP_CHAT_API}/insert_chat`,data)
          } catch(e){
            console.log(e)
          }

      } catch (e) {
        console.log(e);
      }
    },

  },
  getters: {
    getUserId(state, getters, rootState){
      return rootState.User.userInfo.id
    },
    getChatRooms(state){
      return state.chatRooms
    },
    getChats(state){
      return state.chats
    },
    getSocket(state){
      return state.sockets
    },
    getAreYouInAppList(state){
      return state.areYouInAppList
    },
    getNewChats(state){
      return state.newChats
    },
    getRoomId(state){
      return state.roomId
    },
    getDelChatList(state){
      return state.delChatList
    },
    getOpponentAvatar(state){
      return state.opponentInfo.opponentAvatar
    },
    getOpponentSiteName(state){
      return state.opponentInfo.siteName
    },
    getErrorState(state){
      return state.errorState
    }

  },
};

