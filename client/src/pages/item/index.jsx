import Taro, { Component } from '@tarojs/taro'
import { View, Text,WebView,Swiper, SwiperItem } from '@tarojs/components'
import PropTypes from 'prop-types'
import CloudImage from '../../components/imageFromCloud/index'

export default class Index extends Component {

  constructor (props) {
    super(props);
    this.state = {
      src: ''
    }
  }

  error() {
    //导航返回
  }

  componentWillMount() {
    if(this.$router.params.src){
      this.setState({src:this.$router.params.src})
    }
    else{

    }
  }

  render () {
    return (
      <View>
        <Swiper
          className='test-h'
          indicatorColor='#999'
          indicatorActiveColor='#333'
          circular
          autoplay>
          <SwiperItem>
            <CloudImage cloudId='cloud://vue-homeparty-4iqxy.7675-vue-homeparty-4iqxy-1300407309/resources/images/banners/sales00.jpg' ></CloudImage>
          </SwiperItem>
          <SwiperItem>
            <CloudImage cloudId='cloud://vue-homeparty-4iqxy.7675-vue-homeparty-4iqxy-1300407309/resources/images/banners/sales00.jpg' ></CloudImage>
          </SwiperItem>
          <SwiperItem>
            <CloudImage cloudId='cloud://vue-homeparty-4iqxy.7675-vue-homeparty-4iqxy-1300407309/resources/images/banners/sales00.jpg' ></CloudImage>
          </SwiperItem>
        </Swiper>
      </View>

    )
  }
}
