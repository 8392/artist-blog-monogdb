const router = require('koa-router')()
const { login, register, getUser, follow, unfollow, getFollowList, getFanList } = require('../controller/users')
const auth = require('../middleware/auth')
router.prefix('/users')

router.post('/login', login)
router.post('/', register)
router.get('/', getUser)
router.post('/follow/:id', auth, follow)  //关注
router.post('/unfollow/:id', auth, unfollow)  //取消关注
router.get('/follow', auth, getFollowList)  //获取关注人列表
router.get('/fan', auth, getFanList)  //获取粉丝列表

module.exports = router
