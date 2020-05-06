const url = require('../../utils/base.js').url

// pages/about_us/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    listData: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        var height = res.windowHeight - 80 / 750 * res.windowWidth;

        that.setData({
          tbodyHeight: height.toFixed(0)
        })
      }
    })
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        wx.request({
          url: url + '/missionSendDetail',
          data: {
            'taskId':options.taskId
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res1) {
            let tempArray = res1.data

            for(var i in tempArray){
              if(tempArray[i].teamGroup == '1'){
                tempArray[i].teamGroup = '下料'
              }
              if (tempArray[i].teamGroup == '2') {
                tempArray[i].teamGroup = '加工'
              }
              if (tempArray[i].teamGroup == '3') {
                tempArray[i].teamGroup = '组装'
              }
              if (tempArray[i].teamGroup == '4') {
                tempArray[i].teamGroup = '五金'
              }
              if (tempArray[i].teamGroup == '5') {
                tempArray[i].teamGroup = '打胶'
              }
              if (tempArray[i].teamGroup == '6') {
                tempArray[i].teamGroup = '百叶'
              }
              if (tempArray[i].teamGroup == '7') {
                tempArray[i].teamGroup = '验收'
              }
            }
            that.setData({
              listData: tempArray
            })
          },
          fail: function () {
            wx.redirectTo({
              url: '/pages/login/index',
            })
          }
        })
      },
      fail: function () {
        wx.redirectTo({
          url: '/pages/login/index',
        })
      }
    })

  }
})