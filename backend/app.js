const express = require('express')
const path = require('path')
// const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const app = express()

// mongodb
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/album_test', { useMongoClient: true }, (err) => {
  if (err) {
    console.log('connection error')
  }
})
mongoose.Promise = global.Promise

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// ajax許可
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// 共通レスポンス
app.use((req, res, next) => {
  res.apiResponse = function apiResponse(response, status, msg, ext) {
    const data = ext || {}
    if (status === true) {
      data.status = 'success'
    } else if (status === false) {
      data.status = 'error'
    } else {
      data.status = status
    }
    data.message = msg
    return response.send(data)
  }
  next()
})

// routing
const album = require('./routes/album')
const apiTest = require('./routes/api/test')
const apiUser = require('./routes/api/user')
const apiImage = require('./routes/api/image')
const apiTag = require('./routes/api/tag')

app.use('/album', album)
app.use('/album/api/test', apiTest)
app.use('/album/api/user', apiUser)
app.use('/album/api/image', apiImage)
app.use('/album/api/tag', apiTag)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
  next()
})


app.listen(8081, 'localhost')

module.exports = app
