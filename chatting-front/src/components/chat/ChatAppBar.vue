<template>
  <v-app-bar

    color="white"
    :elevation="0"
  >
    <v-row
      class="app-bar"
      justify="space-between"
      no-gutters
      align="center"
    >
      <v-col cols="auto">
        <v-icon
          size="24"
          color="black"
          @click="moveBack"
        >
          mdi-arrow-left
        </v-icon>
      </v-col>
      <v-col
        cols="auto"
        class="green-text"
      >
        <TextSize20 :text-value="appBarTitle" />
      </v-col>
      <v-col cols="auto">
        <div style="width: 20px;" />
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<script>
import TextSize20 from '@/components/text/text_size20.vue';

export default {
  components: {
    TextSize20
  },
  props: {
    appBarTitle: {
      type: String,
      default: null,
    },
  },
  methods:{
    moveBack() {
      this.$router.go(-1)
    }
  }

}
</script>

<style scoped >

.green-text {
  color : #086851;
}
</style>
