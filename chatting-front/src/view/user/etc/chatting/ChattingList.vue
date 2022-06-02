<template>
  <div>
    <ChatAppBar
      app-bar-title="Messages"
    />
    <ChatRoomList />
  </div>
</template>
<script>
import ChatAppBar from '@/components/chat/ChatAppBar.vue';
import ChatRoomList from '@/components/chat/ChatRoomList.vue';
export default {
  components : {
    ChatAppBar,ChatRoomList
  },
}
</script>
<style lang="">

</style>












<!-- <template>
  <v-app>
    <AppBarPreviousRoute />
    <v-main>
      <TextSize20Bold
        class="my-10 px-6"
        text-value="채팅"
      />
      <v-divider />
      <ChattingListForm
        img-src="https://cdn.vuetifyjs.com/images/john.jpg"
        user-name="명식소프트"
        date="21-09-21"
        content="안녕"
        @click.native="detailPage"
      />
      <ChattingListForm
        img-src="https://cdn.vuetifyjs.com/images/john.jpg"
        user-name="ms소프트"
        date="21-08-11"
        content="명식소프트님이 프론트엔드 개발자가 되었습니다. 나이스"
        @click.native="detailPage"
      />
    </v-main>
  </v-app>
</template>

<script>
import AppBarPreviousRoute from '@/components/appbar/AppBarPreviousRoute.vue'
import TextSize20Bold from '@/components/text/text_size20_bold.vue';
import ChattingListForm from '@/components/form/ChattingListForm.vue';

export default {
  name: "ChattingList",
  components: {
    AppBarPreviousRoute,
    TextSize20Bold,
    ChattingListForm
  },
  methods: {
    // 채팅방으로 이동
    detailPage() {
      this.$router.push({
        path: './chatting-detail'
      })
    }
  }
}
</script>

<style>

</style>
-->
