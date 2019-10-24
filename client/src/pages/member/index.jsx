import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

import { AtButton,AtIcon,AtBadge,AtCard } from 'taro-ui'

import Login from '../../components/login/index'
import CCard from '../../components/imageCard/index'
import CScrollArea from '../../components/scrollArea/index'
import CAvatar from '../../components/avatar/index'
import CContent from '../../components/contents/index'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '个人中心',
    navigationBarBackgroundColor: '#2CD18A',
    navigationBarTextStyle: 'white',
    backgroundColor:'#f5f5f6',
    backgroundColorTop:'#2CD18A',
    backgroundColorBottom:'#f5f5f6',
    usingComponents: {
      'mp-tabbar': './../../custom-tab-bar/index' // 书写第三方组件的相对路径
    }
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

        </View>
      </View>
    )
  }
}
