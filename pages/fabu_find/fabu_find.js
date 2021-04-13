// pages/fabu_lost/fabu_lost.js
const app = getApp();
wx.cloud.init();
const db = wx.cloud.database();
const items = db.collection("items");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showPopup_wupin: false,
    showPopup_didian: false,
    columns_wupin: ["身份证件", "电子产品", "生活用品", "学习用品", "其他"],
    columns_didian: [
      "品学楼",
      "立人楼",
      "图书馆",
      "主楼",
      "体育馆/球场",
      "食堂",
      "共享单车",
      "其他",
    ],
    title_err: "",
    wupin_err: "",
    didian_err: "",
    address_err: "",
    time_err: "",
    phone_err: "",
    contact_name_err: "",
    contact_way_err: "",

    params: {
      title: "",
      category: "",
      place: "",
      category_detail: "",
      place_detail: "",
      img_url: new Array(),
      description: "",
      contact_name: "",
      comments: new Array(),
      contact_phone: "",
      contact_qq: "",
      contact_wechat: "",
      is_lost: false,
      upload_time: "",
      status: "100",
      is_verified: false, //审核状态
      user_get_return: "",
      application_user: new Array(),
      user_get_return_open_id: ""
    },
    tempFilePaths: [],
    minDate: new Date(2010, 1, 1).getTime(),
    maxDate: new Date().getTime(),
    currentDate: new Date().getTime(),
    showDatePicker: false,
    f_time: "",
  },

  doUpload(filePath) {
    const that = this;
    const arr = filePath.split("/");
    const name = arr[arr.length - 1];
    // 上传图片
    // const cloudPath = 'goods-pic/my-image' + filePath.match(/\.[^.]+?$/)[0];
    const cloudPath = "lost-and-found/" + name;

    wx.cloud
      .uploadFile({
        cloudPath,
        filePath,
      })
      .then((res) => {
        console.log("[上传文件] 成功：", res);
        const { params } = that.data;
        const { img_url } = params;
        img_url.push(res.fileID);
        params["img_url"] = img_url;
        that.setData({
          params,
        });
      })
      .catch((error) => {
        console.error("[上传文件] 失败：", error);
        wx.showToast({
          icon: "none",
          title: "上传失败",
          duration: 1000,
        });
      });
  },

  chooseImage: function () {
    const that = this;
    // 选择图片
    wx.chooseImage({
      count: 9,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: function (res) {
        console.log("upload res", res);
        const filePath = res.tempFilePaths;
        //将选择的图片上传
        filePath.forEach((path, index) => {
          that.doUpload(path);
        });
        // 新增页面图片数组
        const { tempFilePaths } = that.data;
        that.setData(
          {
            tempFilePaths: tempFilePaths.concat(filePath),
          },
          () => {
            console.log("that data temfilepath", that.data.tempFilePaths);
          }
        );
      },
      fail: (e) => {
        console.error(e);
      },
    });
  },

  deletePic(e) {
    console.log(e);
    const { index } = e.currentTarget.dataset;
    const { tempFilePaths } = this.data;
    tempFilePaths.splice(index, 1);
    this.setData({
      tempFilePaths,
    });
  },

  handleImagePreview(e) {
    // console.log("Image preview temfilepath", this.data.tempFilePaths);
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: this.data.tempFilePaths,
    });
  },

  closeDatePicker() {
    this.setData({
      showDatePicker: false,
    });
  },
  toShowDatePicker() {
    this.setData({
      showDatePicker: true,
    });
  },

  chooseDate(e) {
    const { params } = this.data;
    params["upload_time"] = this.timeConvert(new Date(e.detail));
    this.setData({
      currentDate: e.detail,
      showDatePicker: false,
      params,
    });
  },

  timeConvert(time) {
    const changeTime = (num) => {
      if (num < 10) {
        num = `0${num}`;
      }
      return num;
    };
    const y = time.getFullYear();
    let m = time.getMonth() + 1;
    let d = time.getDate();
    // let h = time.getHours();
    // let mm = time.getMinutes();
    // let s = time.getSeconds();
    m = changeTime(m);
    d = changeTime(d);
    // h = changeTime(h);
    // mm = changeTime(mm);
    // s = changeTime(s);
    return `${y}-${m}-${d}`;
  },

  onClosePopup_wupin() {
    this.setData({
      showPopup_wupin: false,
    });
  },

  onClosePopup_didian() {
    this.setData({
      showPopup_didian: false,
    });
  },

  tapToShow_wupin() {
    this.setData({
      showPopup_wupin: true,
    });
  },

  tapToShow_didian() {
    this.setData({
      showPopup_didian: true,
    });
  },

  onConfirm_wupin(event) {
    const { value } = event.detail;
    const { params } = this.data;
    params["category"] = value;
    //params['type_num'] = index;
    console.log(event.detail);
    this.setData({
      params,
      showPopup_wupin: false,
    });
  },

  onConfirm_didian(event) {
    const { value } = event.detail;
    const { params } = this.data;
    params["place"] = value;
    //params['type_num'] = index;
    console.log(event.detail);
    this.setData({
      params,
      showPopup_didian: false,
    });
  },

  saveMessage(e) {
    console.log(e);
    const { type } = e.currentTarget.dataset;
    const { params } = this.data;
    params[type] = e.detail;
    this.setData({
      params,
      phone_err: "",
      title_err: "",
      didian_err: "",
      wupin_err: "",
      contact_name_err: "",
      contact_way_err: "",
      time_err: "",
    });
  },

  checkParams(params) {
    const {
      title,
      category,
      place,
      contact_name,
      contact_phone,
      contact_qq,
      contact_wechat,
      upload_time,
    } = params;
    let temp = 1;
    //判断手机号格式是否正确
    let valid_rule = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;
    if (contact_phone === "" && contact_qq === "" && contact_wechat === "") {
      this.setData({
        phone_err: "请填写至少一项联系方式",
      });
      temp = 0;
    } else if (contact_phone && !valid_rule.test(contact_phone)) {
      this.setData({
        phone_err: "手机号格式错误",
      });
      temp = 0;
    }

    //判断标题是否为空
    if (!title) {
      this.setData({
        title_err: "请填写标题",
      });
      temp = 0;
    }

    //判断物品类型是否为空
    if (!category) {
      this.setData({
        wupin_err: "请选择物品类型",
      });
      temp = 0;
    }

    //判断地址是否为空
    if (!place) {
      this.setData({
        didian_err: "请选择捡到地点",
      });
      temp = 0;
    }

    //判断时间是否为空
    if (!upload_time) {
      this.setData({
        time_err: "请填写时间",
      });
      temp = 0;
    }

    //判断联系人称呼是否为空
    if (!contact_name) {
      this.setData({
        contact_name_err: "请填写联系人称呼",
      });
      temp = 0;
    }

    //判断联系方式是否全为空
    if (!contact_phone && !contact_qq && !contact_wechat) {
      this.setData({
        contact_way_err: "请填写至少一项联系方式",
      });
      temp = 0;
    }

    return temp;
  },

  toPublish() {
    const { params } = this.data;

    const temp = this.checkParams(params);
    if (temp) {
      let imgs = params.img_url;
      let img_urls = [];
      imgs.forEach((v, i) => img_urls.push({ id: i.toString(), url: v }));
      params.img_url = img_urls;

      wx.showToast({
        title: "完成",
        icon: "successs",
        duration: 2000,
        mask: true,
        success: () => {
          setTimeout(() => {
            wx.navigateTo({
              url: "../fabu_find_chongfu/fabu_find_chongfu",
              events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                acceptDataFromOpenedPage: function (params) {
                  console.log(params);
                },
              },
              success: function (res) {
                // 通过eventChannel向被打开页面传送数据
                console.log("category:", params.category);
                res.eventChannel.emit("acceptDataFromOpenerPage", {
                  data: params,
                });
              },
            });
          }, 1000);
        },
      });
      
    }
    else{
      wx.showToast({
        title: "您有未填信息",
        icon: "none",
        duration: 1000,
        mask: true
      })
    }
  },
});
