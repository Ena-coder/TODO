const db = wx.cloud.database();
const todos = db.collection("todos")

Page({
  data: {
    //tasks:null//null没有concat方法
    tasks: [],
    result: [],
    flag:0
  },
  onLoad: function (options) {
    this.getData()
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
    this.getData()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getData(res => {
      wx.stopPullDownRefresh();
      //this.pageData.skip = 0;//避免下拉刷新以后分页数据出错
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  delTodo:function(){
    for (var i = 0; i < this.data.result.length; i++) {
      todos.doc(this.data.result[i]).remove().then(res => {
        this.setData({
          result: []
        })
        this.getData()
      }).catch(console.error)
    }
  },
  getData:function(callback){//封装，无论是下拉刷新还是页面加载都要获取数据
    if(!callback){//如果callback不存在则自动生成一个空函数
      callback = res => {}
    }
    wx.showLoading({
      title: '数据加载中',
    })
    todos.get().then(res => {
      var arr = [];
      for (var i = 0; i < res.data.length; i++) {
        console.log("ljzpl")
        if (res.data[i].state == '已完成') {
          arr.push(res.data[i]._id)
        }
      }
      this.setData({
        result: arr
      })
      //console.log(res)//拿到了一个data，里面有数组
        this.setData({
          tasks: res.data
        }, res => {
          wx.hideLoading();
          callback();
        })
    })
  },
  onChange(event) {
    //选中了一条新的数据
    if (this.data.result.length < event.detail.length){
      for(var i=0;i<event.detail.length;i++){
        var isEquals = false;
        for (var j = 0; j < this.data.result.length;j++) {
          if (event.detail[i] == this.data.result[j]){
            isEquals = true;
            break;
          }
        }
        if (!isEquals) {
          todos.doc(event.detail[i]).update({
              data: {
                state: "已完成"
              }
            }).then(console.log).catch(console.error)
          break;
        }
      }
    }
    else {//取消勾选
      for (var i = 0; i < this.data.result.length; i++) {
        var isEquals = false;
        for (var j = 0; j < event.detail.length; j++) {
          if (this.data.result[i] == event.detail[j]) {
            isEquals = true;
            break;
          }
        }
        if (!isEquals) {
          todos.doc(this.data.result[i]).update({
            data: {
              state: "进行中"
            }
          }).then(console.log).catch(console.error)
          break;
        }
      }
    }
    this.setData({
      result: event.detail
    });
  },
  noop() {}
})