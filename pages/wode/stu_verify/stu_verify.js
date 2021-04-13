const db = wx.cloud.database();

Page({
  data: {
    // 输入框的值
    num: null,
    img: null,
    img_cloud_id:null,
    user_id: "",
    user_is_verified:null,
    default:''
  },
  onLoad: function (options) {
    const _this = this;
    let user_open_id = wx.getStorageSync("user_openid");

    db.collection("users")
      .where({
        _openid: user_open_id,
      })
      .get({
        success: function (res) {
          console.log(res.data);
          _this.setData({
            user_id: res.data[0]._id,
            user_is_verified: res.data[0].is_verified
          });
        },
      });

  },

  // 输入框的值改变 就会触发的事件
  Handleinput(e) {
    // 1 获取输入框的值
    const value = e.detail.value;
    this.setData({
      num: value,
    });
    return;
  },
  img_w_show() {
    var _this = this;
    wx.chooseImage({
      sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        _this.setData({
          img: tempFilePaths,
        });
      },
    });
  },

  upload() {
    if(this.data.num==null){
      wx.showToast({
        title: "你还未输入学号",
        icon:'none',
        duration: 2000,
      });
    }

    else if(this.data.img==null){
      wx.showToast({
        title: "你还未输入照片",
        icon:'none',
        duration: 2000,
      });
    }

    else{
      wx.cloud.uploadFile({
        cloudPath: new Date().getTime()+'.png', // 上传至云端的路径
        filePath: this.data.img[0], // 小程序临时文件路径
        success: res => {
          // 返回文件 ID
          console.log(res.fileID)
          this.setData({
            img_cloud_id: res.fileID
          })



        db.collection("users")
        .doc(this.data.user_id)
        .update({
          data: {
            apply_veri: true,
            student_id: this.data.num,
            student_card: this.data.img_cloud_id,
          },
          success: function (res) {
            console.log(res.data);
            wx.showToast({
              title: "上传成功",
              icon: "success",
              duration: 4000,
              success: () => {
                setTimeout(() => {
                  wx.switchTab({
                    url: "../../index/index",
                  });
                }, 1000);
              },
            });
          },
        });
        },
        fail: console.error
      })
    }
  },
});
