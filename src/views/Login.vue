<template>
  <div>
    <div class="logo">Chat Room</div>
    <div class="account">
      <div class="left">
        <div class="big-text">Welcome back, Join the chat now!</div>
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
        </div>
        <div class="btn" @click="login()">
          Login
          <img class="arrow" src="../assets/arrow.svg"/>
        </div>
        <div class="append">
          <router-link class="text" to="/register">Create an account</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data () {
      return {
        msg: '',
        username: '',
        password: ''
      }
    },
    computed: {},
    methods: {
      login () {
        this.$store.dispatch('LOGIN', { username: this.username, password: this.password })
      },
      addNativeEventListener () {
        let that = this
        document.addEventListener('keypress', function (e) {
          if (e.key === 'Enter') {
            that.login()
          }
        })
      }
    }
  }
</script>
<style lang="less">
  @import './Style.less';
</style>
