/*
mongoose document
http://mongoosejs.com/docs/guide.html
*/
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ImageSchema = new Schema({
  userId: Schema.Types.ObjectId,
  secret: Boolean,
  memo: String,
  tag: Array,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})

ImageSchema.index({ tag: 1, secret: 1 }, { background: true })

module.exports = mongoose.model('Image', ImageSchema)
