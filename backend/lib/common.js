const crypto = require('crypto')
const Token = require('../models/token')

class Common {
  static hoge() {
    console.log(' common hogeeee')
  }

  static validationToken(tokenStr) {
    console.log('valid token 1')
    if (!tokenStr) {
      return false
    }
    console.log('valid token 2')

    return Token.where({
      token: tokenStr,
    }).findOne().exec().then((data) => {
      // 見つからない
      if (!data) {
        console.log('valid token 3')
        return false
      }
      console.log('valid token 4')
      return data
    })
  }

  static createPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex')
  }
}

module.exports = Common
