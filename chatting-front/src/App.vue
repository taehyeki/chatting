<template>
  <div>
    <!-- axios사용시 로딩을 을 보여주기위해 사용 -->
    <v-overlay
      v-if="isLoading"
      opacity="0"
    >
      <v-progress-circular
        indeterminate
        size="64"
        color="chiumColor"
      />
    </v-overlay>
    <v-fade-transition mode="out-in">
      <router-view />
    </v-fade-transition>
  </div>
</template>

<script>
export default {
  name: "App",
    // State에 있는 회원 유형 데이터를 가져온다.

  computed: {
    // axios사용시 로딩화면 이용
    // interceptor에서 로딩 컨트롤
    // vuex에서 로딩 ui를 사용할건지 아닌지 데이터를 가져옴
    isLoading() {
      return this.$store.state.Common.isLoading
    },
    // 유저의 로그인 여부를 파악할 수 있음
    getUserId(){
      return this.$store.state.User.userInfo.id
    }
  },
  watch : {
    getUserId(to,from){
        // 로그인, 로그아웃에 따라 userId-2방 입장, 퇴장을 시킨다.
        if (to==null ){
          this.$leaveRoom(`${from}-2`)
        } else {
          this.$enterRoom(`${to}-2`)
        }
    }
  },
  // 새로고침 시에 만약 유저아이디가 있다면
  // 다시 방에 재입장 시킴
  created(){
    if(this.getUserId != null){
      this.$enterRoom(`${this.getUserId}-2`)
    }
  }
};
</script>
