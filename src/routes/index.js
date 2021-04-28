const fs = require('fs')
const { promisify } = require('util')

/*
  promisify转成promise函数
*/
module.exports = async (app) => {
  const filePath = await promisify(fs.readdir)(__dirname)
  for (let route of filePath) {
    if (route !== 'index.js') {
      const file = require(`./${route}`)
      app.use(file.routes(), file.allowedMethods()) //加载路由
    }
  }
}
