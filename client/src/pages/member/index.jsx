import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

import { AtButton,AtIcon,AtBadge,AtCard } from 'taro-ui'

import CloudImage from '../../components/imageFromCloud/index'
import CBadge from '../../components/badge/index'
import StoreLst from '../../components/storeLst/index'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '个人中心',
    navigationBarBackgroundColor: '#ffcf00',
    navigationBarTextStyle: 'black',
    backgroundColor:'#ffcf00',
    backgroundColorTop:'#ffcf00',
    backgroundColorBottom:'#f5f5f6',
    enablePullDownRefresh: true
  }

  constructor (props) {
    super(props);
    this.state = {
      unPayBadge:0,
      unUsedBadge:0,
      tapCount:0,
      timer:null,
      orderPanel:[
        {text:'待支付',icon:'daifukuan'},
        {text:'待使用',icon:'daifahuo'},
        {text:'已取消',icon:'shanchu'},
        {text:'全部订单',icon:'suoyoudingdan'},
      ],
      discountPanel:[
        {text:'优惠券',icon:'youhuiquan',available:true},
        {text:'邀请码',icon:'yaoqing',available:false},
        {text:'积分',icon:'jifen',available:false},
        {text:'返现',icon:'fanxian',available:false},
      ],
    }
  }

  componentWillMount () { }

  onPullDownRefresh(){
    //触发刷新订单数
    const me = this;
    wx.cloud.callFunction({
      name:'getOrderLstStatus',
      success:function(res){
        Taro.stopPullDownRefresh();
        var orderPanel=[
          {text:'待支付',icon:'daifukuan'},
          {text:'待使用',icon:'daifahuo'},
          {text:'已取消',icon:'shanchu'},
          {text:'全部订单',icon:'suoyoudingdan'},
        ]
        if(res.errMsg.indexOf('ok')!=-1){
          var lst = res.result.list;
          lst.map(function(i){
            if(i._id==0){orderPanel[0].num=i.count};
            if(i._id==1){orderPanel[1].num=i.count};
          });
          me.setState({orderPanel:orderPanel});
        }
      },
      fail:function(res){
        Taro.stopPullDownRefresh();
      }
    })
  }

  componentDidMount () {
    Taro.eventCenter.off('refreshMemberOrderLst');
    Taro.eventCenter.on('refreshMemberOrderLst', Taro.startPullDownRefresh.bind(this));
  }

  componentWillUnmount () { }

  componentDidShow() {
    setTimeout(Taro.startPullDownRefresh.bind(this),1000);
  }

  componentDidHide () { }

  naviOrderLst(index) {
    Taro.navigateTo({
      url:'/pages/orderLst/index?index='+index,
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        //res.eventChannel.emit('sendData', {})
      }
    })
  }

  tapToSupervisor() {

    const me = this;
    clearTimeout(this.state.timer);
    var timer = setTimeout(function(){
      me.setState({tapCount:0})
    },1000)
    if(this.state.tapCount>15){
      this.setState({tapCount:0})
      Taro.navigateTo({
        url:'/admin/pages/supervisor/index',
      })
    }
    this.setState({
      tapCount:this.state.tapCount+1,
      timer:timer
    })
  }


  render () {
    const me = this;
    const order = this.state.orderPanel.map((i,index) => {
      return <View key={index} className='at-col'><CBadge badge={i.num} className='iButton' onClick={me.naviOrderLst.bind(me,index)} icon={i.icon} text={i.text} ></CBadge></View>;
    });

    const discount = this.state.discountPanel.map((i,index) => {
      return <View key={index} className='at-col iButton' onClick={me.naviOrderLst.bind(me,index)}>
        <View><AtIcon prefixClass='icon' value={i.icon} size='24'  color={i.available?'#666':'#d5d5d5'} ></AtIcon></View>
        <Text style={i.available?'color:#666':'color:#d5d5d5'}>{i.text}</Text>
      </View>
    })

    return (
      <View className='index'>
        <View className='avatar-info'>
          <View onClick = {this.tapToSupervisor.bind(this)} className='avatar'><OpenData type="userAvatarUrl"></OpenData></View>

          <View className='nickname'><OpenData type="userNickName"></OpenData></View>
          <View className='card'>
            <Text>尊贵的会员，您好！</Text>
          </View>
        </View>
        <View className='banner'>
          <View className='header'><Text className='title'>我的订单</Text></View>
          <View className='at-row list'>
            {order}
          </View>
        </View>
        <View className='banner'>
          <View className='header'><Text className='title'>我的优惠</Text></View>
          <View className='at-row list'>
            {discount}
          </View>
        </View>
        <View className='ads'>
          <OfficialAccount></OfficialAccount>
        </View>
        <StoreLst></StoreLst>
      </View>
    )
  }
}
