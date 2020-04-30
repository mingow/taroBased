const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router'); //云函数路由

cloud.init()

const db = cloud.database();
const _ = db.command;


exports.main = async (event,context) => {
  //添加路由功能
  const app = new TcbRouter({
    event
  });

  app.router('getOrderById', async(ctx,next) => {
    const { OPENID, APPID } = cloud.getWXContext();
    const ID = event.id;//获取订单编号


    let result = new Promise((resolve,reject) => {
      let params={
        _id:ID,
        userId:OPENID
      }
      if(event.override){
        delete params.userId
      }
      var result = {};

      const db = cloud.database();
      //获取订单信息
      db.collection('orderLst').where(params).get().then((res) =>{
        if(res.data.length){
          const SHOP=res.data[0].location;
          result = Object.assign({id:res.data[0]._id},res.data[0])
          //获取店铺信息
          db.collection('shopInfo').where({_id:SHOP}).get().then((res) => {
            result = Object.assign({},result,res.data[0]);
            //获取订单状态
            db.collection('config').where({key:'orderStatus'}).get().then((res) =>{
              var arr = res.data[0].val.filter((i)=>{
                return result._status==i.key
              });
              result = Object.assign({},result,res.data[0],{status:arr[0].val,currentUserId:OPENID});
              db.collection('config').where({key:'administrator'}).get().then((res)=>{
                //判断用户身份
                if(res.data[0].val.indexOf(OPENID)!=-1){
                  result = Object.assign({},result,{role:'admin'});
                }
                else if(result.userId==result.currentUserId){
                  result = Object.assign({},result,{role:'owner'});
                }
                else{
                  result = Object.assign({},result,{role:'user'});
                }
                //获取所有的微信支付信息
                function getPayment(id){
                  return new Promise((resolve,reject)=>{
                    cloud.callFunction({
                      name:'payment',
                      data:{
                        $url:'getPaymentOrder',
                        id:ID,
                        out_trade_no:ID
                      }
                    }).then(res=>{
                      resolve(res)
                    })
                  })
                }

                var arr = result.payment;
                const func = async function(){
                  var list = [];
                  for(var i in arr){
                    list.push(await getPayment(arr[i].value))
                  }
                  return list;
                }

                const final = func().then(res=>{
                  //获取中英翻译表
                  db.collection('config').where({key:'dict'}).get().then((_res)=>{
                    const dict = _res.data[0].val;
                    var payments = res.map((i,index)=>{
                      i.order_type=arr[index].key
                      var obj = {
                        out_trade_no:i.result.out_trade_no,
                        order_type:arr[index].key,
                        total_fee:i.result.total_fee,
                        trade_state:i.result.trade_state,
                        order_type_description:dict[i.order_type]?dict[i.order_type]:''
                      }
                      return obj;
                    })
                    var obj = Object.assign({},result,{payment:payments})
                    resolve(obj);
                  })
                });
              })
            })

          })
        }else{
          reject({errMsg:'na'});
        }
      })
    }).then((res) => {

      return res;
    });
    ctx.body = result;
    await next()

  },async(ctx)=>{

  });

  app.router('getOrderByUserId', async(ctx,next) => {
    let result = new Promise((resolve,reject) => {
      const { OPENID, APPID } = cloud.getWXContext();
      const ID = OPENID;//获取特定用户的订单Id
      var result = {};
      const db = cloud.database();
      db.collection('orderLst').where({userId:ID}).orderBy('createTime', 'desc').get().then((res) =>{
        resolve(res.data);
      })
    })
    ctx.body = result;
  })

  app.router('getUndoneOrder', async(ctx,next) => {
    let result = new Promise((resolve,reject) => {
      const { OPENID, APPID } = cloud.getWXContext();
      const ID = OPENID;//获取特定用户的订单Id
      var result = {};
      const db = cloud.database();
      db.collection('orderLst').where({_status:_.gt(0)}).orderBy('date', 'asc').get().then((res) =>{
        resolve(res.data);
      })
    })
    ctx.body = result;
  })

  app.router('getSessionStatus', async(ctx,next) => {
    var current = new Date(event.currentMonth);
    current = new Date(current.getFullYear()+'-'+(current.getMonth()+1)+'-01');
    maxDate = new Date(current.getTime()+3600*1000*24*40);
    minDate = new Date(current.getTime()-3600*1000*24*40);
    let result = new Promise((resolve,reject) => {
      var result = {};
      db.collection('orderLst').where({
        date:_.gt(minDate),
        date:_.lt(maxDate),
        _status:_.gt(0),
        location:event.shopId

      }).orderBy('date', 'asc').get().then((res) =>{
        resolve(res.data);
      })
    })
    ctx.body = result;
  })

  return app.serve();

}
