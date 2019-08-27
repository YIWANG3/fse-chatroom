<template>
  <div>
    <div class="nav">
      <div class="logo">Chat Room</div>
      <div class="menu">
        <div class="menu-item" @click="jumpToRegister">New Account</div>
        <div class="menu-item" @click="logout">Logout</div>
        <div class="menu-item username">{{username}}</div>
      </div>
    </div>
    <div class="chat">
      <div class="new-message-tip" v-if="showNewMsgTip" @click="viewNewMsg">New Message</div>
      <div class="input-container">
        <input v-model="inputMessage" type="text"/>
        <div class="send-btn" @click="sendMsg"><img src="../assets/arrow.svg"></div>
      </div>
      <div class="bubble">
        <div class="bubble-wrap" ref="bubbleWrap" @scroll="handleScroll">
          <div v-for="(item,index) in messages" :key="index" class="chat-item">
            <div class="container" v-if="item.fromUid !== _id">
              <div class="left">
                <div class="avatar color" v-if="item.avatar.indexOf('#') === 0"
                     :style="{ 'backgroundColor': item.avatar }">
                  {{item.username.substr(0,1)}}
                </div>
                <div v-else class="avatar"><img :src="item.avatar"/></div>
              </div>
              <div class="right content-area">
                <div class="text">{{item.content}}</div>
                <div class="sub-text">
                  <span class="span-left">{{item.username}}</span>
                  <span>{{item.time}}</span></div>
              </div>
            </div>
            <div class="right-container" v-else>
              <div class="left content-area">
                <div class="text">{{item.content}}</div>
                <div class="time">{{item.time}}</div>
              </div>
              <div class="right">
                <div class="avatar color" v-if="item.avatar.indexOf('#') === 0"
                     :style="{ 'backgroundColor': item.avatar }">
                  {{item.username.substr(0,1)}}
                </div>
                <div v-else class="avatar"><img :src="item.avatar"/></div>
              </div>
            </div>
          </div>
          <div class="blank" style="height: 100px;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import init from '../im-core/init'

  let lodash = require('lodash')
  let Cookies = require('js-cookie')

  let isLogin = function () {
    return Cookies.get('_id') && Cookies.get('username')
  }

  export default {
    name: 'home',
    data () {
      return {
        inputMessage: ''
      }
    },
    beforeMount () {
      if (!isLogin()) {
        this.$router.push('/login')
      }
      this.$store.commit('SET_USER_INFO')
      init(this)
      this.$store.dispatch('INIT_DATA')
    },
    mounted () {
      this.addNativeEventListener()
    },
    updated () {
      if (this.needScrollToBottom) {
        this.scrollToBottom()
      }
    },
    computed: {
      messages () {
        return this.$store.state.messages
      },
      _id () {
        return this.$store.state._id
      },
      username () {
        return this.$store.state.username
      },
      isLoading () {
        return this.$store.state.isLoading
      },
      needScrollToBottom () {
        return this.$store.state.needScrollToBottom
      },
      showNewMsgTip () {
        return this.$store.state.showNewMsgTip
      }
    },
    methods: {
      sendMsg () {
        if (this.inputMessage !== '') {
          this.$store.dispatch('SEND_MSG', {
            content: this.inputMessage,
            type: 0
          })
          this.inputMessage = ''
        }
      },
      login () {
        this.$router.push('login')
      },
      handleScroll: lodash.debounce(function () {
        const container = this.$refs.bubbleWrap
        const scrollTop = container.scrollTop
        if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
          this.$store.commit('SET_NEED_SCROLL_TO_BOTTOM', true)
          this.$store.commit('SET_SHOW_NEW_MSG_TIP', false)
        } else {
          this.$store.commit('SET_NEED_SCROLL_TO_BOTTOM', false)
        }
        // console.log(container.scrollTop + container.clientHeight >= container.scrollHeight)
        // console.log(container.scrollTop, container.clientHeight, container.scrollHeight)
        if (scrollTop === 0 && !this.isLoading) {
          this.$store.dispatch('GET_HISTORY_MESSAGE')
        }
      }, 100),
      scrollToBottom () {
        const container = this.$refs.bubbleWrap
        container.scrollTop = container.scrollHeight
      },
      addNativeEventListener () {
        let that = this
        document.addEventListener('keypress', function (e) {
          if (e.key === 'Enter') {
            that.sendMsg()
          }
        })
      },
      jumpToRegister () {
        this.$router.push('register')
      },
      logout () {
        this.$store.commit('LOGOUT')
      },
      viewNewMsg () {
        this.scrollToBottom()
        this.$store.commit('SET_NEED_SCROLL_TO_BOTTOM', true)
        this.$store.commit('SET_SHOW_NEW_MSG_TIP', false)
      }
    }
  }
</script>
<style lang="less">
  .nav {
    height: 60px;
    background-color: white;
    display: flex;
    justify-content: flex-end;

    .menu {
      display: flex;
      margin-right: 20px;
      color: #0043D8;

      .menu-item {
        margin-left: 60px;
        line-height: 60px;
        cursor: pointer;
        color: rgba(0, 67, 216, 0.6);

        &:hover {
          color: #0043D8;
        }
      }

      .username {
        color: #0043D8;
        font-weight: 600;
      }
    }

    .logo {
      color: #0043D8;
      position: fixed;
      font-size: 24px;
      font-weight: 600;
      left: 20px;
      top: 14px;
    }
  }

  .new-message-tip {
    position: fixed;
    bottom: 72px;
    background-color: #0043D8;
    height: 36px;
    border-radius: 18px;
    line-height: 36px;
    width: 140px;
    transform: translateX(-70px);
    color: white;
    z-index: 99;
    left: 50%;
    cursor: pointer;
  }

  .input-container {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;

    input {
      width: 100%;
      margin: 0 0 10px 10px;
      outline: none;
      border: none;
      font-size: 18px;
      padding: 10px;
      color: #0043D8;
    }

    .send-btn {
      margin-right: 24px;
      cursor: pointer;

      img {
        width: 30px;
      }
    }
  }

  .bubble {
    text-align: left;
    padding: 60px 40px 60px 40px;

    .bubble-wrap {
      height: auto;
      position: absolute;
      top: 60px;
      bottom: 60px;
      right: 0;
      left: 0;
      overflow-y: scroll;

      .chat-item {
        margin-top: 12px;

        .avatar {
          margin-top: 12px;

          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
        }

        .avatar.color {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          color: white;
          font-weight: 900;
          line-height: 40px;
          text-align: center;
          font-size: 28px;
        }

        .content-area {
          max-width: calc(100vw - 200px);
        }

        .container {
          display: flex;

          .left {
            margin-right: 16px;
            margin-left: 20px;
          }

          .right {
            background-color: #F5F5F5;
            color: #0043D8;
            border-radius: 12px;
            padding: 12px;

            .sub-text {
              font-size: 12px;
              color: #A8C6FF;

              .span-left {
                margin-right: 16px;
              }
            }

            .text {
              word-wrap: break-word;
              font-size: 20px;
              margin-bottom: 4px;
            }
          }
        }

        .right-container {
          display: flex;
          justify-content: flex-end;

          .left {
            background-color: #0043D8;
            color: white;
            border-radius: 12px;
            padding: 12px;

            .time {
              font-size: 12px;
              color: rgba(255, 255, 255, 0.5);
            }

            .text {
              word-wrap: break-word;
              font-size: 20px;
              margin-bottom: 4px;
            }
          }

          .right {
            margin-left: 16px;
            margin-right: 20px;
          }
        }
      }
    }
  }

</style>
