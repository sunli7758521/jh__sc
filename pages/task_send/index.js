const url = require('../../utils/base.js').url
const md5 = require('../../utils/md5.js')
const util = require('../../utils/util.js')

// pages/about_us/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    listData: []
  },
  todetail: function(event) {
    var data = (event.currentTarget.dataset)
    wx.navigateTo({
      url: '/pages/task_send_detail/index?taskId=' + data.taskid
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        var height = res.windowHeight - 80 / 750 * res.windowWidth;

        that.setData({
          tbodyHeight: height.toFixed(0)
        })
      }
    })
    that.loadPage();
  },
  onShow: function() {
    let that = this;
    that.loadPage();
  },
  loadPage: function() {
    let that = this;
    wx.getStorage({
      key: 'userinfo',
      success: function(res) {
        let flag = true;
        if (res.data.roles.length == 0) {
          flag = false;
        } else {
          flag = util.permission(res.data.roles[0].roleId)
        }

        if (flag) {
          wx.request({
            url: url + '/missionSend',
            data: {},
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              that.setData({
                listData: res.data
              })
            }
          })
        } else {
          wx.switchTab({
            url: '/pages/mine/index',
          })
          wx.showToast({
            title: '无权限',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  fail: function() {
    wx.navigateTo({
      url: '/pages/login/index',
    })
  }
})