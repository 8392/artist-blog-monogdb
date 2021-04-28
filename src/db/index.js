const chalk = require('chalk')
const mongoose = require('mongoose')

const url = 'mongodb://localhost:27017/artist-blog'

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log(chalk.green('monogdb-连接成功'))
})

mongoose.connection.on('error', console.error)
