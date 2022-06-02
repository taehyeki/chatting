//TOKEN
function onResultFcmToken(result) {
  window.app.$onResultFcmToken(result)
}

//PUSH
function onResultForeGroundPush(result) {
  window.app.$onResultForeGroundPush(result)
}
function onResultForeGroundPushClick(result) {
  window.app.$onResultForeGroundPushClick(result)
}
// function onResultCallKitAction(result) {
//   if (window.app.$isTest) alert('onResultCallKitAction: ' + JSON.stringify(result))
//   window.app.$onResultCallKitAction(result)
// }

//PERMISSION
// function onResultLocationPermission(result) {
//   if (window.app.$isTest) alert('onResultLocationPermission: ' + JSON.stringify(result))
//   window.app.$onResultLocationPermission(result)
// }
// function onResultCameraPermission(result) {
//   if (window.app.$isTest) alert('onResultCameraPermission: ' + JSON.stringify(result))
//   window.app.$onResultCameraPermission(result)
// }
// function onResultRecordAudioPermission(result) {
//   if (window.app.$isTest) alert('onResultRecordAudioPermission: ' + JSON.stringify(result))
//   window.app.$onResultRecordAudioPermission(result)
// }
// function onResultOverlayPermission(result) {
//   if (window.app.$isTest) alert('onResultOverlayPermission: ' + JSON.stringify(result))
//   window.app.$onResultOverlayPermission(result)
// }

// 안드로이드
// function onNativeBackClick(result) {
//   console.log("콜백작동안함?")
//   window.app.$onNativeBackClick(result)
// }

