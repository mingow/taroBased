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
    navigationBarTitleText: '首页',
    backgroundColor:'#242a38',
    backgroundColorTop:'#242a38',
    backgroundColorBottom:'#242a38'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <View className='1px'></View>
        <CScrollArea>
          <CCard title='Game' className='item' cloudId='cloud://vue-homeparty-4iqxy.7675-vue-homeparty-4iqxy/resources/images/d6682b4f306737da47a2bce65f6dcd42.jpg'>
            <View className='avatar'><CAvatar size='small'></CAvatar><Text>桌游</Text></View>
          </CCard>
          <CCard title='Game' className='item' cloudId='cloud://vue-homeparty-4iqxy.7675-vue-homeparty-4iqxy/resources/images/61f78111c558b48dd6a624fe408d4a54.jpg'>
            <View className='avatar'><CAvatar size='small'></CAvatar><Text>KTV</Text></View>
          </CCard>
          <CCard title='Game' className='item' cloudId='cloud://vue-homeparty-4iqxy.7675-vue-homeparty-4iqxy/resources/images/1110340580.jpg'>
            <View className='avatar'><CAvatar size='small'></CAvatar><Text>麻将</Text></View>
          </CCard>
        </CScrollArea>
        <CContent title="欢迎光临" second="轰趴馆">
          开业大酬宾活动火热进行中，详情请联系管家
        </CContent>
        <View></View>
      </View>
    )
  }
}
