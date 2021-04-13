// pages/wode/wdfb/wdfb.js
const db = wx.cloud.database();
const _ = db.command;
Page({
  data: {
    publish: [],
  },
  onLoad: function (options) {
    this.getGoodsList();
  },
  getGoodsList() {
    const _this = this;
    const my_id = wx.getStorageSync("user_openid");
    db.collection("items")
      .where({
        _openid: my_id,
      })
      .get({
        success: function (res) {
          console.log("成功取得返回值：", res.data);
          _this.setData({
            publish: res.data,
          });
        },
      });
  },
  butt(e) {
    const _this = this;
    console.log("eeeeee", e);
    console.log(e.currentTarget.dataset.idx);
    const i = e.currentTarget.dataset.idx;
    const ID = _this.data.publish[i]._id;
    console.log("idididid", ID);
    console.log("idxidxidx", i);
    wx.showModal({
      title: "提示",
      content: "确定要删除已发布的物品吗？",
      success(res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          const publish = _this.data.publish;
          // console.log("before del", publish)
          publish.splice(i, 1);
          // console.log("after del", publish)
          db.collection("items")
            .doc(ID)
            .remove({
              success: function (res) {
                console.log("删除成功");
              },
            });
          _this.setData({
            publish,
          });
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      },
    });
  },
});
