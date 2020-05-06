const util = require('../../utils/util.js')
const url = require('../../utils/base.js').url
const md5 = require('../../utils/md5.js')

// pages/about_us/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    totalSalary: 0,
    listData: [],
    startTime:'',
    endTime:'',
    hasUserInfo: false, 
    hasMoreData: true,
    //分页
    pageNum:1,
    pageSize:30,
    //小程序滚动
    scrollTop: 0,
    // 0 代表所有  1代表时间检索条件
    type: 0
  },
onLoad:function(){
  var that = this;
  that.loadPage("数据加载中")
},
bindBeginDateChange(e) {
    let that = this;
    that.setData({
      startTime: e.detail.value
    })
  },
  bindEndDateChange(e) {
    let that = this;
    that.setData({
      endTime: e.detail.value
    })
  },
  // getSalaryList: function (loginName,userId,startTime,endTime){
  //   let that = this;
  //   wx.request({
  //     url: url + '/totalSalary',
  //     data: {
  //       'createBy': loginName,
  //       'userId': userId,
  //       'startTime': startTime,
  //       'endTime': endTime
  //     },
  //     header: {
  //       'content-type': 'application/json' // 默认值
  //     },
  //     success(res) {
  //       that.setData({
  //         totalSalary: res.data
  //       })
  //     }
  //   })
  //   console.log("startTime==========",startTime)
  //   console.log("endTime============",endTime)
  //   wx.request({
  //     url: url + '/salaryList',
  //     data: {
  //       'createBy': loginName,
  //       'startTime': startTime,
  //       'endTime': endTime,
  //       'userId': userId,
  //       'pageNum':that.data.pageNum,
  //       'pageSize':that.data.pageSize
  //     },
  //     header: {
  //       'content-type': 'application/json' // 默认值
  //     },
  //     success(res) {   
  //       // 重新赋值到listData           
  //       that.setData({
  //         listData: res.data.list,             
  //       })
  //       // that.setData({
  //       //   listData: res.data.list
  //       // })
       
  //     }
  //   })
  // },
  formSubmit: function (e) {
    let that = this;
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        // that.getSalaryList(res.data.loginName,res.data.userId, e.detail.value.startTime, e.detail.value.endTime)
        that.setData({
          type: 1
        })
        that.loadPage("请求接口");
      },
    })
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
    var TIME = util.formatDate(new Date());
    this.setData({
      startTime: TIME,
      endTime:TIME
    });
    that.loadPage("message")
  },
  onShow:function(){
    let that = this;
    that.loadPage("message");
  },
  loadPage:function(message,type){ 
    let that = this; 
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        let flag = true;
        if (res.data.roles.length == 0) {
          flag = false;
        } else {
          flag = util.permission(res.data.roles[0].roleId)
        }  
        if (flag) {     
          if(that.data.type==1){
            that.data.type=1
          }else{
            that.data.type=0
          }  
          wx.request({
            url: url + '/totalSalary',
            data: {
              'userId':res.data.userId,
              'createBy': res.data.loginName,
              'startTime':that.data.startTime,
              'endTime': that.data.endTime,
               'type':that.data.type
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              that.setData({
                totalSalary: res.data
              })
            },
            fail: function () {
              wx.redirectTo({
                url: '/pages/login/index',
              })
            }
          })   
          wx.request({
            url: url + '/salaryList',
            data: {
              'createBy': res.data.loginName,
              'userId': res.data.userId,
              'startTime':that.data.startTime,
              'endTime': that.data.endTime, 
              'pageNum':that.data.pageNum,
              'pageSize':that.data.pageSize,
              'type':that.data.type         
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
               var contentlistTem = res.data.list; 
              if(res.statusCode==200){
               if(res.data.list.pageNum==1){
                contentlistTem =[]
               }
               var contentlist = res.data.list;
               if (that.data.pageNum >= res.data.pages){
                that.setData({
                  listData: contentlistTem.concat(contentlist),
                  hasMoreData: false
                })
              }else{      
                that.setData({
                  listData: contentlistTem.concat(contentlist),
                  hasMoreData: true,
                  pageNum: that.data.pageNum + 1
                })
              }             
              }
              // // 重新赋值到listData           
              // that.setData({
              //   listData: res.data.list,             
              // })  
            },
            fail: function () {
              wx.redirectTo({
                url: '/pages/login/index',
              })
            },
            complete:function(){
              wx.hideLoading();
              // complete
              wx.hideNavigationBarLoading() //完成停止加载
              wx.stopPullDownRefresh() //停止下拉刷新
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
      },
      fail: function () {
        wx.navigateTo({
          url: '/pages/login/index',
        })
      }
    }) 
  },
   /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
onPullDownRefresh: function () {
  let that = this;
  // console.log('下拉');
  wx.showNavigationBarLoading() //在标题栏中显示加载
  that.data.pageNum = 1
  // this.getContentInfo('正在刷新数据')
  that.loadPage('正在刷新数据')
},
/**
 * 页面上拉触底事件的处理函数
 */
onReachBottom: function () {
  if (this.data.hasMoreData) {
    // this.getContentInfo('加载更多数据')
    this.loadPage('加载更多数据')
  } else {
    wx.showToast({
      title: '没有更多数据',
    })
  }
},
//  监听屏幕滚动 判断上下滚动 
onPageScroll: function(ev) {
  var that = this;
  // console.log("that.data.type=============",that.data.type);
      if(that.data.type==0){
        that.setData({
          type:0
        })
      }else{
        that.setData({
          type:1
        })    
      }
    //当滚动的top值最大或者最小时，为什么要做这一步是由于在手机实测小程序的时候会发生滚动条回弹，所以为了解决回弹，设置默认最大最小值   
    if (ev.scrollTop <= 0) {
      ev.scrollTop = 0;
    } else if (ev.scrollTop > wx.getSystemInfoSync().windowHeight) {
      ev.scrollTop = wx.getSystemInfoSync().windowHeight;
    }
    //判断浏览器滚动条上下滚动      
    if (ev.scrollTop > this.data.scrollTop || ev.scrollTop == wx.getSystemInfoSync().windowHeight) { 
      // console.log('向下滚动');      
      //  } else {  
        // console.log('向上滚动');  
       }
      //给scrollTop重新赋值    
      setTimeout(function () {
        that.setData({
          scrollTop: ev.scrollTop
        })
      }, 0)
},

})