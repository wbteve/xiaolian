// pages/score/score.js
var utils = require('../../utils/util');
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
        console.log(event.detail.formId);
        console.log("---------------------------");
        var promise = new Promise(function(resolve, reject){
          wx.request({
            url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential', //仅为示例，并非真实的接口地址
            data: {
              appid: 'wx6fabc07e4965d33e' ,
              secret: '9356f5ed37a87e5cd930f134e86adf74'
            },
            header: {
                'content-type': 'application/json'
            },
            success: function(response) {
              resolve(response);
            }
          })
        });

        promise.then(function(response){
          wx.request({
            url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token='+response.data.access_token, 
            data: {
              "touser": wx.getStorageSync('user').openid,  
              "template_id": "y6FU6brbCL-oo7yfJCi55Cxb5LIWV-LhLZ_66feKrJ8", 
              "page": "pages/index/index",          
              "form_id": event.detail.formId,         
              "data": {
                  "keyword1": {
                      "value": score + " S", 
                      "color": "black"
                  }, 
                  "keyword2": {
                      "value": utils.formatTime(new Date()), 
                      "color": "#333333"
                  }, 
                  "keyword3": {
                      "value": "积分交易", 
                      "color": "#333333"
                  },
                  "keyword4": {
                      "value": res.data.transactionID, 
                      "color": "#333333"
                  }  
               },
               "emphasis_keyword": "keyword1.DATA"
            },
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
              console.log(res.data)
              // wx.navigateTo({
              //   url: '../pay/pay'
              // })
            }
          })
        })
        
        // wx.navigateTo({
        //   url: '../pay/pay'
        // })

      }
    })    

  }      
  
})