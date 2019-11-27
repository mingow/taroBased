import Taro, { Component } from '@tarojs/taro'
import { ScrollView,View, Text,WebView,Swiper, SwiperItem,CoverView  } from '@tarojs/components'
import PropTypes from 'prop-types'
import CloudImage from '../../components/imageFromCloud/index'
import { AtButton,AtIcon,AtFloatLayout,AtCalendar,AtTag,AtDivider,AtMessage,AtToast  } from 'taro-ui'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '详情',
    backgroundColor:'#ffffff',
    backgroundColorTop:'#ffffff',
    backgroundColorBottom:'#eee'
  }

  constructor (props) {
    super(props);
    this.state = {
      src: '',
      width:0,
      buy:false,
      loading:'确认日期中',
      loadingToast:false,
      session:'',
      date:'',
      currentDate:new Date(new Date()-3600*24*1000),
      price:'',
      location:'a9f7ef91-0fd7-4928-beef-ac19dd8742bd',
      data:{
        name:'Homie欢乐轰趴·龙岸花园店',
        pics:[
          'cloud://vue-homeparty-4iqxy.7675-vue-homeparty-4iqxy-1300407309/resources/images/photos/0.jpg',
        ],
        thumb:'cloud://vue-homeparty-4iqxy.7675-vue-homeparty-4iqxy-1300407309/resources/images/photos/0.jpg',
        desciption:'价格为30人标准价格，支付前请和客服确认场次信息，节假日请提前预定',
        price:'',
        oriPrice:'',
        intro:[
          '【场地空间】400平米天地4层超大面积，100平米湖畔花园鸟语花香',
          '【娱乐设施】',
          '【五黑房】超强吃机主机配34寸曲面显示器，祝你大吉大利',
          '【KTV】20平米海量曲库超大练歌房，让你想唱就唱',
          '【电影房】高清投影巨幅荧幕，让你身临其境',
          '【桌游】玉女烈白混，谁水谁先die',
          '【说明】',
          '本次费用包含30人套餐价格，超出人员按68元/人收取费用，场地布置有28人次床铺，超出此人数将无法安排床位，我们的管家会尽可能为您协调，还请谅解。',
          '场地提供自助厨房，如需动火做饭需额外加收200元清洁费。',
          '场地提供各类酒水，均按照超市价格出售，可提前冰镇，欢迎和管家咨询。',
          '由于有多个预定渠道，可能出现预定失败的情况，预定失败支付的定金会原路退回，还请谅解（如非顾客原因导致预定失败，将赠送一张优惠券，我们将竭尽所能满足顾客的需求）',
        ],
        more:'https://mp.weixin.qq.com/s/MYfcxgegSKjch2DMBcBZbw'
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

  getCurrentDate(){
    const me = this;
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getCurrentDate',
      // 传给云函数的参数
      success: function(res) {
        if(res.result){
          //向前倒数一天
          const current = new Date(res.result.parse-3600*24*1000);
          me.setState({currentDate:current});
          console.log('getCurrentDate success!');
        }
      },
      fail: function() {
        console.error('getCurrentDate error!');
      }
    });
  }

  //打开浮动层，进行预定
  openFloatLayer() {
    this.getCurrentDate();
    this.setState({buy:true});
  }

  closeFloatLayer() {
    this.setState({buy:false});
  }

  changeDate(e) {
    this.setState({date:e.value.start},this.pushInfo);
  }
  //弹出通知条，获取价格
  pushInfo() {
    if(this.state.session&&this.state.date){
      this.checkAvailable();
      Taro.atMessage({
        'message': '获取价格中...',
        'type': 'info',
      })
    }
  }
  //更改场次
  changeTag(e) {
    this.setState({session:e.name},this.pushInfo);

  }
  //跳转公众号文章介绍店铺详情
  more() {
    Taro.navigateTo({
      url:'/pages/webview/index?src='+this.state.data.more,
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('sendData', {})
      }
    })
  }
  //提交订单信息验证
  submit(info){
    const me = this;
    //生成参数

    var shopInfo = Object.assign({},this.state.data);
    delete shopInfo.intro;
    const data = {
      session:this.state.session,
      date:this.state.date,
      location:this.state.location,
      shopInfo:{
        name:shopInfo.name,
        thumb:shopInfo.thumb
      }
    }
    this.setState({loadingToast:true});

    wx.cloud.callFunction({
      name:'preOrderRequest',
      data:data,
      success:function(res){
        var msg = {
          message: '',
          type: 'error',
        }
        switch (res.result.errMsg) {
          case 'repeat':
            msg.message='订单已生成，请不要重复提交，请到个人页面查看';
            break;
          case 'occupy':
            msg.message='场次已被他人抢定，请重新选择时间和场次';
            break;
          case 'unfinished':
            msg.message='您有未完成支付订单，请先支付或取消';
            break;
          default:
            msg.message='场次已确认';
            const id = res.result.id;
            Taro.navigateTo({
              url:'/pages/preOrder/index?id='+res.result.id,
              success: function(res) {
                // 通过eventChannel向被打开页面传送数据
                console.log(res);
              }
            })
            break;
        }
        Taro.atMessage(msg)
        me.setState({loadingToast:false});
      },
      fail:function(){
        me.setState({loadingToast:false});
        Taro.atMessage({
          'message': '预定失败，可能是网络原因，请重试',
          'type': 'error',
        })
      }
    })
  }

  checkAvailable(){
    const me = this;
    const data = {
      session:this.state.session,
      date:this.state.date,
      location:this.state.location,
      shopName:this.state.data.name
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

    this.getCurrentDate();
    console.log(wx.getSystemInfoSync().windowWidth);
    this.setState({width:wx.getSystemInfoSync().windowWidth+'px'});
    if(this.$router.params.src){
      this.setState({src:this.$router.params.src})
    }
    else{

    }
    wx.setNavigationBarTitle({
      title: this.state.data.name
    })
  }

  render () {

    const {data} = this.state

    const content = data.intro.map((i,index) => {
      return <View key={index} className='at-article__p article_p'>{i}</View>
    })
    const pics = data.pics.map((i,index) => {
      return <SwiperItem key={index}><CloudImage cloudId={i}></CloudImage></SwiperItem>
    })
    return (
      <View>
        <View className='index safeAreaM'>
          <AtMessage />
          <Swiper
            className='test-h'
            style={{height:this.state.width}}
            indicatorColor='#999'
            indicatorActiveColor='#333'
            circular
            autoplay>
            {pics}
          </Swiper>
          <View className='header'>
            <Text className='primary'>{this.state.data.name}</Text>
            <Text className='discription'>{this.state.data.desciption}</Text>
            <Text>￥{this.state.data.price}元起</Text>
            <Text>￥{this.state.data.oriPrice}元起</Text>
          </View>
          <View className='contents'>
            {content}
            <Text onClick={this.more.bind(this)}>查看更多</Text>
          </View>
          <View className='safeArea'></View>

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

        </View>
        <AtFloatLayout className='layer' isOpened={this.state.buy} onClose={this.closeFloatLayer.bind(this)}>
          <View className='at-row'>
            <View className='at-col--auto img'>
              <CloudImage cloudId={this.state.data.thumb} ></CloudImage>
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
            <AtCalendar onSelectDate={this.changeDate.bind(this)} Swiper="{false}" minDate={this.state.currentDate} />
          </ScrollView>

          <AtButton onClick={this.submit.bind(this)} type='primary' disabled={!this.state.price} >立即预定</AtButton>
          <View className='safeArea'></View>
        </AtFloatLayout>
        <AtToast hasMask={true} duration={0} isOpened={this.state.loadingToast} text={this.state.loading} status='loading'></AtToast>
      </View>

    )
  }
}
