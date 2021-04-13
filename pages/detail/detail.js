const DB = wx.cloud.database();
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
};
Page({
  data: {
    item_obj: {},
    user_objs: [],
    appliedIds: [],
    comment_users_info: {},
    current_user: "",
    inputVal: "",
    NoImage:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAAC0CAMAAAB4+cOfAAAAKlBMVEXw8PDg4ODu7u7h4eHq6urk5OTz8/PZ2dns7Ozd3d3n5+fY2Nj29vbU1NTkhN11AAAFGklEQVR4nO2d63arOAxGfZNv0Pd/3ZFsIAnB0zLjM12jfPsHq6FpVr1rybIx1BgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPwb4iR+ux2TiS6HOThNbqKpvkzCklNjJjpf7DSKzUrMRCNepvUYNqOlz1TpLxRmZJlcpc/Qb7doDk4CIMwaldqnqQimyH/kUqe1JIapH/eLRImkiX9i55XEUhPj5n0exAyAmAEQMwBiBkDMAIgZoFxMNC5nZ/5BeaNaTDSVpLSnel+NZjFc1pd9DSHc/TzNYmo51mdKqTc/T6+YGF6Wre7OCPWKcec1uXvrTmrFtNcvXYYgpvG+jHurytEqJub3hfFwp8toFWPCu5hb6RdiGtX604UkrWLihZhxKEnFU+xLfaxWTH5PvoMV4WioSyw+PNRoFWPM22VJP/hBR48C2eddjVox73XMdYo5X9ilrV+pFWMMvU4JrjsMh9yrQE41LQvrFRPdc5MHV6LlutqZloWjXjHyR39OHpeBdI63/d2Bc5ReMZHLk7ZvoVi6WqmKAy+ihoJiMRJOoRLR9f6oeMpCF3b+k9/8DzNYDI/H4e077hsvusWM3+/sN14+U8xVZQwx11OpDxNzvWd3OBx9iphocs3n5PvtcKRfjIw8p+WEfXvnJ4tpBZ49LSfc2A6sVEw04TBQ6Iint1njh4mJMfuXOeQ2KbiaNX6SmJ5cXlrZ5sym/tyLQjF7cjm10+efDdNaxTwnl1On8Te06BOTf1alfJaYeB1FHy9G7iiYd8+SIjF1VhRpEzMXiIEYiIGYA4gZADEDIGYAxAyAmAEQM+CPiFFx3/UPLi3eFaPihnTZ0CL4KXQzE2+Y+036Vdc5YryiDvPD664/DyQVqbfTN1DN0WIVeeEETP7eevcA7yn/dmPmEo2bwmAXFgAAAHCTx5aHeyOL8nEoOinlWyMz3aleQ7uXP3glE6QzXPt+pVJSrXxI8kiHmPmLJOeEhaK4e31KovxgtEmOddHyvMQT1S+WPPlsk2zXbHce8WuispDgg4hZfBVztVHEiIm+yLEmpWLWUGKt67q2fuD6hhlmpbLuT+plMXldTUqea3+31tLe5It8NySj8HG+ssXuK/kl2VJpkShJ+52z0ZbHm0RM+CqhhrLkSLuY7LKjJbgsz+JRBk8jiVIhG7idNflwbD4r9ugG0aVAiUrlzpLjLoaWnoTaQc1SzANOIcW64Aqtpi812d7WZcu+rELEBI6lJbnVHGJKFlw//nIr5uNl+OEoolT7wM35uCXdVBbf0q/rodT2dcp+xT3H2LJ2VOYYk2uQqFkpGe4STUzLvblw+9cj+cpYtPjoLIed33JM6oNU1ddbGtxwT85xz8jZH6tNHF75GIg5lKh4F7jDONkm3dNyj7iUvm49NOT/Q/TLXrhxl9hPhiU8i1m48c64yk5i7KHkUnt3zItWMTb1/Jm5vt3PmaVwhdLEyF0FIobHrkKBM3FPviykx51TK+boMXax2ymXuGzbxCSKrfEuV+IMU7Y6hkfrXgzq7TE+bY9Tz2UTU3lYjn0W1DqGjEpbFcxzxlXE8Kle52gW88gxIoYH7S9rmpIk56Tkd8tjAsmje5H6b5s8ahaTqFO3HONrr0uCXGEk1xrv6YAHbnbit1pXrxiT8/EI/T5a7+Xa0397Cc//PMa9Pm5S2QWlJ+LFV8O3fPcKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPh7/gLfCkBS+NmGOgAAAABJRU5ErkJggg==",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { item_id } = options;
    this.getItemDetail(item_id);
    this.getUsers();
    this.setData({
      current_user: wx.getStorageSync("user_openid"),
    });
    wx.stopPullDownRefresh({
      complete: (res) => {},
    });
  },
  onPullDownRefresh: function () {
    const _this = this;
    let options = { item_id: _this.data.item_obj._id };
    _this.onLoad(options);
  },

  // 获取物品详情数据
  getItemDetail(item_id) {
    const _this = this;
    DB.collection("items")
      .doc(item_id)
      .get({
        success: function (res) {
          // console.log("item data", res.data);
          let appliedIds = [];
          let current_user_open_id = wx.getStorageSync("user_openid");
          res.data.application_user.forEach((v) =>
            appliedIds.push(v.user_openid)
          );
          console.log();
          let is_applier = appliedIds.indexOf(current_user_open_id) > -1;
          console.log(is_applier);
          _this.setData({
            item_obj: res.data,
            appliedIds,
            is_applier,
          });
        },
      });
  },
  // 获取用户数据
  getUsers() {
    const _this = this;
    DB.collection("users").get({
      success: function (res) {
        console.log("user data", res.data);
        let convert_dict = {};
        res.data.forEach(
          (user) =>
            (convert_dict[user["_openid"]] = {
              _id: user._id,
              name: user.name,
              profile_url: user.profile_url,
              is_verified: user.is_verified,
            })
        );
        console.log("convert dict", convert_dict);
        _this.setData({
          user_objs: res.data,
          comment_users_info: convert_dict,
        });
      },
    });
  },
  // 点击轮播图放大预览
  handlePreviewImage(e) {
    const _this = this;
    let image_urls = _this.data.item_obj.img_url.map((v) => v.url);
    if (image_urls.length === 0) {
      image_urls = [_this.data.NoImage];
    }
    // console.log(image_urls);
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: image_urls,
    });
  },
  handleInput(e) {
    // 1. 将输入值传给inputVal
    const _this = this;
    _this.setData({
      inputVal: e.detail.value,
    });
  },
  handleSendBtn() {
    /*
    1. 将内容更新到当前页面的item_obj
    2. 将内容更新到数据库对应item_obj
    3. 发布用户 更新 my_message数组
    4. 评论用户 更新 my_comment数组
    5. 清空评论区
    6. 提示发送成功
    */
    const _this = this;
    if (_this.data.inputVal === "" || _this.data.inputVal === "\n") {
      wx.showToast({
        title: "评论内容不能为空",
        icon: "none",
        duration: 1000,
      });
    } else {
      const item_id = _this.data.item_obj._id; // 物品的_id
      const current_user_open_id = wx.getStorageSync("user_openid"); // 点击用户的_openid
      const current_user_id =
        _this.data.comment_users_info[current_user_open_id]._id; // 点击用户的_id
      const old_comment_array = _this.data.item_obj.comments; // 原来的评论数组
      const sender_id =
        _this.data.comment_users_info[_this.data.item_obj._openid]._id; // 发布用户的_id
      const current_user_name =
        _this.data.comment_users_info[current_user_open_id].name; // 点击用户的用户名
      const current_user_icon =
        _this.data.comment_users_info[current_user_open_id].profile_url; // 点击用户的头像

      var now = new Date();
      var nowStr = now.format("yyyy-MM-dd hh:mm:ss");
      // 构造新评论
      let new_comment = {
        comment_object: "",
        content: _this.data.inputVal,
        time: nowStr,
        user_id: current_user_open_id,
      };
      // 1. 将内容更新到当前页面的item_obj
      _this.setData({
        "item_obj.comments": old_comment_array.push(new_comment),
      });
      // 2. 将内容更新到数据库对应item_obj
      DB.collection("items")
        .doc(item_id)
        .update({
          data: {
            comments: DB.command.push(new_comment),
          },
        });
      // 3. 发布用户 更新 my_message数组
      let new_my_message = {
        commenter_icon: current_user_icon,
        commenter_name: current_user_name,
        content: _this.data.inputVal,
        item_title: _this.data.item_obj.title,
        time: nowStr,
      };
      DB.collection("users")
        .doc(sender_id)
        .update({
          data: {
            my_message: DB.command.push(new_my_message),
          },
        });
      // 4. 评论用户 更新 my_comment数组
      let new_my_comment = {
        content: _this.data.inputVal,
        item_title: _this.data.item_obj.title,
        time: nowStr,
      };
      DB.collection("users")
        .doc(current_user_id)
        .update({
          data: {
            my_comment: DB.command.push(new_my_comment),
          },
        });
      // 5. 清空评论区
      _this.setData({
        inputVal: "",
      });
      // 6. 提示发送成功
      wx.showToast({
        title: "评论成功",
        icon: "success",
        duration: 1000,
        mask: true,
        success: () => {
          const _this = this;
          _this.onPullDownRefresh();
        },
      });
    }
  },
  handleApply(e) {
    /*
    1. 点击后物品状态修改为“010”
    2. 点击的用户 my_application数组增加物品id
    3. 物品属性"application_user"增加{"user_icon":, "user_id":, "user_name":, }(点击人信息)
    */
    console.log(e);

    const _this = this;
    const item_id = e.currentTarget.dataset.itemid;
    console.log("itemid", item_id);
    const current_user_open_id = wx.getStorageSync("user_openid"); //点击用户的_openid
    console.log("current_user_open_id", current_user_open_id);
    const current_user_id =
      e.currentTarget.dataset.usersinfo[current_user_open_id]._id; //点击用户的_id
    console.log("current_user_id", current_user_id);
    const current_user_info = wx.getStorageSync("userinfo"); //点击用户的信息
    const current_user_icon = current_user_info.avatarUrl; //点击用户的头像
    const current_user_name = current_user_info.nickName; //点击用户的用户名

    // 1. 修改物品状态为“010”（当前页面和数据库都要）
    _this.setData({
      "item_obj.status": "010",
    });
    DB.collection("items")
      .doc(item_id)
      .update({
        data: {
          status: "010",
          application_user: DB.command.push({
            user_icon: current_user_icon,
            user_id: current_user_id,
            user_name: current_user_name,
            user_openid: current_user_open_id,
          }),
        },
      });
    // 2. 点击的用户 my_application数组增加物品id
    DB.collection("users")
      .doc(current_user_id)
      .update({
        data: {
          my_application: DB.command.push(item_id),
        },
      });
    // 3. 物品属性"application_user"增加{"user_icon":, "user_id":, "user_name":, }(已合并到第一步)
    // 4. 提示成功
    wx.showToast({
      title: "申请成功",
      icon: "success",
      duration: 1000,
      mask: true,
      success: () => {
        const _this = this;
        _this.onPullDownRefresh();
      },
    });
  },
});
