let express = require('express')
let app = express()
let cors = require('cors')
let bodyParser = require('body-parser')
let http = require('http').createServer(app)
let io = require('socket.io')(http)
let parseCookies = require('../src/utils/parseCookies')
let { insertMessage, insertUser, searchUser, getAllUsers, getHistoryMessage } = require('../mongodb/opt')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

io.on('connection', function (socket) {
  socket.on('MSG', async function (msg) {
    let _id = parseCookies(socket.handshake.headers.cookie)._id
    let insertResult = await insertMessage({
      time: new Date(),
      fromUid: _id,
      type: msg.type,
      content: msg.content
    })
    if (insertResult.success) {
      io.emit('UPDATE_MESSAGE', insertResult.res)
    }
  })
})

app.post('/register', async function (req, res, next) {
  let params = req.body
  let dbResult = await insertUser({
    username: params.username,
    password: params.password,
    nickname: params.nickname || params.username,
    avatar: params.avatar,
    registerTime: new Date(),
    token: '',
    lastActiveTime: new Date()
  })

  if (dbResult.success) {
    let newUser = {
      username: dbResult.res.username,
      avatar: dbResult.res.avatar,
      _id: dbResult.res._id
    }
    io.emit('UPDATE_USER_LIST', newUser)
    res.status(200).json({ code: 200, success: true, message: 'Register Success!', data: dbResult.res })
  } else {
    res.status(200).json({ code: 1001, success: false, message: 'Register Failed', data: {} })
  }
})

app.post('/login', async function (req, res, next) {
  let params = req.body
  let dbResult = await searchUser(params.username)
  if (dbResult.success && dbResult.res[0].password === params.password) {
    res.status(200).json({ code: 200, success: true, message: 'Login Success!', data: dbResult.res[0] })
  } else {
    res.status(200).json({ code: 1001, success: false, message: 'Login Failed', data: {} })
  }
})

app.get('/userList', async function (req, res, next) {
  let dbResult = await getAllUsers()
  if (dbResult.success) {
    let userList = dbResult.res.map(user => ({ username: user.username, avatar: user.avatar, _id: user._id }))
    res.status(200).json({ code: 200, success: true, message: 'Get All Users', data: userList })
  } else {
    res.status(200).json({ code: 1001, success: false, message: 'Get Users Failed', data: {} })
  }
})

app.get('/historyMessage', async function (req, res, next) {
  let smallestMessageId = +(req.query && req.query.smallestMessageId)
  let pageSize = +(req.query && req.query.pageSize)
  let dbResult = await getHistoryMessage(+smallestMessageId, pageSize)
  if (dbResult.success) {
    res.status(200).json({ code: 200, success: true, message: 'Get Messages', data: dbResult.res })
  } else {
    res.status(200).json({ code: 1001, success: false, message: 'Load Messages Failed', data: {} })
  }
})

http.listen(3000, function () {
  console.log('IM Server Start')
})
