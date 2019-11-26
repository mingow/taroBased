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

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
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
          <Text className='title'>我的订单</Text>
          <View className='at-row list'>
            <View className='at-col iButton'>
              <View><AtIcon prefixClass='icon' value='daifukuan' size='24' color='#666'></AtIcon></View>
              <Text>待付款</Text>
            </View>
            <View className='at-col iButton'>
              <View><AtIcon prefixClass='icon' value='daifahuo' size='24' color='#666'></AtIcon></View>
              <Text>待使用</Text>
            </View>
            <View className='at-col iButton'>
              <View><AtIcon prefixClass='icon' value='shanchu' size='24' color='#666'></AtIcon></View>
              <Text>已取消</Text>
            </View>
            <View className='at-col iButton'>
              <View><AtIcon prefixClass='icon' value='suoyoudingdan' size='24' color='#666'></AtIcon></View>
              <Text>全部订单</Text>
            </View>
          </View>
        </View>
        <View className='banner'>
          <Text className='title'>我的优惠</Text>
          <View className='at-row list'>
            <View className='at-col iButton'>
              <View><AtIcon prefixClass='icon' value='youhuiquan' size='24' color='#666'></AtIcon></View>
              <Text>优惠券</Text>
            </View>
            <View className='at-col iButton'>
              <View><AtIcon prefixClass='icon' value='yaoqing' size='24' color='#666'></AtIcon></View>
              <Text>邀请码</Text>
            </View>
            <View className='at-col iButton'>
              <View><AtIcon prefixClass='icon' value='jifen' size='24' color='#666'></AtIcon></View>
              <Text>积分</Text>
            </View>
          </View>
        </View>

      </View>
    )
  }
}
