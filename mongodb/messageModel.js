const mongoose = require('./db')
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose)

let MessageSchema = new Schema({
  time: { type: Date },
  fromUid: { type: String },
  type: { type: Number },
  content: { type: String }
})

MessageSchema.plugin(AutoIncrement, { inc_field: 'id' })

module.exports = mongoose.model('Message', MessageSchema)
