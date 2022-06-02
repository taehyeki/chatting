<template>
  <v-app>
    <v-main>
      <Page1
        id="page1Section"
      />
      <Page2
        id="page2Section"
      />
      <Page3
        id="page3Section"
      />
      <Page4
        id="page4Section"
      />
      <Page5
        id="page5Section"
      />
      <!-- <LevelBar :level="level" /> -->
      <ScrollUpBtn v-show="scrollUpBtnToggle" />
    </v-main>
  </v-app>
</template>

<script>
// import LevelBar from '@/components/info-page/levelBar.vue';
import Page1 from '@/components/info-page/Page1.vue';
import Page2 from '@/components/info-page/Page2.vue';
import Page3 from '@/components/info-page/Page3.vue';
import Page4 from '@/components/info-page/Page4.vue';
import Page5 from '@/components/info-page/Page5.vue';
import ScrollUpBtn from '@/components/info-page/ScrollUpBtn.vue';
// import $ from 'jquery';

export default {
  components: {
    // LevelBar,
    Page1,
    Page2,
    Page3,
    Page4,
    Page5,
    ScrollUpBtn,
  },
  data: () => ({
    scrollUpBtnToggle: false,
    fullScreenData: null,
  }),
  computed: {
    getUserOs() {
      return this.$store.state.User.userOs
    }
  },
  watch: {
    fullScreenData() {
      if(this.getUserOs === "android") {
        window.scrollTo({top: this.page4, left: 0})
      }
    }
  },
  created() {
    window.scrollTo(0, 0)
  },
  mounted() {
    document.addEventListener('scroll', this.scrollEvents);
    this.page4 = document.getElementById("page4Section").getBoundingClientRect().top;
  },
  destroyed() {
    document.removeEventListener('scroll', this.scrollEvents)
  },
  methods: {
    scrollEvents() {
      console.log("testetstest",document.fullscreenElement)
      this.fullScreenData = document.fullscreenElement
      let scrollH = document.documentElement.scrollTop
      let contentH = this.$vuetify.breakpoint.height

      if(scrollH > contentH) {
        this.scrollUpBtnToggle = true
      }else {
        this.scrollUpBtnToggle = false
      }
    }
  }
}
</script>

<style scoped>

</style>
