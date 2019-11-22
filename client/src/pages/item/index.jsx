import Taro, { Component } from '@tarojs/taro'
import { ScrollView,View, Text,WebView,Swiper, SwiperItem,CoverView  } from '@tarojs/components'
import PropTypes from 'prop-types'
import CloudImage from '../../components/imageFromCloud/index'
import { AtButton,AtIcon,AtFloatLayout,AtCalendar,AtTag,AtDivider,AtMessage } from 'taro-ui'

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
      date:'',
      price:'',
      data:{
        name:'Homie欢乐轰趴·龙岸花园店',
        desciption:'价格为30人标准价格，支付前请和客服确认场次信息，节假日请提前预定',
        price:'',
        oriPrice:'',
        intro:[
          '【场地空间】400平米天地4层超大面积，100平米湖畔花园鸟语花香',
          '【娱乐设施】',
          '【五黑房】超强吃机主机配34寸曲面显示器，祝你大吉大利',
          '【KTV】20平米海量曲库超大练歌房，让你想唱就唱',
          '【电影房】高清投影巨幅荧幕，让你身临其境',
          '【桌游】玉女烈白混，谁水谁先die'
        ]
      },
      static:{
        session:{
          day:'白天场',
          night:'通宵场',
          all:'全天场',
        }
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

  changeDate(e) {
    this.setState({date:e.value.start},this.pushInfo);
  }

  pushInfo() {
    if(this.state.session&&this.state.date){
      this.checkAvailable();
      Taro.atMessage({
        'message': '获取价格中...',
        'type': 'info',
      })
    }
  }

  changeTag(e) {
    this.setState({session:e.name},this.pushInfo);

  }

  checkAvailable(){
    const me = this;
    const data = {
      session:this.state.session,
      date:this.state.date
    }
    //清空价格，避免获取状态时触发点击
    this.setState({price:''});
    wx.cloud.callFunction({
      // 云函数名称
      name: 'checkSessionAvailable',
      // 传给云函数的参数
      data: data,
      success: function(res) {
        if(res.result){
          if(res.result.available&&res.result.data.session==me.state.session&&res.result.data.date==me.state.date){
            me.setState({price:res.result.price})
            Taro.atMessage({
              'message': '价格已更新',
              'type': 'success',
            })
          }
        }
      },
      fail: function() {
        Taro.atMessage({
          'message': '场次信息获取失败，请重新点击',
          'type': 'error',
        })
      }
    });
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
      title: 'Homie欢乐轰趴·龙岸花园店'
    })
  }

  render () {
    const content = this.state.data.intro.map((i,index) => {
      return <View key={index} className='at-article__p article_p'>{i}</View>
    })
    return (
      <View className='index'>
        <AtMessage />
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
          <Text>￥{this.state.data.price}元起</Text>
          <Text>￥{this.state.data.oriPrice}元起</Text>
        </View>
        <View className='contents'>
          {content}
        </View>
        <View>
          <WebView src = 'https://mp.weixin.qq.com/s/MYfcxgegSKjch2DMBcBZbw' binderror = {this.error.bind(this)}></WebView>
        </View>
        {/* 以下部分是底部菜单栏 */}
        <View className='bottom at-row safeArea'>
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
          <View  className='safeArea grid at-col right at-col-6'>
            <Text onClick={this.openFloatLayer.bind(this)} >立即预定</Text>
          </View>
        </View>
        {/* 以下部分是弹出层内容 */}
        <AtFloatLayout className='layer' isOpened={this.state.buy} onClose={this.closeFloatLayer.bind(this)}>
          <View className='at-row'>
            <View className='at-col--auto img'>
              <CloudImage cloudId='cloud://vue-homeparty-4iqxy.7675-vue-homeparty-4iqxy-1300407309/resources/images/photos/0.JPG' ></CloudImage>
            </View>
            <View className='at-col disc'>
              <Text>{this.state.data.name}</Text>
              <View className='at-row'>
                <View className='at-col'>
                  <Text className='small'>场次:{this.state.session?this.state.static.session[this.state.session]:'请选择'}</Text>
                  <Text className='small'>日期:{this.state.date?this.state.date:'请选择'}</Text>
                </View>
                <View className='at-col priceSession'>
                  <Text>价格：{this.state.price?this.state.price+' 元':'暂无'}</Text>
                </View>
              </View>
            </View>
          </View>
          <ScrollView scrollY className='scroll'>
            <View>
              <AtDivider><Text className='header'>场次选择</Text></AtDivider>
            </View>
            <View className='at-row'>
              <AtTag size='small' type='primary' className='at-col--auto tag' name='day' onClick={this.changeTag.bind(this)}  active={this.state.session=='day'}>白天场</AtTag>
              <AtTag size='small' type='primary' className='at-col--auto tag' name='night' onClick={this.changeTag.bind(this)}  active={this.state.session=='night'}>通宵场</AtTag>
              <AtTag size='small' type='primary' className='at-col--auto tag' name='all' onClick={this.changeTag.bind(this)}  active={this.state.session=='all'}>全天场</AtTag>
            </View>
            <View>
              <AtDivider><Text className='header'>日期选择</Text></AtDivider>
            </View>
            <AtCalendar onSelectDate={this.changeDate.bind(this)} Swiper="{false}" minDate={new Date(new Date()-3600*24*1000)} />
          </ScrollView>

          <AtButton type='primary' disabled={!this.state.price} >立即预定</AtButton>
          <View className='safeArea'></View>
        </AtFloatLayout>
      </View>

    )
  }
}
