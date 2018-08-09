const express = require('express')
const Common = require('../../lib/common')
const { check, validationResult } = require('express-validator/check')

const router = express.Router()
const User = require('../../models/user')
const Token = require('../../models/token')

/*
const multer = require('multer')
const upload = multer()
*/

router.get('/create', [
  // validation
  check('test').isLength({ min: 1, max: 3 }),
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.send(errors.mapped())
  }

  const doc = {
    account: 'temo',
    nickname: 'ても',
    password: Common.createPassword('********'),
  }

  return User.findOneAndUpdate({ account: doc.account }, doc, { upsert: true }, (err) => {
    const resp = {
      status: true,
      message: null,
    }
    if (err) {
      resp.status = false
      resp.message = 'user upsert failed'
    }
    return res.apiResponse(res, resp.status, resp.message)
  })
})

/*
validation sample

# 一覧
https://github.com/chriso/validator.js

# 必須はlength でみときゃいい
check('account').isLength({ min: 1, max: 3 })
*/
router.post('/signIn', [
  // validation
  check('account').isAscii(),
  check('password').isLength({ min: 8 }),
], (req, res) => {
  console.log(req.body)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.apiResponse(res, false, errors.mapped())
  }

  // 検索
  User.where({
    account: req.body.account,
    password: Common.createPassword(req.body.password),
  }).findOne().exec().then((user) => {
    // 見つからない
    if (!user) {
      return res.apiResponse(res, false, 'user not found')
    }

    // upsert token
    const doc = {
      account: user.account,
      token: Common.createPassword(user.account + (+new Date()) + user.password),
    }
    Token.findOneAndUpdate({ account: user.account }, doc, { upsert: true }, (err) => {
      if (err) {
        return res.apiResponse(res, false, 'token upsert failed')
      }
      return res.apiResponse(res, true, null, { token: doc.token, nickname: user.nickname })
    })
  })
})

router.post('/signOut', [
  // validation
  check('token').isLength({ min: 64, max: 64 }),
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.apiResponse(res, false, errors.mapped())
  }

  // upsert token
  const doc = {
    token: null,
  }
  Token.findOneAndUpdate({ token: req.body.token }, doc, { upsert: true }, (err) => {
    return res.apiResponse(res, true, err)
  })
})

/* GET home page. */
router.get('/:id', (req, res) => {
  // get をとる
  const hoge = req.query.hoge
  console.log(hoge)

  // restful な parameter
  console.log(req.params)

  console.log(Common.createPassword('aaaaa'))

  // mongodb test
  /*
  const test = new Test()

  test.name = 'temo'
  test.age = +new Date()
  test.nickname = 'あれ？ h  oge'
  test.save()
  */

  /*
  test.save((err) => {
    if (err) {
      console.log(err)
      return res.send('database error')
    }

    return res.send('document upsert? success')
  })
  */

  console.log(process.env.NODE_ENV)
  const env = process.env.NODE_ENV
  res.send(`album api watch 治った？ うごくかなー ${env}`)
})

router.get('/search/:name', (req, res) => {
  // restful な parameter
  const name = req.params.name
  console.log(name)

  /*
  Test.find({ name }, (err, tests) => {
    console.log(tests)
    res.send(tests)
  })
  next()
  */
  res.send('hoe')
})


module.exports = router
