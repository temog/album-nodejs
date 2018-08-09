const mongoose = require('mongoose')

const Schema = mongoose.Schema

const TokenSchema = new Schema({
  account: String,
  token: String,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})

TokenSchema.index({ token: 1 }, { background: true })
TokenSchema.index({ created_at: 1 }, { background: true, expireAfterSeconds: 86400 })

module.exports = mongoose.model('Token', TokenSchema)
