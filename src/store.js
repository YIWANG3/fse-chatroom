import Vue from 'vue'
import Vuex from 'vuex'
import socket from './im-core/index'
import axios from 'axios'
import Cookies from 'js-cookie'
import Toast from './components/toast'
import dateformat from './utils/dataFormat'

let randomColor = require('randomcolor')

const pageSize = 20

const SERVER_ADDRESS = 'http://localhost:3000'
Vue.use(Vuex)

const initState = {
  messages: [],
  _id: '',
  isLoading: false,
  loadAll: false,
  username: '',
  userMap: {},
  currentPageIndex: 0,
  totalMessage: 0,
  smallestMessageId: Infinity,
  showNewMsgTip: false,
  needScrollToBottom: true
}

export default new Vuex.Store({
  state: initState,
  mutations: {
    'UPDATE_MESSAGE' (state, payload) {
      let data = payload.data
      let thisUser = state.userMap[data.fromUid]
      data.time = dateformat(data.time, 'mm-dd HH:MM:ss')
      data.username = thisUser.username
      data.avatar = thisUser.avatar
      state.messages.push(data)
      if (thisUser.username === state.username) {
        state.needScrollToBottom = true
      } else if (!state.needScrollToBottom) {
        state.showNewMsgTip = true
      }
    },
    'UPDATE_USER_LIST' (state, payload) {
      state.userMap[payload.data._id] = payload.data
    },
    'SET_USER_INFO' (state, payload) {
      if (payload && payload._id) {
        state._id = payload._id
        state.username = payload.username
      } else {
        state._id = Cookies.get('_id')
        state.username = Cookies.get('username')
      }
    },
    'INIT_USER_MAP' (state, payload) {
      for (let i = 0; i < payload.length; i++) {
        state.userMap[payload[i]._id] = payload[i]
      }
    },
    'UPDATE_HISTORY_MESSAGE' (state, payload) {
      // console.log(payload)
      state.smallestMessageId = (payload[0] && payload[0].id) || 0
      payload.forEach(message => {
        let thisUser = state.userMap[message.fromUid] || {}
        message.avatar = 'https://s2.ax1x.com/2019/07/30/eGHMdJ.jpg'
        message.time = dateformat(message.time, 'mm-dd HH:MM:ss')
        message.username = thisUser.username || 'Unknown'
        message.avatar = thisUser.avatar || 'https://s2.ax1x.com/2019/08/02/ewkAAO.jpg'
      })
      state.messages = payload.concat(state.messages)
    },
    'CHANGE_LOADING_STATE' (state) {
      state.isLoading = !state.isLoading
    },
    'SET_NEED_SCROLL_TO_BOTTOM' (state, payload) {
      state.needScrollToBottom = payload
    },
    'SET_SHOW_NEW_MSG_TIP' (state, payload) {
      state.showNewMsgTip = payload
    },
    'LOGOUT' (state) {
      Cookies.remove('_id')
      Cookies.remove('username')
      state = initState
      window.location.href = '/#/login'
    }
  },
  actions: {
    'INIT_DATA' ({ commit, state }) {
      axios.get(`${SERVER_ADDRESS}/userList`).then(function (res) {
        if (res.data && res.data.success) {
          commit('INIT_USER_MAP', res.data.data)
        }
      }).then(function () {
        commit('CHANGE_LOADING_STATE')
        axios.get(`${SERVER_ADDRESS}/historyMessage`, {
          params: {
            smallestMessageId: state.smallestMessageId,
            pageSize: pageSize
          }
        }).then(function (res) {
          commit('CHANGE_LOADING_STATE')
          if (res.data && res.data.success) {
            commit('UPDATE_HISTORY_MESSAGE', res.data.data)
          } else {
            Toast('Get History Message Failed')
          }
        })
      })
    },
    'SEND_MSG' ({ commit }, payload) {
      socket.emit('MSG', payload)
    },
    'REGISTER' ({ commit }, payload) {
      payload.avatar = randomColor({
        luminosity: 'light'
      })
      axios.post(`${SERVER_ADDRESS}/register`, payload).then(function (res) {
        if (res.data && res.data.success) {
          Cookies.set('_id', res.data.data._id)
          Cookies.set('username', res.data.data.username)
          commit('SET_USER_INFO', res.data.data)
          window.location.href = '/'
        } else {
          Toast('Register Failed')
        }
      })
    },
    'LOGIN' ({ commit }, payload) {
      axios.post(`${SERVER_ADDRESS}/login`, payload).then(function (res) {
        if (res.data && res.data.success) {
          Cookies.set('_id', res.data.data._id)
          Cookies.set('username', res.data.data.username)
          window.location.href = '/'
        } else {
          Toast('Login Failed')
        }
      })
    },
    'GET_USER_LIST' ({ commit }, payload) {
      axios.get(`${SERVER_ADDRESS}/userList`).then(function (res) {
        if (res.data && res.data.success) {
          commit('INIT_USER_MAP', res.data.data)
        }
      })
    },
    'GET_HISTORY_MESSAGE' ({ commit, state }) {
      commit('CHANGE_LOADING_STATE')
      axios.get(`${SERVER_ADDRESS}/historyMessage`, {
        params: {
          smallestMessageId: state.smallestMessageId,
          pageSize: pageSize
        }
      }).then(function (res) {
        commit('CHANGE_LOADING_STATE')
        if (res.data && res.data.success) {
          commit('UPDATE_HISTORY_MESSAGE', res.data.data)
        } else {
          Toast('Get History Message Failed')
        }
      })
    }
  }
})
