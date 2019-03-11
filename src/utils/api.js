import wepy from 'wepy'

// 服务器接口地址
const host = 'http://larabbs.test/api'

// 普通请求
const request = async (options, showLoading = true) => {
  console.log(options)
  if (typeof options === 'string') {
    options = {
      url: options
    }
  }
    // 显示记载中
  if (showLoading) {
    wepy.showLoading({ title: '记载中' })
  }
    // 拼接请求地址
  options.url = host + '/' + options.url
    // 调用小程序的 request 方法
  let response = await wepy.request(options)

  if (showLoading) {
        // 隐藏加载中
    wepy.hideLoading()
  }

  if (response.statusCode === 500) {
    wepy.showMoal({
      title: '提示',
      content: '服务器错误，请联系管理员或充实'
    })
  }
  return response
}

// 登录
const login = async(params = {}) => {
    // 获取code
  let loginData = await wepy.login()
  console.log(loginData)

  params.code = loginData.code

    // 接口请求 weapp/authorizations
  let authResponse = await request({
    url: 'weapp/authorizations',
    data: params,
    method: 'POST'
  })

    // 登录成功，记录 token 信息
  if (authResponse.statusCode === 201) {
    wepy.setStorageSync('access_token', authResponse.data.access_token)
    wepy.setStorageSync('access_token_expired_at', new Date().getTime() + authResponse.data.expires_in * 1000)
  }
  return authResponse
}

export default{
  request,
  login
}
