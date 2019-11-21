import Taro, { Component } from '@tarojs/taro'
import { View, Text,WebView,Swiper, SwiperItem,CoverView  } from '@tarojs/components'
import PropTypes from 'prop-types'
import CloudImage from '../../components/imageFromCloud/index'
import { AtIcon,AtFloatLayout,AtCalendar,AtTag,AtDivider } from 'taro-ui'

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
      buy:false,
      session:'',
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

  openFloatLayer() {
    this.setState({buy:true});
  }

  closeFloatLayer() {
    this.setState({buy:false});
  }

  changeTag(e) {
    this.setState({session:e.name});
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
            <CloudImage cloudId='cloud://vue-homeparty-4iqxy.7675-vue-homeparty-4iqxy-1300407309/resources/images/photos/0.JPG' ></CloudImage>
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
        <View className='bottom at-row'>
          <View className='grid left at-col at-col-6 at-row'>
            <View className='at-col iButton'>
              <View><AtIcon prefixClass='icon' value='home' size='24' color='#666'></AtIcon></View>
              <Text>首页</Text>
            </View>
            <View className='at-col iButton'>
              <View><AtIcon prefixClass='icon' value='dizhi' size='24' color='#666'></AtIcon></View>
              <Text>位置</Text>
            </View>
            <View className='at-col iButton'>
              <View><AtIcon prefixClass='icon' value='tel-fill' size='24' color='#666'></AtIcon></View>
              <Text>客服</Text>
            </View>
          </View>
          <View  className='grid at-col right at-col-6'>
            <Text onClick={this.openFloatLayer.bind(this)} >立即预定</Text>
          </View>
        </View>
        <AtFloatLayout className='layer' isOpened={this.state.buy} onClose={this.closeFloatLayer.bind(this)}>
          <View className='at-row'>
            <View className='at-col--auto img'>
              <CloudImage cloudId='cloud://vue-homeparty-4iqxy.7675-vue-homeparty-4iqxy-1300407309/resources/images/photos/0.JPG' ></CloudImage>
            </View>
            <View className='at-col disc'>
              <Text>{this.state.data.name}</Text>
            </View>

          </View>
          <View className='layer'>
            <AtDivider><Text className='header'>场次选择</Text></AtDivider>
          </View>
          <View className='at-row'>
            <AtTag size='small' type='primary' className='at-col--auto tag' name='day' onClick={this.changeTag.bind(this)}  active={this.state.session=='day'}>白天场</AtTag>
            <AtTag size='small' type='primary' className='at-col--auto tag' name='night' onClick={this.changeTag.bind(this)}  active={this.state.session=='night'}>通宵场</AtTag>
            <AtTag size='small' type='primary' className='at-col--auto tag' name='all' onClick={this.changeTag.bind(this)}  active={this.state.session=='all'}>全天场</AtTag>
          </View>
          <View className='layer'>
            <AtDivider><Text className='header'>日期选择</Text></AtDivider>
          </View>
          <AtCalendar Swiper="{false}" minDate={new Date(new Date()-3600*24*1000)} />
        </AtFloatLayout>
      </View>

    )
  }
}
