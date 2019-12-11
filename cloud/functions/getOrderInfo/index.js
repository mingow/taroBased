const cloud = require('wx-server-sdk')

cloud.init()


exports.main = async (event) => {
  //处理多种请求
  const { OPENID, APPID } = cloud.getWXContext();
  //判断传入参数
  if(event.id){
    //获取特定id订单信息
    return new Promise((resolve,reject) => {
      const ID = event.id;//获取订单编号
      const db = cloud.database();
      var result = {};
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
    })
  }else{
    //获取特定用户订单信息，返回列表
    return new Promise((resolve,reject) => {
      const { OPENID, APPID } = cloud.getWXContext();
      const ID = OPENID;//获取特定用户的订单Id
      const db = cloud.database();
      var result = {};
      db.collection('orderLst').where({userId:ID}).orderBy('createTime', 'desc').get().then((res) =>{
        resolve(res.data);
      })
    })
  }

}
