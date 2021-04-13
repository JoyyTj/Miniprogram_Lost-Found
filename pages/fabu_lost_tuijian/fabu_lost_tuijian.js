//Page Object
const DB = wx.cloud.database();
const NUM_SWIPER = 2;
const app = getApp();
Page({
  data: {
    // 物品信息
    itemInfo: [],
    category: "",
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
        category: data.category,
        place: data.place,
      });
    });
    const _ = DB.command;
    DB.collection("items")
      .where({
        is_lost: false,
        category: _this.data.category,
        place: _this.data.place,
        // category: "身份证件",
        // place: "立人楼",
      })
      .get({
        success: function (res) {
          // console.log(res.data);
          let itemInfo = res.data;
          itemInfo.sort(function (a, b) {
            return a.upload_time < b.upload_time ? 1 : -1;
          });
          _this.setData({
            itemInfo,
          });
        },
      });
  },

  tohome() {
    wx.switchTab({
      url: "../index/index",
    });
  },
});
