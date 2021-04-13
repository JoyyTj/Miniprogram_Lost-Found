//Page Object
const DB = wx.cloud.database();
const NUM_SWIPER = 5;
Page({
  data: {
    // 所有物品信息
    itemInfo: [],
    // 实际要展示的物品数组
    itemInfo_show: [],
    // 轮播图数组
    swiperList: [],
    // 中间tabs数组
    tabs: [
      {
        id: 0,
        value: "所有",
        isActivate: true,
      },
      {
        id: 1,
        value: "丢失",
        isActivate: false,
      },
      {
        id: 2,
        value: "拾得",
        isActivate: false,
      },
      {
        id: 3,
        value: "地点",
        isActivate: false,
      },
      {
        id: 4,
        value: "类型",
        isActivate: false,
      },
    ],
    // 用于地点的subtabs数组
    placeTabs: [
      {
        id: 0,
        value: "品学楼",
        isActive: true,
      },
      {
        id: 1,
        value: "立人楼",
        isActive: false,
      },
      {
        id: 2,
        value: "体育场",
        isActive: false,
      },
      {
        id: 3,
        value: "图书馆",
        isActive: false,
      },
      {
        id: 4,
        value: "食堂",
        isActive: false,
      },
      {
        id: 5,
        value: "其他",
        isActive: false,
      },
    ],
    categoryTabs: [
      {
        id: 0,
        value: "身份证件",
        isActive: true,
      },
      {
        id: 1,
        value: "电子产品",
        isActive: false,
      },
      {
        id: 2,
        value: "生活用品",
        isActive: false,
      },
      {
        id: 3,
        value: "学习用品",
        isActive: false,
      },
      {
        id: 4,
        value: "其他",
        isActive: false,
      },
    ],
    showPlace: false,
    showCategory: false,
    // 判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    isHide: false,
  },
  //页面开始加载时 就会触发
  onLoad: function (options) {
    const _this = this;
    DB.collection("items").get({
      success: function (res) {
        // console.log(res.data);
        let itemInfo = res.data;
        let itemInfo_show = [];
        itemInfo.forEach((v) =>
          v.status !== "001" && v.is_verified ? itemInfo_show.push(v) : ""
        );
        itemInfo_show.sort(function (a, b) {
          return a.upload_time < b.upload_time ? 1 : -1;
        });
        let swiperList = [];
        for (var i = 0; i < itemInfo_show.length; i++) {
          if (
            itemInfo_show[i].img_url.length > 0 &&
            swiperList.length < NUM_SWIPER
          ) {
            swiperList.push(itemInfo_show[i]);
          }
        }
        _this.setData({
          itemInfo,
          itemInfo_show, // 按时间降序
          swiperList,
        });
      },
    });
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting["scope.userInfo"]) {
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          _this.setData({
            isHide: true,
          });
        }
      },
    });
    wx.stopPullDownRefresh({
      complete: (res) => {},
    });
  },
  onPullDownRefresh: function () {
    const _this = this;
    _this.onLoad();
  },
  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    const { index } = e.detail;
    let { tabs } = this.data;
    let allItems = this.data.itemInfo;
    // console.log(tabs);
    // console.log(allItems);
    tabs.forEach((v, i) =>
      i === index ? (v.isActivate = true) : (v.isActivate = false)
    );

    // 2.1 根据tab内容获得 所有/丢失/拾得 数据
    if (index === 0) {
      const _this = this;
      let itemInfo_show = [];
      allItems.forEach((v) =>
        v.status !== "001" && v.is_verified ? itemInfo_show.push(v) : ""
      );
      itemInfo_show.sort(function (a, b) {
        return a.upload_time < b.upload_time ? 1 : -1;
      });
      // console.log("iteminfo show", itemInfo_show);
      _this.setData({
        itemInfo_show,
        showPlace: false,
        showCategory: false,
      });
    } else if (index === 1) {
      const _this = this;
      let itemInfo_show = [];
      allItems.forEach((v) =>
        v.status !== "001" && v.is_verified && v.is_lost
          ? itemInfo_show.push(v)
          : ""
      );
      itemInfo_show.sort(function (a, b) {
        return a.upload_time < b.upload_time ? 1 : -1;
      });
      // console.log("iteminfo show", itemInfo_show);
      _this.setData({
        itemInfo_show,
        showPlace: false,
        showCategory: false,
      });
    } else if (index === 2) {
      const _this = this;
      let itemInfo_show = [];
      allItems.forEach((v) =>
        v.status !== "001" && v.is_verified && !v.is_lost
          ? itemInfo_show.push(v)
          : ""
      );
      itemInfo_show.sort(function (a, b) {
        return a.upload_time < b.upload_time ? 1 : -1;
      });
      // console.log("iteminfo show", itemInfo_show);
      _this.setData({
        itemInfo_show,
        showPlace: false,
        showCategory: false,
      });
    } else if (index === 3) {
      const _this = this;
      let itemInfo_show = [];
      allItems.forEach((v) =>
        v.status !== "001" && v.is_verified && v.place === "品学楼"
          ? itemInfo_show.push(v)
          : ""
      );
      itemInfo_show.sort(function (a, b) {
        return a.upload_time < b.upload_time ? 1 : -1;
      });
      // console.log("iteminfo show", itemInfo_show);
      _this.setData({
        itemInfo_show,
        showPlace: true,
        showCategory: false,
      });
    } else if (index === 4) {
      const _this = this;
      let itemInfo_show = [];
      allItems.forEach((v) =>
        v.status !== "001" && v.is_verified && v.category === "身份证件"
          ? itemInfo_show.push(v)
          : ""
      );
      itemInfo_show.sort(function (a, b) {
        return a.upload_time < b.upload_time ? 1 : -1;
      });
      // console.log("iteminfo show", itemInfo_show);
      _this.setData({
        itemInfo_show,
        showPlace: false,
        showCategory: true,
      });
    } else {
      console.log("this is else");
    }

    // 3 赋值到data中
    this.setData({
      tabs,
    });
  },

  // 地点标题点击事件 从子组件传递过来
  handlePlaceChange(e) {
    const { index } = e.detail;
    let { placeTabs } = this.data;
    let allItems = this.data.itemInfo;
    // console.log(placeTabs);
    // console.log(allItems);
    placeTabs.forEach((v, i) =>
      i === index ? (v.isActive = true) : (v.isActive = false)
    );

    if (index === 0) {
      const _this = this;
      let itemInfo_show = [];
      allItems.forEach((v) =>
        v.status !== "001" && v.is_verified && v.place === "品学楼"
          ? itemInfo_show.push(v)
          : ""
      );
      itemInfo_show.sort(function (a, b) {
        return a.upload_time < b.upload_time ? 1 : -1;
      });
      // console.log("iteminfo show", itemInfo_show);
      _this.setData({
        itemInfo_show,
      });
    } else if (index === 1) {
      const _this = this;
      let itemInfo_show = [];
      allItems.forEach((v) =>
        v.status !== "001" && v.is_verified && v.place === "立人楼"
          ? itemInfo_show.push(v)
          : ""
      );
      itemInfo_show.sort(function (a, b) {
        return a.upload_time < b.upload_time ? 1 : -1;
      });
      // console.log("iteminfo show", itemInfo_show);
      _this.setData({
        itemInfo_show,
      });
    } else if (index === 2) {
      const _this = this;
      let itemInfo_show = [];
      allItems.forEach((v) =>
        v.status !== "001" && v.is_verified && v.place === "体育馆/球场"
          ? itemInfo_show.push(v)
          : ""
      );
      itemInfo_show.sort(function (a, b) {
        return a.upload_time < b.upload_time ? 1 : -1;
      });
      // console.log("iteminfo show", itemInfo_show);
      _this.setData({
        itemInfo_show,
      });
    } else if (index === 3) {
      const _this = this;
      let itemInfo_show = [];
      allItems.forEach((v) =>
        v.status !== "001" && v.is_verified && v.place === "图书馆"
          ? itemInfo_show.push(v)
          : ""
      );
      itemInfo_show.sort(function (a, b) {
        return a.upload_time < b.upload_time ? 1 : -1;
      });
      // console.log("iteminfo show", itemInfo_show);
      _this.setData({
        itemInfo_show,
      });
    } else if (index === 4) {
      const _this = this;
      let itemInfo_show = [];
      allItems.forEach((v) =>
        v.status !== "001" && v.is_verified && v.place === "食堂"
          ? itemInfo_show.push(v)
          : ""
      );
      itemInfo_show.sort(function (a, b) {
        return a.upload_time < b.upload_time ? 1 : -1;
      });
      // console.log("iteminfo show", itemInfo_show);
      _this.setData({
        itemInfo_show,
      });
    } else if (index === 5) {
      const _this = this;
      let itemInfo_show = [];
      allItems.forEach((v) =>
        v.status !== "001" &&
        v.is_verified &&
        v.place !== "品学楼" &&
        v.place !== "立人楼" &&
        v.place !== "体育馆/球场" &&
        v.place !== "图书馆" &&
        v.place !== "食堂"
          ? itemInfo_show.push(v)
          : ""
      );
      itemInfo_show.sort(function (a, b) {
        return a.upload_time < b.upload_time ? 1 : -1;
      });
      // console.log("iteminfo show", itemInfo_show);
      _this.setData({
        itemInfo_show,
      });
    }

    const _this = this;
    _this.setData({
      placeTabs,
    });
  },

  // 类型标题点击事件 从子组件传递过来
  handleCategoryChange(e) {
    const { index } = e.detail;
    let { categoryTabs } = this.data;
    let allItems = this.data.itemInfo;
    // console.log(categoryTabs);
    // console.log(allItems);
    categoryTabs.forEach((v, i) =>
      i === index ? (v.isActive = true) : (v.isActive = false)
    );

    if (index === 0) {
      const _this = this;
      let itemInfo_show = [];
      allItems.forEach((v) =>
        v.status !== "001" && v.is_verified && v.category === "身份证件"
          ? itemInfo_show.push(v)
          : ""
      );
      itemInfo_show.sort(function (a, b) {
        return a.upload_time < b.upload_time ? 1 : -1;
      });
      // console.log("iteminfo show", itemInfo_show);
      _this.setData({
        itemInfo_show,
      });
    } else if (index === 1) {
      const _this = this;
      let itemInfo_show = [];
      allItems.forEach((v) =>
        v.status !== "001" && v.is_verified && v.category === "电子产品"
          ? itemInfo_show.push(v)
          : ""
      );
      itemInfo_show.sort(function (a, b) {
        return a.upload_time < b.upload_time ? 1 : -1;
      });
      // console.log("iteminfo show", itemInfo_show);
      _this.setData({
        itemInfo_show,
      });
    } else if (index === 2) {
      const _this = this;
      let itemInfo_show = [];
      allItems.forEach((v) =>
        v.status !== "001" && v.is_verified && v.category === "生活用品"
          ? itemInfo_show.push(v)
          : ""
      );
      itemInfo_show.sort(function (a, b) {
        return a.upload_time < b.upload_time ? 1 : -1;
      });
      // console.log("iteminfo show", itemInfo_show);
      _this.setData({
        itemInfo_show,
      });
    } else if (index === 3) {
      const _this = this;
      let itemInfo_show = [];
      allItems.forEach((v) =>
        v.status !== "001" && v.is_verified && v.category === "学习用品"
          ? itemInfo_show.push(v)
          : ""
      );
      itemInfo_show.sort(function (a, b) {
        return a.upload_time < b.upload_time ? 1 : -1;
      });
      // console.log("iteminfo show", itemInfo_show);
      _this.setData({
        itemInfo_show,
      });
    } else if (index === 4) {
      const _this = this;
      let itemInfo_show = [];
      allItems.forEach((v) =>
        v.status !== "001" &&
        v.is_verified &&
        v.category !== "身份证件" &&
        v.category !== "电子产品" &&
        v.category !== "生活用品" &&
        v.category !== "学习用品"
          ? itemInfo_show.push(v)
          : ""
      );
      itemInfo_show.sort(function (a, b) {
        return a.upload_time < b.upload_time ? 1 : -1;
      });
      // console.log("iteminfo show", itemInfo_show);
      _this.setData({
        itemInfo_show,
      });
    }

    const _this = this;
    _this.setData({
      categoryTabs,
    });
  },

  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var _this = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);

      //   添加用户信息至缓存
      const { userInfo } = e.detail;
      wx.setStorageSync("userinfo", userInfo);
      wx.login({
        success: (res) => {
          console.log("用户的code:" + res.code);
        },
      });

      _this.setData({
        isHide: false,
      });
      wx.cloud.callFunction({
        name: "getid",
        complete: (res) => {
          console.log("用户的openid：", res.result);
          wx.setStorageSync("user_openid", res.result.openid);
        },
      });
      DB.collection("users").add({
        data: {
          is_verified: false,
          my_application: [],
          my_claim: [],
          my_comment: [],
          my_message: [],
          name: userInfo.nickName,
          profile_url: userInfo.avatarUrl,
          student_card: "",
          student_id: "",
          apply_veri: false,
        },
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: "警告",
        content: "请授权之后再进入哦。",
        showCancel: false,
        confirmText: "返回授权",
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log("用户点击了“返回授权”");
          }
        },
      });
    }
  },
});
