import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

import { AtButton,AtIcon,AtBadge,AtCard } from 'taro-ui'

import Login from '../../components/login/index'
import CCard from '../../components/imageCard/index'
import CScrollArea from '../../components/scrollArea/index'
import CAvatar from '../../components/avatar/index'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页',
    backgroundColor:'#fff',
    backgroundColorTop:'#fff',
    backgroundColorBottom:'#fff'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <AtButton className='glow' circle type = 'primary'>按钮文案</AtButton>
        <CScrollArea>
          <CCard title='Game' className='item' cloudId='cloud://vue-homeparty-4iqxy.7675-vue-homeparty-4iqxy-1300407309/resources/banter-snaps-BZzHWmQUszE-unsplash.jpg'>
          </CCard>
          <CCard title='Game' className='item' cloudId='cloud://vue-homeparty-4iqxy.7675-vue-homeparty-4iqxy-1300407309/resources/banter-snaps-BZzHWmQUszE-unsplash.jpg'>
          </CCard>
          <CCard title='Game' className='item' cloudId='cloud://vue-homeparty-4iqxy.7675-vue-homeparty-4iqxy-1300407309/resources/banter-snaps-BZzHWmQUszE-unsplash.jpg'>
          </CCard>
        </CScrollArea>
        <CAvatar></CAvatar>
        <AtButton className='glow' circle type = 'primary'>按钮文案</AtButton>
      </View>
    )
  }
}
