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
    orderLst.where({
      session:event.session,
      date:event.date
    }).get().then((res) => {
      if(res.data.length){
        //所选场次已被预定，无法再次预定
        if(res.data[0].userId==OPENID){
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
            userId: OPENID,
            date:event.date,
            session:event.session,
            status:0
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
  })
}
