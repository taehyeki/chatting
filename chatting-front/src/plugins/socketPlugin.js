

import store from "../store"
import io from "socket.io-client";

// 소켓을 전역으로 사용하기위해 플러그인으로 사용
// 소켓을 전역으로 만들지 않고 단순히 채팅방에 입장했을 때 생성하는 방식을 사용하려고 하였으나
// Vue의 SPA 특성상 다른 화면으로 이동해도 socket이 disconnect되지 않고 유지 되는 현상..
// 따라서 다른 곳을 나갔다 들어오면 또 소켓이 생성되는 현상이 발생한다. 소켓 컨트롤이 힘들어 지게됨.
// 따라서 처음에 소켓을 만들어 두는 방식을 선택

// transports에 websocket을 적어준 이유는 폴링방식 -> 소켓 방식으로 넘어가지않고
// 바로 넘어가도록, withCredentials를 안주면 오류 발생..

const socket =  io(`${process.env.VUE_APP_CHAT_API}`,{
          transports: ["websocket"],
          withCredentials: true,
      });
export default {
  install(Vue) {
    // 전역에 소켓과 이벤트 리스너 설정
    Vue.prototype.$socket = socket;
    Vue.prototype.$socket.on('connect', () => {
      store.state.Chat.sockets++
    });
    // 굳이 함수를 만들고 그 안에 이벤트를 전송하거나 리스너를 선택한 이유는
    // 필요한 params 를 전달할 수 있는 방법을 찾이 못했다.( 단순히 나의 생각 )
    // 그래서 함수를 통해 params를 받은 뒤 그 param을 이벤트 리스너들에게 전달하는 방식을 선택

    Vue.prototype.$enterRoom = (roomId) => {
      Vue.prototype.$socket.emit('joinRoom',roomId)
    };
    Vue.prototype.$chatSet = (fn) => {
      Vue.prototype.$socket.on('chat',fn)
    };
    Vue.prototype.$leaveRoom = (roomId) => {
      Vue.prototype.$socket.emit('leaveRoom',roomId)
    };
    Vue.prototype.$disconnetFromServer = (fn) => {
      Vue.prototype.$socket.on('disconnect',fn)
    };
    Vue.prototype.$reload = (fn) => {
      Vue.prototype.$socket.on('reload',fn)
    };
    Vue.prototype.$reloadChatRooms = (fn) => {
      Vue.prototype.$socket.on('reloadChatRooms',fn)
    };
    Vue.prototype.$deleteChat = (fn) => {
      Vue.prototype.$socket.on('yesDelete',fn)
    };
    Vue.prototype.$deleteChatReloadRoomList = (fn) => {
      Vue.prototype.$socket.on('yesDeleteForRoomList',fn)
    };
    Vue.prototype.$imOnApp = (fn) => {
      Vue.prototype.$socket.on('imOnApp',fn)
    };
  },
};



