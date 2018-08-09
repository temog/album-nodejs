const express = require('express')

const router = express.Router()
const Test = require('../../models/test')

router.get('/', (req, res) => {
  res.send('hogeeeee')
})

/* GET home page. */
router.get('/:id', (req, res) => {
  // get をとる
  const hoge = req.query.hoge
  console.log(hoge)

  // restful な parameter
  console.log(req.params)

  // mongodb test
  const test = new Test()

  test.name = 'temo'
  test.age = +new Date()
  test.nickname = 'あれ？ h  oge'
  test.save()

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

router.get('/search/:name', (req, res, next) => {
  // restful な parameter
  const name = req.params.name
  console.log(req.params)

  Test.find({ name }, (err, tests) => {
    console.log(tests)
    res.send(tests)
  })
  next()
})


/* POST */
const multer = require('multer')

const upload = multer()
router.post('/', upload.fields([]), (req, res, next) => {
  // post をとる
  const { fuga } = req.body.fuga
  console.log(req.body)
  console.log(`post fuga: ${fuga}`)

  res.send(req.body)
  next()
})


module.exports = router
