const base = require("../../utils/base.js")
const md5 = require('../../utils/md5.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    errInfo: "",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
          wx.switchTab({
            url: '/pages/reporting_procedure/index',
          })
      },
      fail: function () {
        
      }
    })
  },
  formSubmit: function (e) {
    let that = this;
    if(e.detail.value.username.length > 0 && e.detail.value.password.length > 0){
      wx.request({
        url: base.url + '/login',
        data: {
          username: e.detail.value.username,
          password: e.detail.value.password
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          if (res.data.status) {
            that.setData({
              errInfo: res.data.msg
            })
            wx.setStorage({
              key: 'userinfo',
              data: res.data.obj,
            })
            wx.getStorage({
              key: 'userinfo',
              success: function (res1) {
                let originalPassword = md5.hexMD5(res1.loginName + "123456" + res1.salt)
                if (res1.data.password == originalPassword) {
                  wx.navigateTo({
                    url: '/pages/editPassword/index',
                  })
                } else {
                  wx.switchTab({
                    url: '/pages/reporting_procedure/index',
                  })
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'success',
                    duration: 2000
                  })
                }
              },
              fail: function () {

              }
            })
            
          } else {
            that.setData({
              errInfo: res.data.msg
            })
          }
        }
      })
    }else{
      that.setData({
        errInfo: '账号或密码输入为空！'
      })
    }
    
  }
})