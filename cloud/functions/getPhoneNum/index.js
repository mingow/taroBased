const cloud = require('wx-server-sdk')

cloud.init()

//初始化数据库
const db = cloud.database();
const _ = db.command;


exports.main = async (event) => {

  const { OPENID, APPID } = cloud.getWXContext();
  try {
      return await db.collection('orderLst').where({
        _id:event.id,
        userId:OPENID
      })
      .update({
        data: {
          phone: event.phone.data.phoneNumber
        },
      })
      .then(res => {
        console.log(res.data)
      })
    } catch(e) {
    }
}
