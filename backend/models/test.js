const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TestSchema = new Schema({
  name: String,
  age: Number,
  nickname: String,
})

module.exports = mongoose.model('Test', TestSchema)
