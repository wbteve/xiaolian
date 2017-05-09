//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    hiddenLoading: true,
    integralQRCode: "../image/qr.404.png",
    patentQRCode: "../image/qr.404.png",
    bindflag: false,
    userInfo: {},
    balance: 0,
    score: 0,
    scoreB: 0,
    patent: 0,
    patentB: 0
  },
  //分享模块
  onShareAppMessage: function () {
    return {
      title: '小链Lite',
      path: '/pages/index/index',
      success: function(res) {
        // 分享成功
      },
      fail: function(res) {
        // 分享失败
      }
    }
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  bindBlockTap: function () {
    // var that = this;
    // if (wx.getStorageSync('mobile') == '') {
    //   that.setData({
    //     'bindflag': true
    //   })

    //   return;
    // }
    wx.navigateTo({
      url: '../peer/peer'
    })
  },
  bindBindTap: function () {
    var that = this;
    that.setData({
      'bindflag': false
    });
    wx.navigateTo({
      url: '../bind/bind'
    });
  },
  bindScanTap: function () {
    var that = this
    if (wx.getStorageSync('mobile') == '') {

      that.setData({
        'bindflag': true
      })
      setTimeout(function () {
        that.setData({
          'bindflag': false
        })
      }
        , 3000)
      return
    }
    if (wx.getStorageSync('mobile') !== '') {
      wx.scanCode({
        success: (res) => {
          var scoreArr = res.result.split("|");
          wx.setStorageSync('scoreArr', scoreArr);
          wx.navigateTo({
            url: '../score/score'
          })

        }
      })
    }

  },
  //二维码图片预览 => jzf
  bindPreviewTap: function () {
    var that = this;
    console.log(111);
    console.log(that.data.QRCodeSrc);
    if (wx.getStorageSync('mobile') !== '') {
      wx.previewImage({
        current: that.data.integralQRCode, // 当前图片的http链接
        urls: [
          that.data.integralQRCode
        ] // 需要预览的图片http链接列表
      })
    } else {
      that.setData({
        bindflag: true
      })
      setTimeout(function () {
        that.setData({
          'bindflag': false
        })
      }
        , 3000)
    }

  },
  bindPatentTap: function () {
    var onoff = true;
    if(onoff){
      onoff = false;
      wx.showToast({
        title: '该业务暂未开通,敬请期待！',
        icon: 'success',
        duration: 10000
      })
      setTimeout(function(){
        wx.hideToast();
        onoff = true;
      },2000)
    }
  },
  onCommenTap: function () {
    var that = this
    console.log(111);
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        bindflag: false
      })
    })

    //测试数据
    // wx.setStorageSync('mobile', '18611426275');
    //获取数字资产 积分
    var mobile = wx.getStorageSync('mobile');
    console.log(mobile);
    if (mobile != '') {

      //获取资产余额
      wx.request({
        url: 'https://lite.lianlianchains.com/chaincode/query/',
        data: {
          callerID: 'zhenghong',
          callerToken: '847768148',
          chaincodeID: '81993fe27bc13aeb9939265e758e8072b24402374b0d264ab21216f989ae29fc',
          args: '["query", "' + mobile + '"]',
          codeLanguage: 'GO_LANG'
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(666);
          wx.stopPullDownRefresh();
          that.setData({
            hiddenLoading: true,
            score: res.data.message,
            scoreB: res.data.message / 2,
            balance: res.data.message / 2
          })
          

        }
      })
    }

    //获取智能合约二维码
    if (mobile != '') {
      that.setData({
        integralQRCode: "https://lite.lianlianchains.com/qrcode/?mobile=" + mobile + "&chaincodeID=81993fe27bc13aeb9939265e758e8072b24402374b0d264ab21216f989ae29fc&width=102&height=102",
        patentQRCode: "https://lite.lianlianchains.com/qrcode/?mobile=" + mobile + "&chaincodeID=1685b5e77273e3db96a6ebba1e0117d39ac0f1388f448e7691680927548d134b&width=102&height=102"
      })
    }
    if(mobile == ''){
      setTimeout(function () {
       wx.stopPullDownRefresh();
      }, 3000)
    }
  },
  onPullDownRefresh: function () {
    var that = this;
    that.onCommenTap();
  },
  onLoad: function () {
    var that = this;
      that.onCommenTap();

  }

})
