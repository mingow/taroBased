const config = {
      appid: 'wx75f54ddb4927fd4c', //小程序Appid
      envName: 'homie-7g9vm', // 小程序云开发环境ID
      mchid: '1567190391', //商户号
      partnerKey: 'dah11035o8assa8o53011haddah11035', //此处填商户密钥
      notify_url: 'https://mp.weixin.qq.com', //支付回调网址,这里可以随意填一个网址
      spbill_create_ip: '127.0.0.1'
};

const crypto = require('crypto')
const fxp = require("fast-xml-parser");
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const TcbRouter = require('tcb-router'); //云函数路由
const rq = require('request');
const tenpay = require('tenpay');//支付核心模块

function paysign({ ...args }) {
  let sa = []
  for (let k in args) sa.push( k + '=' + args[k])
  sa.push( 'key=' + config.partnerKey)
  return crypto.createHash('md5').update(sa.join('&'), 'utf8').digest('hex').toUpperCase()
}

exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  });

  app.router('pay', async(ctx,next) => {
    const wxContext = cloud.getWXContext();
    const curTime = Date.now();
    const api = tenpay.init(config);

    let trade_no = event.id;

    if(event.full){
      trade_no=trade_no+'F';
    }

    let result = await api.getPayParams({
      //商户订单号，我这里是定义的book+商品发布时间+当前时间戳
      //微信这里限制订单号一次性不能重复，只需要唯一即可
      out_trade_no:event.id,
      body: event.title,       //商品名称，我设置的书名
      total_fee: parseInt(event.price),     //金额，注意是数字，不是字符串
      openid: wxContext.OPENID //***用户的openid
    });

    ctx.body = result;
  });

  var p = {
    appid:config.appid,
    mch_id:config.mchid,
    nonce_str:Math.floor(Math.random()*10000000000),
    out_trade_no:event.out_trade_no
  }

  let formData = "<xml>"
  formData += "<appid>" + p.appid + "</appid>"
  formData += "<mch_id>" + p.mch_id + "</mch_id>"
  formData += "<nonce_str>" + p.nonce_str + "</nonce_str>"
  formData += "<out_trade_no>" + p.out_trade_no + "</out_trade_no>"
  formData += "<sign>" + paysign(p) + "</sign>"
  formData += "</xml>"

  console.log(p)

  app.router('changeState',async(ctx,next) =>{
    rq({
      timeout:5000,
      url:'https://api.mch.weixin.qq.com/pay/orderquery',
      method:'POST',
      body: formData
    },function(error, response, body){
      if (!error && response.statusCode == 200) {
        console.log(fxp.parse(body).xml);
      }else{
        console.log("error");
      }
    })
  })
  return app.serve();
}
