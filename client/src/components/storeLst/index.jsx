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

  constructor (props) {
    super(props);
    this.state = {
      list:[]
    }
  }

  componentWillMount () {
    const me = this;
    const db = wx.cloud.database();
    db.collection('shopInfo').where({state:1}).orderBy('sort','asc').get().then((res) =>{
      me.setState({list:res.data})
    })
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {

    const List = this.state.list.map((i,index) => {
      return <ItemCard key = {index} title={i.name} second={i.addr} src={i.art} cloudId={i.banner} shopId={i._id}>
        {i.title}
      </ItemCard>
    })

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
        {List}
        <View className='footer'>
          <Text>更多分店即将到来，敬请期待...</Text>
        </View>
      </View>
    )
  }
}
