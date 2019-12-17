import Taro, { Component } from "@tarojs/taro"
import { View, Text, Button } from "@tarojs/components"
import classNames from 'classnames'
import PropTypes from 'prop-types'
import _isFunction from 'lodash/isFunction'
import './index.scss'

import CAvatar from '../../components/avatar/index'

export default class CContent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      context: {},
      img:''
    }
  }

  componentWillMount() {
    var own = this;
    if(own.props.cloudId){
      Taro.cloud.getTempFileURL({
        fileList: [{
          fileID: own.props.cloudId
        }]
      }).then(res => {
        console.log(res.fileList[0].tempFileURL)
        if(res.fileList[0].tempFileURL){
          own.setState({img:res.fileList[0].tempFileURL})
        }
      }).catch(error => {
        // handle error
      })
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  naviTo() {
    console.log(this.props.src)
    var own = this;
    if(this.props.src){
      Taro.navigateTo({
        url:'/pages/webview/index?src='+this.props.src,
        success: function(res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('sendData', { src: own.props.src })
        }
      })
    }else if(this.props.miniProgram){
      const me = this;
      wx.navigateToMiniProgram({
        appId: me.props.miniProgram,
        success(res) {
          // 打开其他小程序成功同步触发
          wx.showToast({
            title: '跳转成功'
          })
        }
      })
    }
  }

  render() {
    const { title, second } = this.props

    return (
      <View className='area grid' onClick={this.naviTo.bind(this)}>
        {!this.state.img?'':<View className='thumb'>
          <Image mode='aspectFill' className='pic' src={this.state.img}></Image>
        </View>}

        <View className='header'>
          <Image className='img'></Image>
          <View className='text'>
            <Text className='primary'>{this.props.title}</Text>
            {this.props.second?<Text className='second'>{this.props.second}</Text>:''}
          </View>
        </View>
        <View className='clear'></View>
        <View className='body'>
        {this.props.children}
        </View>
      </View>
    )
  }
}

CContent.defaultProps = {
  size: 'normal',
  title:'undefined',
  second:'second',
  src:'',
  thumb:'',
  type: '',
  circle: false,
  full: false,
  loading: false,
  cloudId:'',
  disabled: false,
  customStyle: {},
  onClick: () => {}
}

CContent.propTypes = {
  title: PropTypes.string,
  src: PropTypes.string,
  second: PropTypes.string,
  thumb: PropTypes.string,
  cloudId: PropTypes.string,
  size: PropTypes.oneOf(['normal', 'small']),
  type: PropTypes.oneOf(['primary', 'secondary', '']),
  circle: PropTypes.bool,
  full: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  customStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
}
