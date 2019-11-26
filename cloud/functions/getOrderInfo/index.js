const cloud = require('wx-server-sdk')

cloud.init()


exports.main = async (event) => {
  return new Promise((resolve,reject) => {

    const ID = event.id;//获取订单编号
    const db = cloud.database();
    var result = {};

    db.collection('orderLst').where({_id:ID}).get().then((res) =>{
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
}
