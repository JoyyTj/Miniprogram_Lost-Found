const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    mycomment:[],   
    userinfo:{} 
  },

  onLoad: function (options) {    
    this.getMycomment();    
  },
  // 读取缓存
  onShow(){
    const userinfo=wx.getStorageSync("userinfo");
    this.setData({userinfo})
  }, 
  // 获取我的评论
  getMycomment()
  {
    const _this=this;    
    const my_id= wx.getStorageSync('user_openid');   
    
    db.collection('users').where({
      _openid:my_id
    }).get({
      success:function(res){
        console.log("返回数据",res.data)
        console.log(res.data[0].my_comment);
        _this.setData({
          mycomment:res.data[0].my_comment
        })        
      }
    })
  },  
})