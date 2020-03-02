// pages/addTodo/addTodo.js
const db = wx.cloud.database();
const todos = db.collection("todos")
Page({
  data:{
    image:null,
    address:null,
    time:' '
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
  //不希望上传到页面中，页面中并不需要显示它
  pageData:{
    locationObj:{}
  },
//展示图片
  bindTimeChange:function(e){
    this.setData({time:e.detail.value})
  },
//选择图片
  selectImage: function (e) {
    wx.chooseImage({
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths[0])
        //把图片上传到数据库
        wx.cloud.uploadFile({
          cloudPath: `${Math.floor(Math.random()*1000)}.jpg`,//云存储路径，每次上传不一样的名字
          filePath: res.tempFilePaths[0] // 要上传文件资源的路径
        }).then(res => {
          //预览图片
          this.setData({ image:res.fileID})
        }).catch(err => {
          console.error(err)
        })
      }
    })
  },

  selectLocation: function () {
    wx.chooseLocation({
      success: res => {
        //构建一个地址对象
        let locationObj = {
          latitude: res.latitude,
          longitude: res.longitude,
          address: res.address,
          name: res.name
        }
        this.pageData.locationObj = locationObj,
        this.setData({ location: res.name })
      },
    })
  },

  onSubmit:function(e){
    let myDate = new Date;
    let month = myDate.getMonth()+1;
    let day = myDate.getDate();
    let year = myDate.getFullYear();
    let time = `${year}-${month}-${day} ${this.data.time}`;
   
    todos.add({
      data: {
        title: e.detail.value.title,
        state: e.detail.value.state,
        image: this.data.image,
        location:this.pageData.locationObj,
        time:time,
        formId: e.detail.formId
      }
    }).then(res => {//打印console信息确保数据添加成功
      wx.cloud.callFunction({
        name: 'sendMsg',
        //传数据
        data: {
          formId: e.detail.formId,
          taskId: res._id
        }
      }).then(console.log)
      wx.showToast({
        title: '数据添加成功！',
        //数据添加成功后跳转到对应的条目详情页面
        success:res2=>{
          wx.redirectTo({
            // url: `../todoInfo/todoInfo?id=${res._id}`,
            url: "../addTodo/addTodo",
          })
        }
      })
    })
  },
  onReset: function(e) {
    this.setData({
      image:null,
      address:null,
      time:null,
      location:null
    })
  }
})