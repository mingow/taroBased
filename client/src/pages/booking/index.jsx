import Taro, { Component } from '@tarojs/taro'
import { View, Text,Swiper, SwiperItem } from '@tarojs/components'
import './index.scss'

import { AtButton,AtIcon,AtBadge,AtCard } from 'taro-ui'

import Login from '../../components/login/index'
import CCard from '../../components/imageCard/index'
import CScrollArea from '../../components/scrollArea/index'
import CAvatar from '../../components/avatar/index'
import ItemCard from '../../components/itemCard/index'
import CloudImage from '../../components/imageFromCloud/index'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '订场',

    backgroundColorTop:'#fff',
    backgroundColorBottom:'#fff',
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Swiper
          className='test-h'
          indicatorColor='#999'
          indicatorActiveColor='#333'
          circular
          autoplay>
          <SwiperItem>
            <CloudImage cloudId='cloud://homie-7g9vm.686f-homie-7g9vm-1300872165/resources/images/banners/sales00.jpg' ></CloudImage>
          </SwiperItem>
          <SwiperItem>
            <CloudImage cloudId='cloud://homie-7g9vm.686f-homie-7g9vm-1300872165/resources/images/banners/sales00.jpg' ></CloudImage>
          </SwiperItem>
          <SwiperItem>
            <CloudImage cloudId='cloud://homie-7g9vm.686f-homie-7g9vm-1300872165/resources/images/banners/sales00.jpg' ></CloudImage>
          </SwiperItem>
        </Swiper>
        <ItemCard title="Homiez轰趴馆-龙岸花园店" second="深圳市龙华区民治街道华南路龙岸花园2期31A" src='https://mp.weixin.qq.com/s/IkmaHpNddqf12YeLP4iB4g' cloudId='cloud://homie-7g9vm.686f-homie-7g9vm-1300872165/resources/images/photos/0.jpg'>
          快邀上好友来龙岸嗨翻天吧
        </ItemCard>
        <View className='footer'>
          <Text>更多分店即将到来，敬请期待...</Text>
        </View>
      </View>
    )
  }
}
