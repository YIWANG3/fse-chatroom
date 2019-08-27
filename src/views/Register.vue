<template>
  <div>
    <div class="logo">Chat Room</div>
    <div class="account">
      <div class="left">
        <div class="big-text">Create an account and chat with all CMU-SV students!</div>
      </div>
      <div class="right">
        <div class="form">
          <div class="form-item">
            <div class="text">
              User Name
            </div>
            <input v-model="username" type="text"/>
          </div>
          <div class="form-item">
            <div class="text">
              Password
            </div>
            <input v-model="password" type="password"/>
          </div>
          <div class="form-item">
            <div class="text">
              Confirm Password
            </div>
            <input v-model="confirmPassword" type="password"/>
          </div>
        </div>
        <div class="btn" @click="register()">
          Register Now
          <img class="arrow" src="../assets/arrow.svg"/>
        </div>
        <div class="append">
          <router-link class="text" to="/login">Already have an account?</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Toast from '../components/toast'

  export default {
    name: 'register',
    data () {
      return {
        username: '',
        password: '',
        nickname: '',
        confirmPassword: '',
        step: 0
      }
    },
    methods: {
      register () {
        if (this.password && this.username && this.password === this.confirmPassword) {
          this.$store.dispatch('REGISTER', {
            username: this.username,
            password: this.password,
            nickname: this.nickname || this.username
          })
        } else {
          Toast('Your password should be the same')
        }
      },
      addNativeEventListener () {
        let that = this
        document.addEventListener('keypress', function (e) {
          if (e.key === 'Enter') {
            that.register()
          }
        })
      }
    }
  }
</script>
<style lang="less">
  @import './Style.less';
</style>
