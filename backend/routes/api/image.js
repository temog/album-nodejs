const express = require('express')
const fs = require('fs')
const Common = require('../../lib/common')
const { check, validationResult } = require('express-validator/check')

const router = express.Router()
const User = require('../../models/user')
const Tag = require('../../models/tag')
const Image = require('../../models/image')

router.get('/test', (req, res) => {
  console.log(req.query)

  const token = req.query.token

  /* promise 処理開始 */
  // token認証
  Common.validationToken(token).then((result) => {
    console.log('promise return ?')
    if (!result) {
      return res.apiResponse(res, 'authError')
    }
    return res.apiResponse(res, true)
  })
})

router.post('/add', [
  // validation
  check('tag').isLength({ min: 1, max: 100 }),
  check('token').isLength({ min: 64, max: 64 }),
  check('images').isLength({ min: 1 }),
], (req, res) => {
  console.log(req.body)
  console.log(User)
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.apiResponse(res, false, errors.mapped())
  }

  const token = req.body.token

  /* promise 処理開始 どーなんだこれ */
  // token認証
  Common.validationToken(token).then((tokenData) => {
    console.log('promise return ?')
    if (!tokenData) {
      return res.apiResponse(res, 'authError')
    }

    // タグ登録 promise を配列に放り込んで promise all する
    const tag = req.body.tag.replace('　', ' ')
    const tagArray = tag.split(' ')
    const promises = []
    for (let i = 0; i < tagArray.length; i += 1) {
      const t = tagArray[i]
      if (t) {
        console.log(t)
        promises.push(Tag.findOneAndUpdate({ name: t }, { name: t }, { upsert: true }).exec())
      }
    }

    const tagId = []
    Promise.all(promises).then((result) => {
      return result
    }).then((tagsResult) => {
      // タグの id を取る
      tagsResult.forEach((t) => {
        tagId.push(t._id)
      })
      // ユーザを取得
      return User.where({ account: tokenData.account }).findOne().exec()
    }).then((user) => {
      console.log(user)
      // 画像を登録
      const images = req.body.images
      const imagePromise = []
      for (let i = 0; i < images.length; i += 1) {
        const image = images[i]
        const imageDoc = {
          userId: user._id,
          secret: image.secret,
          memo: image.memo,
          tag: tagId,
        }

        console.log(imageDoc)
        imagePromise.push(Image.create(imageDoc))
      }
      Promise.all(imagePromise).then((imageResult) => {
        const filePromise = []
        for (let i = 0; i < imageResult.length; i += 1) {
          const image = images[i]
          // base64から画像保存
          const base64Data = image.url.replace(/^data:image\/png;base64,/, '')
          filePromise.push(new Promise((resolve, reject) => {
            fs.writeFile('./data/image/' + imageResult[i]._id, base64Data, 'base64', (err) => {
              if (err) {
                reject(err)
              } else {
                resolve(true)
              }
            })
          }))
        }

        Promise.all(filePromise).then((result) => {
          // 全部終わったら成功
          return res.apiResponse(res, true, result)
        })
      })
    }).catch((err) => {
      // 何かで失敗したらエラー
      return res.apiResponse(res, false, err)
    })
  })
})

module.exports = router
