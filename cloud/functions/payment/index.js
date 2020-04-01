
//引用
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router'); //云函数路由
const tenpay = require('tenpay');//支付核心模块
//初始化config
const config = {
  appid: 'wx75f54ddb4927fd4c', //小程序Appid
  envName: 'homie-7g9vm', // 小程序云开发环境ID
  mchid: '1567190391', //商户号
  partnerKey: 'aaa97c81ad8732c1b06c95ef8ae928f5', //此处填商户密钥
  notify_url: 'https://mp.weixin.qq.com', //支付回调网址,这里可以随意填一个网址
  spbill_create_ip: '127.0.0.1'
};
//初始化cloud
cloud.init()

//初始化数据库
const db = cloud.database();
const _ = db.command;

//初始化微信支付
const api = tenpay.init(config);//初始化api
const wxContext = cloud.getWXContext();

function checkOrder(json){
  console.log(json);
  if(json.return_code=='SUCCESS'&&json.result_code=="SUCCESS"&&json.trade_state=="SUCCESS"){
    return true;
  }
  return false
}

exports.main = async (event, context) => {

  const app = new TcbRouter({
    event
  });

  app.router('pay', async(ctx,next) => {
    const wxContext = cloud.getWXContext();
    const curTime = Date.now();
    const sandboxAPI = await tenpay.sandbox(config);
    let trade_no = event.id;

    if(event.full){
      trade_no=trade_no+'F';
    }

    //再次确认订单状态是否可支付
    var rec = await db.collection('orderLst')
    .where({
      _id:event.id,
      _status:0
    })
    .get();

    if(rec.data.length){
      let result = await api.getPayParams({
        //商户订单号，我这里是定义的book+商品发布时间+当前时间戳
        //微信这里限制订单号一次性不能重复，只需要唯一即可
        out_trade_no:event.out_trade_no,
        body: event.title,       //商品名称，我设置的书名
        total_fee: parseInt(1),     //金额，注意是数字，不是字符串
        openid: wxContext.OPENID //***用户的openid
      });

      ctx.body = result;
    }else{
      ctx.body = 'orderExpired'
    }
  });



  app.router('getPaymentOrder',async(ctx,next) => {
    let result = await api.orderQuery({
      out_trade_no:event.out_trade_no
    })
    ctx.body = result;
    console.log(result)
  })

  app.router('reverse',async(ctx,next) => {
    let result = await api.reverse({
      out_trade_no:event.out_trade_no
    })
    ctx.body = result;
  })

  app.router('changeState',async(ctx,next) =>{
    let result = await api.orderQuery({
      out_trade_no:event.out_trade_no
    })
    if(checkOrder(result)){
      try{

        let db_result = await db.collection('orderLst')
        .where({
          _id:event.id,
          userId:wxContext.OPENID //增加对openid检查功能
        })
        .update({
          data:{
            _status:1,
            timeline:_.push({status:1,stamp:db.serverDate()}),
            //将支付订单改为数组格式可多次添加
            payment:_.push({
              key:'deposit_trade_no',
              value:event.out_trade_no
            })
          }
        })
        ctx.body = db_result;
      } catch(e){
        console.error(e)
      }
    }else{
      ctx.body='userErr';
    }

  })
  return app.serve();
}
