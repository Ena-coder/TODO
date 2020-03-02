const db = wx.cloud.database();
const todos = db.collection("todos");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    task:{}//一个空的结构体
  },
  pageData:{//存放获取到的页面id
  },

  viewlocation:function(){
    wx.openLocation({
      latitude:this.data.task.location.latitude,
      longitude: this.data.task.location.longitude,
      name:this.data.task.location.name,
      address:this.data.task.location.address
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {//option中有页面id
    this.pageData.id = options.id
    todos.doc(options.id).get().then(res => {
     // console.log(res)//渲染结果
      this.setData({
        task:res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})