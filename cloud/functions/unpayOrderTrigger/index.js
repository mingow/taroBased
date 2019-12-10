const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();
const _ = db.command;

exports.main = async (event) => {
  const ID = event.id;
  if(event.id){
    try{
      return await db.collection('orderLst')
      .where({
        _id:ID
      })
      .update({
        data:{
          status:-1,
          timeline:_.push({status:-1,stamp:db.serverDate()})
        }
      })
    } catch(e){
      console.error(e)
    }
  }else{
    try{
      return await db.collection('orderLst')
      .where({
        status:0,
        createTime:_.lt(db.serverDate({offset:-1000*60*15}))
      })
      .update({
        data:{
          status:-1
        }
      })
    } catch(e){
      console.error(e)
    }
  }

}
