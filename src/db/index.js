const chalk = require('chalk')
const mongoose = require('mongoose')

const url = 'mongodb://localhost:27017/artist-blog'

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log(chalk.green('monogdb-θΏζ₯ζε'))
})

mongoose.connection.on('error', console.error)
