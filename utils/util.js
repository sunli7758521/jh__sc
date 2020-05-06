//获取年月日时分秒
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

//获取年月日
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//判断权限
function permission(roleId){
  if(roleId == null){
    return false
  }else{
    let roleIdArr = [1, 109,110,111]
    let index = roleIdArr.indexOf(roleId)
    if (index < 0) {
      return false;
    } else {
      return true;
    }
  }
  
}


module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  permission: permission
}
