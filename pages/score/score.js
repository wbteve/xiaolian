// pages/score/score.js
Page({
  data:{
    hiddenLoading:true,
    chaincodeID: '',
    tomobile: '',
    tip: '',
    tipflag: false,
    integralQRCode:"../image/qr.404.png"
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var scoreArr = wx.getStorageSync('scoreArr');
    // console.log(scoreArr[0]);
    if(scoreArr){
      that.setData({
        integralQRCode:"https://lite.lianlianchains.com/qrcode/?mobile="+scoreArr[0]+"&chaincodeID="+scoreArr[1]+"&width=202&height=202",
        tomobile:scoreArr[0],
        chaincodeID:scoreArr[1]
      })
    }

  },
  bindSubmitTap: function(event){
    var that = this

    // var score = event.detail.value.mobile
    var scoreArr = wx.getStorageSync('scoreArr');
    var mobile = wx.getStorageSync('mobile');
    var score = event.detail.value.score;
    console.log(score);
    var pw = event.detail.value.pw

    if(score == '' || pw == '') {
      that.setData({
        tipflag: true,
        tip: '请填写完整信息'
      })

      setTimeout(function(){
        that.setData({
          'tipflag': false
        })
      }
      ,3000)

      return
    }

    if(score <= 0) {
      that.setData({
        tipflag: true,
        tip: '交易积分必须大于0'
      })

      setTimeout(function(){
        that.setData({
          'tipflag': false
        })
      }
      ,3000)

      return
    }

    if(pw != wx.getStorageSync('pw')) {
      that.setData({
        tipflag: true,
        tip: '交易密码错误'
      })

      setTimeout(function(){
        that.setData({
          'tipflag': false
        })
      }
      ,3000)

      return
    }
    that.setData({
      hiddenLoading:false
    });
    wx.request({
      url: 'https://lite.lianlianchains.com/chaincode/invoke/',
      data: {
        callerID: 'zhenghong',
        callerToken: '847768148',
        chaincodeID: '81993fe27bc13aeb9939265e758e8072b24402374b0d264ab21216f989ae29fc',
        // args: '["transfer", "62251111", "62250000", '+score+']',
        args: '["transfer", "'+mobile+'", "'+scoreArr[0]+'","'+score+'"]',
        codeLanguage: 'GO_LANG'
      },
      method: 'POST',
      header: {
          'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        that.setData({
          hiddenLoading:true
        })
        wx.setStorageSync('scoreResult', score);
        console.log(res.data.result);
        if(res.data.result == "error"){
          if(res.data.exceptionMessage == "Balance not enough"){
            that.setData({
              tipflag: true,
              tip: '积分余额不足'
            })

            setTimeout(function(){
              that.setData({
                'tipflag': false
              })
            }
            ,3000)
          }
          return;
        }
        wx.navigateTo({
          url: '../pay/pay'
        })

      }
    })    

  }      
  
})