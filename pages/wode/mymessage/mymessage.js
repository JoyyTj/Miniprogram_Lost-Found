const db = wx.cloud.database()
const _ = db.command
Page({

  data: {
    mymessage:[],  
    userinfo:{},
    commenterid:[],
    commenterinfo:[],    
  },

  onLoad: function (options) {
    this.getMymessage();    
  },
  onShow(){
    const userinfo=wx.getStorageSync("userinfo");
    this.setData({userinfo})
  }, 
  // 获取我的消息
  getMymessage(){
    const _this=this
    const my_id= wx.getStorageSync('user_openid');    
    db.collection('users').where({
      _openid:my_id
    }).get({
      success:function(res){
        console.log("返回数据",res.data)
        // console.log("评论人id",res.data[0].my_message._openid )
        _this.setData({
          mymessage:res.data[0].my_message, 
          // commenter:res.data[0].my_message._openid         
        })              
      }
    })    
  },
     
})