const url = require("../../utils/base.js").url
const project_url = require("../../utils/base.js").project_url
const md5 = require('../../utils/md5.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    errInfo:"",
    userId: '',
    loginName:'',
    oldPassword:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        that.setData({
          id:res.data.userId,
          username:res.data.userName,
          password: res.data.password
        })
      },
      fail: function () {

      }
    })
  },

  formSubmit:function(e){
    let that = this;
    wx.getStorage({
      key: 'userinfo',
      success: function (userInfo) {
        let originalPassword = md5.hexMD5(userInfo.data.loginName + e.detail.value.oldPassword + userInfo.data.salt);
        if(originalPassword!=userInfo.data.password){
          that.setData({
            errInfo: "原始密码不正确"
          })
          return;
        }
        that.setData({
          errInfo: "",
        })

        if(e.detail.value.newPassword == '' || e.detail.value.confirmPassword == ''){
          that.setData({
            errInfo: "新密码不能为空"
          })
          return;
        }

        if (e.detail.value.newPassword != e.detail.value.confirmPassword) {
          that.setData({
            errInfo: "两次新密码输入不一致"
          })
          return;
        };
        that.setData({
          errInfo: "",
        })

        wx.request({
          url: project_url + '/editPassword',
          header: {
            'content-type': 'application/json'
          },
          data: {
            'userId': userInfo.data.userId,
            'newPassword': e.detail.value.newPassword
          },
          success: function (res) {
            if (res.data.code == 301){
              that.setData({
                errInfo: res.data.msg
              })
              return;
            }
            if (res.data.code==0) {
              wx.setStorage({
                key: 'userinfo',
                data: res.data.data,
                success: function () {
                  wx.request({
                    url: url + '/login',
                    data: {
                      username: userInfo.data.loginName,
                      password: e.detail.value.newPassword
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

                      } else {
                        that.setData({
                          errInfo: res.data.msg
                        })
                      }
                    }
                  })
                  wx.switchTab({
                    url: '/pages/mine/index',
                  })
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'success',
                    duration: 2000
                  })
                }
              })
            } else {
              that.setData({
                errInfo: res.data.msg
              })
            }
          }
        });
      }
    });
  }
})