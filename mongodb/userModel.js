const mongoose = require('./db')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

let UserSchema = new Schema({
  username: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: { type: String },
  registerTime: { type: Date },
  token: { type: String },
  lastActiveTime: { type: Date },
  nickname: { type: String }
})

UserSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', UserSchema)
