// pages/wode/wode.js
Page({
  data: {
        // 用户信息缓存
    userinfo:{}
},
onShow(){
  const userinfo=wx.getStorageSync("userinfo");
  this.setData({userinfo})
}, 
})
