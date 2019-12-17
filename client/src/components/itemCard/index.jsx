import Taro, { Component } from "@tarojs/taro"
import { View, Text, Button } from "@tarojs/components"
import classNames from 'classnames'
import PropTypes from 'prop-types'
import _isFunction from 'lodash/isFunction'
import './index.scss'

import CAvatar from '../../components/avatar/index'

export default class ItemCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      context: {},
      img:'',
      price:3999,
      fullPrice:5999
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
    const ID = this.props.shopId;
    const me = this;
    const db = wx.cloud.database();
    db.collection('pricing').where({note:/Discount/i}).limit(1).orderBy('val','asc').get().then((res) =>{
      if(res.data.length){
        me.setState({
          price:parseFloat(res.data[0].val)
        })
      }
    })
    db.collection('pricing').where({note:/Full/i}).limit(1).orderBy('val','asc').get().then((res) =>{
      if(res.data.length){
        me.setState({
          fullPrice:parseFloat(res.data[0].val)
        })
      }
    })
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  naviTo() {
    var own = this;
    if(this.props.shopId){
      Taro.navigateTo({
        url:'/pages/store/index?shopId='+this.props.shopId,
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
          <View className='text'>
            <Text className='primary'>{this.props.title}</Text>
            <Text className='second'>{this.props.second}</Text>
            <Text className='price'>￥{this.state.price}起</Text><Text className='oriPrice'>¥{this.state.fullPrice}</Text>
          </View>
        </View>
        <View className='clear'></View>
      </View>
    )
  }
}

ItemCard.defaultProps = {
  size: 'normal',
  title:'undefined',
  second:'second',
  shopId:'',
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

ItemCard.propTypes = {
  title: PropTypes.string,
  src: PropTypes.string,
  shopId: PropTypes.string,
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
