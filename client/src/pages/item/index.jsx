import Taro, { Component } from '@tarojs/taro'
import { View, Text,WebView,Swiper, SwiperItem,CoverView  } from '@tarojs/components'
import PropTypes from 'prop-types'
import CloudImage from '../../components/imageFromCloud/index'
import { AtIcon } from 'taro-ui'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '详情',
    backgroundColor:'#ffffff',
    backgroundColorTop:'#ffffff',
    backgroundColorBottom:'#ffffff'
  }

  constructor (props) {
    super(props);
    this.state = {
      src: '',
      width:0,
      data:{
        name:'Homiez欢乐轰趴·龙岸花园店',
        desciption:'价格为30人标准价格，支付前请和客服确认场次信息，节假日请提前预定',
        price:'',
        oriPrice:''
      }
    }
  }

  error() {
    //导航返回
  }

  componentWillMount() {
    console.log(wx.getSystemInfoSync().windowWidth);
    this.setState({width:wx.getSystemInfoSync().windowWidth+'px'});
    if(this.$router.params.src){
      this.setState({src:this.$router.params.src})
    }
    else{

    }
    wx.setNavigationBarTitle({
      title: 'Homiez欢乐轰趴·龙岸花园店'
    })
  }

  render () {

    return (
      <View>
        <Swiper
          className='test-h'
          style={{height:this.state.width}}
          indicatorColor='#999'
          indicatorActiveColor='#333'
          circular
          autoplay>
          <SwiperItem>
            <CloudImage cloudId='cloud://vue-homeparty-4iqxy.7675-vue-homeparty-4iqxy-1300407309/resources/images/photos/0.jpg' ></CloudImage>
          </SwiperItem>
          <SwiperItem>
            <CloudImage cloudId='cloud://vue-homeparty-4iqxy.7675-vue-homeparty-4iqxy-1300407309/resources/images/banners/sales00.jpg' ></CloudImage>
          </SwiperItem>
          <SwiperItem>
            <CloudImage cloudId='cloud://vue-homeparty-4iqxy.7675-vue-homeparty-4iqxy-1300407309/resources/images/banners/sales00.jpg' ></CloudImage>
          </SwiperItem>
        </Swiper>
        <View className='header'>
          <Text className='primary'>{this.state.data.name}</Text>
          <Text className='discription'>{this.state.data.desciption}</Text>
          <Text>{this.state.data.price}</Text>
          <Text>{this.state.data.oriPrice}</Text>
        </View>
        <View className='bottom'>
          <View className='grid left'>
            <View className='iButton'>
              <View><AtIcon prefixClass='icon' value='home' size='24' color='#666'></AtIcon></View>
              <Text>首页</Text>
            </View>
            <View className='iButton'>
              <View><AtIcon prefixClass='icon' value='dizhi' size='24' color='#666'></AtIcon></View>
              <Text>位置</Text>
            </View>
            <View className='iButton'>
              <View><AtIcon prefixClass='icon' value='tel-fill' size='24' color='#666'></AtIcon></View>
              <Text>客服</Text>
            </View>
          </View>
          <View  className='grid right'>
            <Text>立即购买</Text>
          </View>
        </View>
      </View>

    )
  }
}
