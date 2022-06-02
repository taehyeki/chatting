import Vue from 'vue'
import { extend, ValidationObserver, ValidationProvider } from 'vee-validate' // extend
import { max, required, numeric, digits, email, confirmed, length } from 'vee-validate/dist/rules'
extend('max', {
  ...max,
  message: '{_field_} 는 {length} 자 이하입니다.'
})

/* 필수 */
extend('required', {
  ...required,
  message: '{_field_}는 필수로 입력해 주세요.'
})
extend('eunRequired', {
  ...required,
  message: '{_field_}은 필수로 입력해 주세요.'
})
extend('numeric', {
  ...numeric,
  message: '{_field_} 숫자만 가능합니다.'
})
extend('digits', {
  ...digits,
  message: '{_field_} 는 {length} 자리만 가능합니다.'
})
extend('email', {
  ...email,
  message: '{_field_} 는 잘못 된 이메일 형식입니다.'
})
extend('confirmed', {
  ...confirmed,
  message: '{target}가 일치하지 않습니다.'
})
extend('length', {
  ...length,
  message: '{_field_}는 - 포함 {length} 자리 입니다.'
})

// 아이디 정규식
extend('id',(value)=>{
  console.log(value)
  // 정규식 앞에 !를 붙혀야 정규식이 아닌 로직으로 수행됨
  if (!/^[a-z]+[a-z0-9]{5,19}$/g.test(value)) {
    return "영문자로 시작하는 영문자 소문자와 숫자포함 6~20자를 입력해주세요."
  }
  return true
})

//패스워드 정규식
extend('password',(value)=>{
  console.log(value)
  // 정규식 앞에 !를 붙혀야 정규식이 아닌 로직으로 수행됨
  if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,20}$/.test(value)) {
    return "비밀번호는 최소 1개 이상의 숫자와 특수문자(!,@,#,$,%,&,*)를 포함하여 8자 이상 20자 미만으로 입력해 주세요."
  }
  return true
})

// 한글만 사용하는 정규식
extend('korean',(value)=>{
  console.log(value)
  // 정규식 앞에 !를 붙혀야 정규식이 아닌 로직으로 수행됨
  if (!/^[가-힣]+$/.test(value)) {
    return "이름은 한글만 입력할 수 있습니다."
  }
  return true
})

/*
extend('max', (value, params) => {
  // console.log(params)
  const limit = params[0]
  if(value && value.length > limit) {
    return `해당 필드는 ${limit}자를 초과할 수 없습니다.`
  }
  return true
})
*/

// ValidationObserver, // 모든 provider 를 감싸주면 됨
// ValidationProvider // 유효성 검사하고 싶은 필드를 감쌈
Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)
