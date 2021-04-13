// pages/fabu/fabu.js
const app = getApp()
Page({

    /**
    * 页面的初始数据
    */
    data: {

    },

    toPublish(e){
       const {type} = e.currentTarget.dataset;
       if(type == 0){
           wx.navigateTo({
               url: '../fabu_lost/fabu_lost'
           })
       }else{
           wx.navigateTo({
               url: '../fabu_find/fabu_find'
           })
       }
    }
})