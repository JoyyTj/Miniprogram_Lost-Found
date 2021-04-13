const db = wx.cloud.database();
// const changeList = "";
const _ = db.command;

Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "我收到的申请",
        isActive: true,
      },
      {
        id: 1,
        value: "我发出的申请",
        isActive: false,
      },
    ],
    changeList: [],
    goodsList: [],
    applicationList: [],
    tempList: [],
    temp_user: [],
    user_id: "",
    user_openid: "",
    NoImage:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAAC0CAMAAAB4+cOfAAAAKlBMVEXw8PDg4ODu7u7h4eHq6urk5OTz8/PZ2dns7Ozd3d3n5+fY2Nj29vbU1NTkhN11AAAFGklEQVR4nO2d63arOAxGfZNv0Pd/3ZFsIAnB0zLjM12jfPsHq6FpVr1rybIx1BgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPwb4iR+ux2TiS6HOThNbqKpvkzCklNjJjpf7DSKzUrMRCNepvUYNqOlz1TpLxRmZJlcpc/Qb7doDk4CIMwaldqnqQimyH/kUqe1JIapH/eLRImkiX9i55XEUhPj5n0exAyAmAEQMwBiBkDMAIgZoFxMNC5nZ/5BeaNaTDSVpLSnel+NZjFc1pd9DSHc/TzNYmo51mdKqTc/T6+YGF6Wre7OCPWKcec1uXvrTmrFtNcvXYYgpvG+jHurytEqJub3hfFwp8toFWPCu5hb6RdiGtX604UkrWLihZhxKEnFU+xLfaxWTH5PvoMV4WioSyw+PNRoFWPM22VJP/hBR48C2eddjVox73XMdYo5X9ilrV+pFWMMvU4JrjsMh9yrQE41LQvrFRPdc5MHV6LlutqZloWjXjHyR39OHpeBdI63/d2Bc5ReMZHLk7ZvoVi6WqmKAy+ihoJiMRJOoRLR9f6oeMpCF3b+k9/8DzNYDI/H4e077hsvusWM3+/sN14+U8xVZQwx11OpDxNzvWd3OBx9iphocs3n5PvtcKRfjIw8p+WEfXvnJ4tpBZ49LSfc2A6sVEw04TBQ6Iint1njh4mJMfuXOeQ2KbiaNX6SmJ5cXlrZ5sym/tyLQjF7cjm10+efDdNaxTwnl1On8Te06BOTf1alfJaYeB1FHy9G7iiYd8+SIjF1VhRpEzMXiIEYiIGYA4gZADEDIGYAxAyAmAEQM+CPiFFx3/UPLi3eFaPihnTZ0CL4KXQzE2+Y+036Vdc5YryiDvPD664/DyQVqbfTN1DN0WIVeeEETP7eevcA7yn/dmPmEo2bwmAXFgAAAHCTx5aHeyOL8nEoOinlWyMz3aleQ7uXP3glE6QzXPt+pVJSrXxI8kiHmPmLJOeEhaK4e31KovxgtEmOddHyvMQT1S+WPPlsk2zXbHce8WuispDgg4hZfBVztVHEiIm+yLEmpWLWUGKt67q2fuD6hhlmpbLuT+plMXldTUqea3+31tLe5It8NySj8HG+ssXuK/kl2VJpkShJ+52z0ZbHm0RM+CqhhrLkSLuY7LKjJbgsz+JRBk8jiVIhG7idNflwbD4r9ugG0aVAiUrlzpLjLoaWnoTaQc1SzANOIcW64Aqtpi812d7WZcu+rELEBI6lJbnVHGJKFlw//nIr5uNl+OEoolT7wM35uCXdVBbf0q/rodT2dcp+xT3H2LJ2VOYYk2uQqFkpGe4STUzLvblw+9cj+cpYtPjoLIed33JM6oNU1ddbGtxwT85xz8jZH6tNHF75GIg5lKh4F7jDONkm3dNyj7iUvm49NOT/Q/TLXrhxl9hPhiU8i1m48c64yk5i7KHkUnt3zItWMTb1/Jm5vt3PmaVwhdLEyF0FIobHrkKBM3FPviykx51TK+boMXax2ymXuGzbxCSKrfEuV+IMU7Y6hkfrXgzq7TE+bY9Tz2UTU3lYjn0W1DqGjEpbFcxzxlXE8Kle52gW88gxIoYH7S9rmpIk56Tkd8tjAsmje5H6b5s8ahaTqFO3HONrr0uCXGEk1xrv6YAHbnbit1pXrxiT8/EI/T5a7+Xa0397Cc//PMa9Pm5S2QWlJ+LFV8O3fPcKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPh7/gLfCkBS+NmGOgAAAABJRU5ErkJggg==",
  },

  onLoad: function (options) {
    const _this = this;
    let user_open_id = wx.getStorageSync("user_openid");

    wx.getStorage({
      key: "user_openid",
      success(res) {
        console.log(res);
        db.collection("items")
          .where({
            _openid: res.data,
            status: "010",
            // 之后增加匹配值status
          })
          .get({
            success: function (res) {
              _this.setData({
                goodsList: res.data,
              });
            },
          });
      },
    });

    db.collection("users")
      .where({
        _openid: user_open_id,
      })
      .get({
        success: function (res) {
          _this.setData({
            user_id: res.data[0]._id,
          });
          console.log(res);
          db.collection("items")
            .where({
              _id: _.in(res.data[0].my_application),
            })
            .get({
              success: function (res) {
                console.log(res.data);
                _this.setData({
                  applicationList: res.data,
                });
              },
            });
        },
      });
  },

  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    // 2 修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) =>
      i === index ? (v.isActive = true) : (v.isActive = false)
    );
    // 3 赋值到data中
    this.setData({
      tabs,
    });
  },

  confirm(event) {
    // 需要弹出对话框，供用户确认 √
    // 需要添加修改数据库功能，需要修改status，以及user_get_return √
    // 进行页面的跳转跳转回主页 √
    // 确认后我收到的消失
    const _this = this;
    wx.showModal({
      title: "提示",
      content: "请确认是否归还",
      success(res) {
        if (res.confirm) {
          console.log(event.currentTarget.dataset.name);
          const temp_name = event.currentTarget.dataset.name;
          const temp_id = event.currentTarget.data.openid;
          db.collection("items")
            .doc(_this.__data__.changeList)
            .update({
              data: {
                status: "001",
                user_get_return: temp_name,
                user_get_return_openid: temp_id,
              },
              success: function (res) {
                console.log(res.data);
              },
            });

          let goodsList = _this.data.goodsList;
          let obj_id = _this.data.changeList;
          goodsList.forEach((v, i) =>
            v._id === obj_id ? goodsList.splice(i, 1) : ""
          );
          _this.setData({
            goodsList,
          });
          wx.showToast({
            title: "已确认",
            icon: "success",
            duration: 1000,
            mask: true,
          });
          // 这里增加跳转回主页功能
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      },
    });
  },

  test(res) {
    console.log(res);
    this.setData({
      changeList: res.currentTarget.dataset.id,
    });
  },

  delete(res) {
    const _this = this;
    const index = res.currentTarget.dataset.info;
    const item_id = res.currentTarget.dataset.itemid;
    console.log(res.currentTarget.dataset.info);

    // 获得用户数据
    db.collection("users")
      .doc(_this.__data__.user_id)
      .get({
        success: function (res) {
          console.log(res);
          if (res.data.my_application.length > 1) {
            _this.setData({
              tempList: res.data.my_application.splice(index, 1),
            });
          } else {
            _this.setData({
              tempList: [],
            });
          }
        },
      });

    db.collection("items")
      .doc(item_id)
      .get({
        success: function (res) {
          console.log(res);
          let temp_users = res.data.application_user;
          let del_user_index = -1;
          temp_users.forEach((v, i) =>
            v.user_id === _this.data.user_id ? (del_user_index = i) : ""
          );
          temp_user.splice(del_user_index, 1);
          _this.setData({
            temp_user,
          });
        },
      });

    wx.showModal({
      title: "提示",
      content: "请确认是否撤销",
      success(res) {
        if (res.confirm) {
          db.collection("users")
            .doc(_this.__data__.user_id)
            .update({
              data: {
                my_application: _this.__data__.tempList,
              },
              success: function (res) {
                console.log(res.data);
              },
            });

          db.collection('items')
            .doc(item_id)
            .update({
              data:{
                application_user: _this.data.temp_user
              }
            })

          if (_this.data.tempList.length === 0) {
            db.collection("items")
              .doc(item_id)
              .update({
                data: {
                  status: "100",
                },
              });
          }

          // 重新获得列表数据
          let user_open_id = wx.getStorageSync("user_openid");
          db.collection("users")
            .where({
              _openid: user_open_id,
            })
            .get({
              success: function (res) {
                _this.setData({
                  user_id: res.data[0]._id,
                });
                console.log(res);
                db.collection("items")
                  .where({
                    _id: _.in(res.data[0].my_application),
                  })
                  .get({
                    success: function (res) {
                      console.log(res.data);
                      _this.setData({
                        applicationList: res.data,
                      });
                    },
                  });
              },
            });

          wx.showToast({
            title: "撤销成功",
            icon: "success",
            duration: 4000,
            success: () => {
              setTimeout(() => {
                // wx.switchTab({
                //   url: "../../index/index",
                // });
              }, 1000);
            },
          });
          // 这里增加跳转回主页功能
        } else if (res.cancel) {
        }
      },
    });
  },
});
