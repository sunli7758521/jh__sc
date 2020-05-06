const url = require('../../utils/base.js').url
const util = require('../../utils/util.js')
const rpnJs = require('../../utils/rpn.js')
// pages/mine/editinfo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfoList: [],
    projectNameArray: [],
    projectNameIndex: 0,
    projectNameDefault: '请选择',
    projectId: '',
    taskNameArray: [],
    taskNameIndex: 0,
    taskNameDefault:'请选择',
    taskId: '',
    taskCode:'',
    winNoArray: [],
    winNoIndex: 0,
    winNoDefault: '请选择',
    winNo: '',
    winModelId: '',
    winModelName: '',
    taskWinType: '',
    taskWinTypeName: '',
    processGroupArray: [],
    teamGroup: '',
    processGroupIndex: 0,
    processGroupDefault: '请选择',
    processArray: [],
    processIndex: 0,
    tempProcessGroupIndex:[],
    totalNeedNum: '',
    leftNeedNum: '',
    reportNum: '',
    processNormId:'',
    taskDetailId: '',
    processType: '',
    reportTime: '',
    twoLaterDate: '',
    errInfo: "",
    tableView: false,
    errInfoTable: '',
    inputValue: '',
    checkboxLength: '',
    blurinputfullList: [],
    arrTemp:[]
  },

  loadPage: function() {
    let that = this;
    wx.getStorage({
      key: 'userinfo',
      success: function(res) {
        let flag = true;
        if (res.data.roles.length == 0){
          flag = false;
        }else{
          flag = util.permission(res.data.roles[0].roleId)
        }

        if (flag) {
          that.setData({
            reportTime: util.formatDate(new Date()),
            twoLaterDate: that.getAfterDate(new Date(), -1),
            userinfoList: [],
            projectNameArray: [],
            projectNameIndex: 0,
            projectNameDefault: '请选择',
            projectId: '',
            taskNameArray: [],
            taskNameIndex: 0,
            taskNameDefault: '请选择',
            taskId: '',
            taskCode: '',
            winNoArray: [],
            winNoIndex: 0,
            winNoDefault: '请选择',
            winNo: '',
            winModelId: '',
            winModelName: '',
            taskWinType: '',
            taskWinTypeName: '',
            processGroupArray: [],
            teamGroup: '',
            processGroupIndex: 0,
            processGroupDefault: '请选择',
            processArray: [],
            processIndex: 0,
            tempProcessGroupIndex: [],
            totalNeedNum: '',
            leftNeedNum: '',
            reportNum: '',
            processNormId: '',
            taskDetailId: '',
            reportTime: '',
            twoLaterDate: '',
            processType: '',
            errInfo: "",
            tableView: false,
            errInfoTable: '',
            inputValue: '',
            checkboxLength: '',
            blurinputfullList: [],
            arrTemp: []
          })
          wx.request({
            url: url + '/getProject',
            data: {},
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              that.setData({
                projectNameArray: res.data
              })
            },
            fail: function () {
              wx.redirectTo({
                url: '/pages/login/index',
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


      },
      fail: function() {
        wx.redirectTo({
          url: '/pages/login/index',
        })
      }
    })
  },
  onShow: function() {
    let that = this;
    that.loadPage();
    wx.getSystemInfo({
      success: function(res) {
        var height = res.windowHeight - 80 / 750 * res.windowWidth;

        that.setData({
          tbodyHeight: height.toFixed(0)
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.loadPage()
  },
  bindProjectNamePickerChange: function (e) {
    let that = this;
    that.setData({
      projectNameIndex: e.detail.value,
      projectNameDefault: that.data.projectNameArray[e.detail.value].projectName,
      taskNameDefault:'请选择',
      winNoDefault: '请选择',
      processGroupDefault: '请选择',
      taskCode:'',
      projectId: that.data.projectNameArray[e.detail.value].projectId,
      processTableList: [],
      tableView: false,
      errInfoTable: '',
      taskWinType: '',
      taskWinTypeName: '',
      processGroupArray: [],
      teamGroup: '',
      processGroupIndex: 0,
      processArray: [],
      processIndex: 0,
      totalNum: '',
      totalUseNum: '',
      processType: '',
      leftNum: '',
      doneNum: '',
      procedureId: '',
      taskDetailId: '',
      taskNum: '',
      date: util.formatDate(new Date()),
      milestone: '',
      milestoneClass: '',
      processLevel: '',
      errInfo: "",
      winNo: '',
      unit: '',
      winNoIndex: 0,
    })
    wx.request({
      url: url + '/getTask',
      data: {
        'projectId': that.data.projectId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          taskNameArray: res.data
        })
      }
    })
  },
  bindTaskNamePickerChange: function(e) {
    let that = this;
    that.setData({
      taskNameIndex: e.detail.value,
      taskNameDefault:that.data.taskNameArray[e.detail.value].taskName,
      winNoDefault: '请选择',
      processGroupDefault: '请选择',
      taskId: that.data.taskNameArray[e.detail.value].taskId,
      taskCode: that.data.taskNameArray[e.detail.value].taskCode,
      processTableList: [],
      tableView: false,
      errInfoTable: '',
      taskWinType: '',
      taskWinTypeName: '',
      processGroupArray: [],
      teamGroup: '',
      processGroupIndex: 0,
      processArray: [],
      processIndex: 0,
      totalNum: '',
      totalUseNum: '',
      leftNum: '',
      doneNum: '',
      procedureId: '',
      taskDetailId: '',
      processType: '',
      taskNum: '',
      date: util.formatDate(new Date()),
      milestone: '',
      milestoneClass: '',
      processLevel: '',
      errInfo: "",
      winNo: '',
      unit: '',
      winNoIndex: 0,
    })
    wx.request({
      url: url + '/getWinNo',
      data: {
        'taskId': that.data.taskId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          winNoArray: res.data
        })
      }
    })
  },
  bindWinNoPickerChange: function(e) {
    let that = this;
    that.setData({
      winNoDefault:that.data.winNoArray[e.detail.value].winNo,
      processGroupDefault:'请选择',
      winNo: that.data.winNoArray[e.detail.value].winNo,
      winNoIndex: e.detail.value,
      processTableList:[],
      tableView:false,
      errInfoTable:'',
      processGroupArray: [],
      teamGroup: '',
      processGroupIndex: 0,
      processArray: [],
      processIndex: 0,
      totalUseNum: '',
      leftNum: '',
      doneNum: '',
      procedureId: '',
      taskNum: '',
      processType: '',
      unit: '',
      date: util.formatDate(new Date()),
      milestone: '',
      milestoneClass: '',
      processLevel: '',
      errInfo: ""
    })
    wx.request({
      url: url + '/getWinModel',
      data: {
        'winNo':that.data.winNo,
        'taskId':that.data.taskId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          winModelId:res.data.winModelId,
          winModelName:res.data.winModelName,
        })
        wx.request({
          url: url + '/getTeamGroup',
          data: {
            'winModelId': that.data.winModelId
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            let tempProcessGroupArray = res.data
            let temp = []
            for(let i = 0 ; i < tempProcessGroupArray.length ; i ++){
              if(tempProcessGroupArray[i] == "1"){
                temp.push("下料")
              }
              if (tempProcessGroupArray[i] == '2') {
                temp.push("加工")
              }
              if (tempProcessGroupArray[i] == '3') {
                temp.push("组装")
              }
              if (tempProcessGroupArray[i] == '4') {
                temp.push("五金")
              }
              if (tempProcessGroupArray[i] == '5') {
                temp.push("打胶")
              }
              if (tempProcessGroupArray[i] == '6') {
                temp.push("百叶")
              }
              if (tempProcessGroupArray[i] == '7') {
                temp.push("验收")
              }
            }
            that.setData({
              tempProcessGroupIndex:res.data,
              processGroupArray: temp
            })
          }
        })
      }
    })
    
  },
  bindProcessGroupPickerChange: function(e) {
    let that = this;
    that.setData({
        teamGroup: that.data.tempProcessGroupIndex[e.detail.value],
        processGroupDefault:that.data.processGroupArray[e.detail.value],
        processGroupIndex: e.detail.value,
        processArray: [],
        processIndex: 0,
        totalUseNum: '',
        leftNum: '',
        doneNum: '',
        procedureId: '',
        taskNum: '',
        tableView: false,
        errInfoTable: '报工数量输入后上报当前工序',
        date: util.formatDate(new Date()),
        milestone: '',
        milestoneClass: '',
        processLevel: '',
        unit: '',
        errInfo: ""
      }),
      wx.request({
      url: url + '/getProcess',
        data: {
          'projectId': that.data.projectId,
          'winModelId': that.data.winModelId,
          'winNo': that.data.winNo,
          'teamGroup': that.data.teamGroup,
          'taskId': that.data.taskId
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          that.setData({
            processArray: res.data,
            tableView:true
          })
        }
      })
  },
  doneInput: function(e) {
    let that = this
    
    if (that.data.projectId == "") {
      that.setData({
        errInfoTable: "请选择项目"
      })
      return;
    }

    if (that.data.taskId == "") {
      that.setData({
        errInfoTable: '请选择作业单'
      })
      return;
    }

    if (that.data.winNo == "") {
      that.setData({
        errInfoTable: '请选择窗号'
      })
      return;
    }

    if (that.data.teamGroup == "") {
      that.setData({
        errInfoTable: '请选择工序组'
      })
      return;
    }

    // if (that.data.reportTime == "") {
    //   that.setData({
    //     errInfo: '请选择上报日期'
    //   })
    //   return;
    // }

    if (parseInt(e.detail.value) > parseInt(e.currentTarget.dataset.leftneednum)) {
      that.setData({
        errInfoTable: '报工数量必须小于剩余需求量',
        inputValue: '',
      })
      return;
    } else if (!/^[1-9]\d*$/.test(e.detail.value)) {
      that.setData({
        errInfoTable: '报工数量只能是正整数且不为空',
        inputValue: '',
      })
      return;
    } 
    wx.getStorage({
      key: 'userinfo',
      success: function (reso) {
        wx.showModal({
          content: '是否上报当前工序',
          success(res) {
            if (res.confirm) {
              wx.request({
                url: url + '/reportSave',
                data: {
                  'taskId': that.data.taskId,
                  'taskDetailId': e.currentTarget.dataset.taskdetailid,
                  'projectId': that.data.projectId,
                  'winModelId': that.data.winModelId,
                  'processNormId': e.currentTarget.dataset.processnormid,
                  'winNo': that.data.winNo,
                  'teamGroup': that.data.teamGroup,
                  'reportNum': e.detail.value,
                  'createBy': reso.data.loginName,
                  'processType': e.currentTarget.dataset.processtype, 
                  'isMilestone': e.currentTarget.dataset.ismilestone,
                  'milestoneClassify': e.currentTarget.dataset.milestoneclassify,
                  'price': e.currentTarget.dataset.price,
                  // 'reportTime': that.data.reportTime,
                  'dealStatus': '2',
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success(res3) {
                  if (res3.data.status) {
                    wx.showToast({
                      title: '上报成功',
                      icon: 'success',
                      duration: 2000
                    })
                    that.setData({
                      inputValue:'',
                      // tableView:false
                    })
                    wx.request({
                      url: url + '/getProcess',
                      data: {
                        'projectId': that.data.projectId,
                        'winModelId': that.data.winModelId,
                        'winNo': that.data.winNo,
                        'teamGroup': that.data.teamGroup,
                        'taskId': that.data.taskId
                      },
                      header: {
                        'content-type': 'application/json' // 默认值
                      },
                      success(res) {
                        that.setData({
                          processArray: res.data,
                          tableView: true,
                          errInfoTable: e.currentTarget.dataset.processnormname + '上报' + e.detail.value +e.currentTarget.dataset.unit+",成功"
                        })
                      }
                    })
                  }
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
    })

  },
  bindDateChange: function(e) {
    this.setData({
      reportTime: e.detail.value
    })
  },
  //字符串转成时间
  getDate: function(strDate) {
    var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
      function(a) {
        return parseInt(a, 10) - 1;
      }).match(/\d+/g) + ')');
    return date;
  },
  //获取几天后的时间
  getAfterDate: function(d, n) {
    var year = d.getFullYear();
    var mon = d.getMonth() + 1;
    var day = d.getDate();
    if (day <= parseInt(n)) {
      if (mon > 1) {
        mon = mon - 1;
      } else {
        year = year - 1;
        mon = 12;
      }
    }
    d.setDate(d.getDate() + n);
    year = d.getFullYear();
    mon = d.getMonth() + 1;
    day = d.getDate();
    let s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
    return s;
  }
})