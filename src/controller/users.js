const jsonwebtoken = require('jsonwebtoken')
const User = require('../model/users')
const { SuccessModel, ErrorModel, TableModel } = require('../utils/responseData')
const { jwtSecret } = require('../utils/config')

class UserCtl {
  constructor() {
    this.register = this.register.bind(this) //在解构的时候，不改变this指向
    this.login = this.login.bind(this) //在解构的时候，不改变this指向
    this.follow = this.follow.bind(this) //在解构的时候，不改变this指向
    this.unfollow = this.unfollow.bind(this) //在解构的时候，不改变this指向
  }

  // 检查用户名是否存在
  async checkUser ({ _id, userName, password }) {
    let query = { userName }
    if (password)
      query.password = password
    if (_id) {
      query = {
        _id
      }
    }
    try {
      return await User.findOne(query)
    } catch {
      return null
    }
  }

  //登录
  async login (ctx) {
    const query = ctx.request.body
    const { userName, password } = query
    const userInfor = await this.checkUser({ userName, password })
    if (userInfor) { //存在用户名密码
      const { _id, userName } = userInfor
      const token = jsonwebtoken.sign({ _id, userName }, jwtSecret, { expiresIn: '1d' })
      ctx.body = new SuccessModel({ data: { token } })  //返回登录的token
    } else {
      ctx.body = new ErrorModel({ code: 502, msg: '用户名或密码错误！' })
    }
  }

  // 注册
  async register (ctx) {
    const query = ctx.request.body
    const { userName } = query
    if (await this.checkUser({ userName })) {
      ctx.body = new ErrorModel({ code: 502, msg: '该用户名已经被注册！' })
      return
    }
    const data = await new User(query).save()
    ctx.body = new SuccessModel({ data })
  }

  //关注
  async follow (ctx) {
    const { _id } = ctx.state.user
    const id = ctx.params.id
    const userInfo = await this.checkUser({ _id: id })
    if (userInfo) { //当前关注的人存在
      const followList = await User.findById(_id)
      if (!followList.follow.includes(id)) {
        followList.follow.push(id)
        const data = await followList.save()
        ctx.body = new SuccessModel({ data })
      } else {
        ctx.body = new ErrorModel({ code: 502, msg: '该用户已关注！' })
        return
      }
    } else {
      ctx.body = new ErrorModel({ code: 502, msg: '参数错误！' })
    }
  }

  // 取消关注
  async unfollow (ctx) {
    const { _id } = ctx.state.user
    const id = ctx.params.id
    const userInfo = await this.checkUser({ _id: id })
    if (userInfo) {
      const followList = await User.findById(_id)
      followList.follow = followList.follow.filter(item => item.toString() !== id)
      const data = await followList.save()
      ctx.body = new SuccessModel({ data })
    } else {
      ctx.body = new ErrorModel({ code: 502, msg: '参数错误！' })
    }
  }

  // 获取关注人列表
  async getFollowList (ctx) {
    const { _id } = ctx.state.user
    const user = await User.findById(_id)
    const count = user.follow.length
    const data = await User.findById(_id).populate({
      path: 'follow',
      limit: 2,
      skip: 0
    })
    // console.log('data', await User.findById(_id).count())
    ctx.body = new TableModel({ table: data, count })
  }

  // 获取用户列表
  async getUser (ctx) {
    const data = await User.find().limit(3).skip(0)
    console.log('data', data)
    ctx.body = new TableModel({ table: data, count: await User.count() })
  }

  // 获取粉丝列表
  async getFanList (ctx) {
    const { _id } = ctx.state.user
    const count = await User.findOne({ follow: _id })
    const data = await User.findOne({ follow: _id }).populate({
      path: 'follow'
    })
    console.log('data', data)
    ctx.body = new TableModel({ table: data.follow, count: count.follow.length })
  }
}

module.exports = new UserCtl()