import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

import { AtButton,AtIcon,AtBadge,AtCard } from 'taro-ui'

import CloudImage from '../../components/imageFromCloud/index'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '个人中心',
    navigationBarBackgroundColor: '#2CD18A',
    navigationBarTextStyle: 'white',
    backgroundColor:'#f5f5f6',
    backgroundColorTop:'#2CD18A',
    backgroundColorBottom:'#f5f5f6'
  }

  constructor (props) {
    super(props);
    this.state = {
      orderPanel:[
        {text:'待支付',icon:'daifukuan'},
        {text:'待使用',icon:'daifahuo'},
        {text:'已取消',icon:'shanchu'},
        {text:'全部订单',icon:'suoyoudingdan'},
      ],
      discountPanel:[
        {text:'优惠券',icon:'youhuiquan',available:true},
        {text:'邀请码',icon:'yaoqing',available:false},
        {text:'积分',icon:'jifen',available:true},
        {text:'返现',icon:'fanxian',available:false},
      ],
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  naviOrderLst(index) {
    Taro.navigateTo({
      url:'/pages/order/index?index='+index,
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        //res.eventChannel.emit('sendData', {})
      }
    })
  }

  render () {
    const me = this;
    const order = this.state.orderPanel.map((i,index) => {
      return <View key={index} className='at-col iButton' onClick={me.naviOrderLst.bind(me,index)}>
        <View><AtIcon prefixClass='icon' value={i.icon} size='24' color='#666'></AtIcon></View>
        <Text>{i.text}</Text>
      </View>
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
          <View className='avatar'><OpenData type="userAvatarUrl"></OpenData></View>
          <CloudImage className='avatarBg' cloudId='cloud://vue-homeparty-4iqxy.7675-vue-homeparty-4iqxy-1300407309/resources/images/appData/memberBG.jpg'></CloudImage>
          <View className='nickname'><OpenData type="userNickName"></OpenData></View>
          <View className='card'>
            <Text>尊贵的会员，您好！</Text>
            <Text className='right'>积分:1000000</Text>
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

      </View>
    )
  }
}
