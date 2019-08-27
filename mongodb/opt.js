let User = require('./userModel')
let Message = require('./messageModel')

async function insertUser (user) {
  let userDoc = new User(user)
  let res = {}
  let success = true
  try {
    res = await userDoc.save()
  } catch (e) {
    res = e._message
    success = false
  }
  return { success, res }
}

async function insertMessage (message) {
  message.time = new Date()
  let messageDoc = new Message(message)
  let res = {}
  let success = true
  try {
    res = await messageDoc.save()
  } catch (e) {
    res = e._message
    success = false
  }
  return { success, res }
}

async function searchUser (username, _id) {
  let res = {}
  let success = true
  try {
    res = await User.find({ username: username })
  } catch (e) {
    res = e._message
    success = false
  }
  return { success, res }
}

async function getAllUsers () {
  let res = {}
  let success = true
  try {
    res = await User.find()
  } catch (e) {
    res = e._message
    success = false
  }
  return { success, res }
}

async function getHistoryMessage (smallestMessageId, pageSize) {
  let res = []
  let success = true
  try {
    res = await Message.find({ id: { $lt: +smallestMessageId } }).sort({ id: -1 }).limit(pageSize)
    res = res.reverse()
  } catch (e) {
    res = e._message
    success = false
  }
  return { success, res }
}

module.exports = {
  insertMessage,
  insertUser,
  searchUser,
  getAllUsers,
  getHistoryMessage
}
