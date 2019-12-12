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
    let result = new Promise((resolve,reject) => {
      const ID = event.id;//获取订单编号
      var result = {};
      const db = cloud.database();
      db.collection('orderLst').where({_id:ID,userId:OPENID}).get().then((res) =>{
        if(res.data.length){
          const SHOP=res.data[0].location;
          result = Object.assign({id:res.data[0]._id},res.data[0])
          db.collection('shopInfo').where({_id:SHOP}).get().then((res) => {
            result = Object.assign({},result,res.data[0]);
            resolve(result);
          })
        }else{
          reject({errMsg:'na'});
        }
      })
    });
    ctx.body = result;
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
        status:_.gt(0),
        location:event.shopId

      }).orderBy('date', 'asc').get().then((res) =>{
        resolve(res.data);
      })
    })
    ctx.body = result;
  })

  return app.serve();
  // //处理多种请求
  // const { OPENID, APPID } = cloud.getWXContext();
  // //判断传入参数
  // if(event.id){
  //   //获取特定id订单信息
  //   return new Promise((resolve,reject) => {
  //     const ID = event.id;//获取订单编号
  //     const db = cloud.database();
  //     var result = {};
  //     db.collection('orderLst').where({_id:ID,userId:OPENID}).get().then((res) =>{
  //       if(res.data.length){
  //         const SHOP=res.data[0].location;
  //         result = Object.assign({id:res.data[0]._id},res.data[0])
  //         db.collection('shopInfo').where({_id:SHOP}).get().then((res) => {
  //           result = Object.assign({},result,res.data[0]);
  //           resolve(result);
  //         })
  //       }else{
  //         reject({errMsg:'na'});
  //       }
  //     })
  //   })
  // }else{
  //   //获取特定用户订单信息，返回列表
  //   return new Promise((resolve,reject) => {
  //     const { OPENID, APPID } = cloud.getWXContext();
  //     const ID = OPENID;//获取特定用户的订单Id
  //     const db = cloud.database();
  //     var result = {};
  //     db.collection('orderLst').where({userId:ID}).orderBy('createTime', 'desc').get().then((res) =>{
  //       resolve(res.data);
  //     })
  //   })
  // }

}
