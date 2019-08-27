import socket from './index'

let init = function (_this) {
  socket.on('UPDATE_MESSAGE', function (data) {
    _this.$store.commit('UPDATE_MESSAGE', { data: data })
  })
  socket.on('UPDATE_USER_LIST', function (data) {
    _this.$store.commit('UPDATE_USER_LIST', { data: data })
  })
}

export default init
