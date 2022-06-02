<template lang="">
  <div class="only-chat-image">
    <div :class="{'len1': returnLength === 1, 'len2': returnLength === 2, 'len3' : returnLength === 3,'len4' : returnLength === 4,'len5' : returnLength >= 5 }">
      <img
        v-for="i,idx in parsedImages"
        :key="idx"
        :src="i"
        @click="showPicture(i)"
      >
    </div>
    <v-dialog
      :value="overlayValue"
      @click:outside="resetPicture"
    >
      <img
        :src="nowTargetPicture"
        style="height:100%"
      >
    </v-dialog>
  </div>
</template>
<script>
export default {
  name : 'ChatImages',
  props : {
    images : {
      default : '',
      type : String
    }

  },
  data(){
    return {
      parsedImages : [],
      overlayValue : false,
      nowTargetPicture : ''
    }
  },
  computed : {
    returnLength(){
      return this.parsedImages.length
    }
  },
  created(){
    this.parsedImages = this.images.split(',')
  },
  methods : {
    showPicture(img){
      this.overlayValue = true
      this.nowTargetPicture = img
    },
    resetPicture(){
      this.overlayValue = false
      this.nowTargetPicture = ''
    }
  }
}
</script>
<style  lang="scss" >
.only-chat-image .v-dialog.v-dialog--active img {
  border-radius: 0px  ;
  box-shadow: none ;
}
.only-chat-image {
  .len1 {
    img {
      width : 160px;
      height: 200px;
      border-radius: 8px;
    }
  }
  .len2 {
    img {
      width : 96px;
      height: 120px  ;
      border-radius: 8px;

    }
    img:last-child{
      margin-left : 8px;
    }
  }
  .len3 {
    img {
      width : 64px;
      height: 80px  ;
      border-radius: 8px;

    }
    img:not(:first-child){
      margin-left : 8px;
    }
  }
  .len4 {
    width: 200px;
    flex-wrap: wrap;
    display: flex;
    img {
      width : 96px;
      height: 120px  ;
      border-radius: 8px;

    }
    img:nth-child(1){
      margin-bottom : 8px;
    }
    img:nth-child(2n){
      margin-left : 8px;
    }
  }
  .len5 {
    width: 208px;
    flex-wrap: wrap;
    display: flex;
    img {
      width : 64px;
      height: 80px  ;
      border-radius: 8px;
      margin-left : 8px;
    }
    img:nth-child(1){
      margin-left : 0px;
      margin-bottom : 8px;
    }
    img:nth-child(4){
      margin-left : 0px;
    }
  }
}
</style>
