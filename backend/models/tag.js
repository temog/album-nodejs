/*
mongoose document
http://mongoosejs.com/docs/guide.html
*/
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TagSchema = new Schema({
  name: String,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})

TagSchema.index({ name: 1 }, { background: true })

module.exports = mongoose.model('Tag', TagSchema)
