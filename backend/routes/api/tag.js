const express = require('express')
const Common = require('../../lib/common')
const { check, validationResult } = require('express-validator/check')

const router = express.Router()
const Tag = require('../../models/tag')

router.post('/getIndex', [
  check('token').isLength({ min: 64, max: 64 }),
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.apiResponse(res, false, errors.mapped())
  }

  const token = req.body.token

  // token認証
  Common.validationToken(token).then((tokenData) => {
    console.log('promise return ?')
    if (!tokenData) {
      return res.apiResponse(res, 'authError')
    }

    return Tag.find().exec()
  }).then((result) => {
    for (let i = 0; i < result.length; i += 1) {
      const t = result[i]
      console.log(t)
    }
    return res.apiResponse(res, true, null, { tags: result })
  }).catch((err) => {
    // 何かで失敗したらエラー
    return res.apiResponse(res, false, err)
  })
})

router.post('/getAll', [
  // validation
  check('token').isLength({ min: 64, max: 64 }),
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.apiResponse(res, false, errors.mapped())
  }

  const token = req.body.token

  // token認証
  Common.validationToken(token).then((tokenData) => {
    console.log('promise return ?')
    if (!tokenData) {
      return res.apiResponse(res, 'authError')
    }

    return Tag.find().exec()
  }).then((result) => {
    return res.apiResponse(res, true, null, { tags: result })
  }).catch((err) => {
    // 何かで失敗したらエラー
    return res.apiResponse(res, false, err)
  })
})

module.exports = router
