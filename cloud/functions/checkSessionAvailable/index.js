const cloud = require('wx-server-sdk')

cloud.init()


exports.main = async (event) => {

  // data = {
  //   session:this.state.session,
  //   date:this.state.date,
  //   location:this.state.location,
  //   shopName:this.state.data.name
  // }
  const date = new Date(event.date);
  var condition={
    shop:event.location,
    session:event.session,
    isWeekend:true
  }

  if(date.getDay()!=6&&date.getDay()!=0){
    condition.isWeekend=false;
  }

  return new Promise((resolve,reject) => {
    var result = {
      available:true,
      price:9999,
      data:event
    }
    const db = cloud.database();
    const _ = db.command;
    //先判定是否为节假日
    db.collection('holidayEvent').where({
      date:event.date
    }).get().then((res) =>{
      if(res.data.length){
        //如果查询到记录则按照对应价格获取
        condition.isWeekend=res.data[0].isWeekend;
      }
      db.collection('pricing').where(condition).get().then((res)=>{
        if(res.data.length){
          result.price=res.data[0].val;
          resolve(result);
        }else{
          reject({errMsg:'rec not exsit!'})
        }
      })
    })
})


  const wxContext = cloud.getWXContext()



  return {
    available:true,
    price:3000,
    data:event
  }
}
