const app = getApp()
var http = require('./httputils.js');
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const verifyToken = success => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => {
        var prams = {
          code: res.code
        }
        http.postRequest("/api/MiniLogin", prams,
          (res) => {
            app.globalData.is_authorize = res.data.is_authorize;
            app.globalData.is_tel = res.data.is_tel;
            wx.setStorage({
              data: {
                token: res.data.token,
                user_id: res.data.user_id
              },
              key: 'token',
              success:()=>{
               success(res);
              }
            })
          },
          function (err) {

          })
      }
    });
  });
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const formateSeconds = (endTime, type) => {
  let secondTime = parseInt(endTime); //将传入的秒的值转化为Number
  let min = 0; // 初始化分
  let h = 0; // 初始化小时
  let result = "";
  if (secondTime > 60) {
    //如果秒数大于60，将秒数转换成整数
    min = parseInt(secondTime / 60); //获取分钟，除以60取整数，得到整数分钟
    secondTime = parseInt(secondTime % 60); //获取秒数，秒数取佘，得到整数秒数
    if (min > 60) {
      //如果分钟大于60，将分钟转换成小时
      h = parseInt(min / 60); //获取小时，获取分钟除以60，得到整数小时
      min = parseInt(min % 60); //获取小时后取佘的分，获取分钟除以60取佘的分
    }
  }
  if (type == 0) {
    if (h == 0) {
      result = `${min.toString()}分${secondTime.toString()}秒`;
    } else {
      result = `${h.toString()}时${min.toString()}分${secondTime.toString()}秒`;
    }
  } else {
    if (h == 0) {
      result = `${min
        .toString()
        .padStart(2, "0")}:${secondTime.toString().padStart(2, "0")}`;
    } else {
      result = `${h.toString().padStart(2, "0")}:${min
        .toString()
        .padStart(2, "0")}:${secondTime.toString().padStart(2, "0")}`;
    }
  }

  return result;
}


module.exports = {
  formatTime: formatTime,
  formateSeconds: formateSeconds,
  verifyToken: verifyToken
}
