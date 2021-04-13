//Page Object
const NUM_SWIPER = 2;
const app = getApp();
wx.cloud.init();
const DB = wx.cloud.database();
const items = DB.collection("items");
Page({
  data: {
    // 物品信息
    itemInfo: [],
    params: {},
  },

  //页面开始加载时 就会触发
  onLoad: function (option) {
    const _this = this;
    console.log(option.query);
    const eventChannel = this.getOpenerEventChannel();
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on("acceptDataFromOpenerPage", function (data) {
      console.log("accepted data:", data);
      _this.setData({
        params: data.data,
      });
    });

    DB.collection("items")
      .where({
        is_lost: false,
        category: _this.data.params.category,
        place: _this.data.params.place,
      })
      .get({
        success: function (res) {
        let itemInfo = res.data;
        itemInfo.sort(function (a, b) {
          return a.upload_time < b.upload_time ? 1 : -1;
        });
          _this.setData({
            itemInfo: res.data,
          });
        },
      });
  },

  tohome() {
    wx.showToast({
      title: "取消成功",
      icon: "success",
      duration: 4000,
      success: () => {
        setTimeout(() => {
          wx.switchTab({
            url: "../index/index",
          });
        }, 1000);
      },
    });
  },

  toPublish() {
    const { params } = this.data;
    // const {tempFilePaths} = this.data;
    // params['img_url'] = tempFilePaths;
    //发布前校验
    wx.showLoading({
      title: "发布中",
    });
    items.add({
      data: params,
      success: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: "成功，待审核",
          icon: "success",
          duration: 4000,
          mask: true,
          success: () => {
            setTimeout(() => {
              wx.switchTab({
                url: "../index/index",
              });
            }, 1000);
          },
        });
      },
      fail: (err) => {
        console.log(err);
        wx.hideLoading();
        wx.showToast({
          title: "发布失败",
          icon: "none",
          duration: 4000,
          success: () => {
            setTimeout(() => {
              wx.switchTab({
                url: "../index/index",
              });
            }, 1000);
          },
        });
      },
    });
  },
});
