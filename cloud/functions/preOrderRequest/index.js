const cloud = require('wx-server-sdk')

cloud.init()


exports.main = async (event) => {

  return new Promise((resolve,reject) => {
    const { OPENID, APPID } = cloud.getWXContext();
    var result = {
      errMsg:'',
      success:false,
      id:''
    }
    console.log(event);
    const db = cloud.database();
    const orderLst = db.collection('orderLst');
    const _ = db.command;

    //首选确认是否有未完成支付订单
    orderLst.where({
      userId:OPENID,
      status:0,
      stamp:_.gt(db.serverDate({offset:-1000*60*15}))
    }).get().then((res) => {
      if(res.data.length){
        //如果存在记录说明有未完成订单，要求先支付或取消订单
        result.errMsg='unfinished';
        resolve(result);
      }else{

        //判断查询条件，如果是全天场，当天只要有记录即不可预定
        var arr = []
        if(event.session=='all'){
          arr.push({location:event.location,date:event.date,status:1});//日期相同且订单有效
          arr.push({location:event.location,date:event.date,status:0,stamp:_.gt(db.serverDate({offset:-1000*60*15}))});//日期相同，但订单仍在付款有效时间内(15min)
        }else{
          arr.push({location:event.location,date:event.date,status:1,session:'all'});//日期相同订单有效的全天场次
          arr.push({location:event.location,date:event.date,status:1,session:event.session});//日期相同订单有效的对应场次
          arr.push({location:event.location,date:event.date,status:0,session:'all',stamp:_.gt(db.serverDate({offset:-1000*60*15}))});//日期相同订单在等待期的全天场次
          arr.push({location:event.location,date:event.date,status:0,session:event.session,stamp:_.gt(db.serverDate({offset:-1000*60*15}))});//日期相同订单在等待期的对应场次
        }
        orderLst.where(_.or(arr))
        .get().then((res) => {
          if(res.data.length){
            //所选场次已被预定，无法再次预定
            if(res.data[0].userId==OPENID&&res.data[0].session==event.session){
              result.errMsg='repeat';
            }else{
              result.errMsg='occupy';
            }
            result.id=res.data._id;
            console.log(result);
            resolve(result);
          }else{

            orderLst.add({
              // data 字段表示需新增的 JSON 数据
              data: {
                userId: OPENID, //用户id
                location:event.location,
                date:event.date,  //预约日期
                session:event.session,  //预约场次
                status:0, //订单状态
                stamp:db.serverDate(), //时间戳
                timeline:[{status:0,stamp:db.serverDate()}],
                shopInfo:event.shopInfo,
                createTime:db.serverDate(),
                price:event.price,
                pricingNote:event.pricingNote,
                pricingPolicy:event.pricingPolicy
              }
            })
            .then((res) => {
              result.id=res._id;
              result.success=true;
              console.log(result);
              resolve(result);
            })
          }
        })
      }
    })



  })
}
