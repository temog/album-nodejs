/*
mongoose document
http://mongoosejs.com/docs/guide.html
*/
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
  account: String,
  nickname: String,
  password: String,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})

module.exports = mongoose.model('User', UserSchema)
