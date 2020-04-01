const cloud = require('wx-server-sdk')

cloud.init()


exports.main = async (event) => {

  const db = cloud.database();

  return new Promise((resolve,reject) => {
    const { OPENID, APPID } = cloud.getWXContext();
    const $ = db.command.aggregate
    db.collection('orderLst')
    .aggregate()
    .match({
      userId:OPENID
    })
    .group({
      _id: '$_status',
      count: $.sum(1),
    })
    .end()
    .then(res => resolve(res))
    .catch(err => reject(err))
  });

}
