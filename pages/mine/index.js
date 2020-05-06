// pages/product/index.js
const img = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1555758474537&di=42b173b087280fb382d9ca41ea5ac7e8&imgtype=0&src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F02%2F84%2F66%2F5a5ddb9bb94f4_610.jpg'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wximg:'',
    userName:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.loadPage()
  },
  loadPage:function(){
    let that = this;
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        that.setData({
          userName: res.data.userName,
          wximg: img
        })
      },
      fail: function () {
        wx.redirectTo({
          url: '/pages/login/index',
        })
      }
    })
  },
  onShow:function(){
    let that = this;
    that.loadPage()
  },
  logout:function(){
    wx.showModal({
      content: '确认要退出吗?',
      success(res) {
        if (res.confirm) {
          wx.clearStorage();
          wx.redirectTo({
            url: '/pages/login/index',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  toTaskSend:function(){
    wx.navigateTo({
      url: '/pages/task_send/index',
    })
  },
  toSalaryPage:function(){
    wx.navigateTo({
      url: '/pages/toSalaryPage/index',
    })
  },

  // 修改密码
  editPassword:function(){
    wx.navigateTo({
      url: '/pages/editPassword/index',
    })
  }
})