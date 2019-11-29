import Taro, { Component } from "@tarojs/taro"
import { View, Text, Button } from "@tarojs/components"
import classNames from 'classnames'
import PropTypes from 'prop-types'
import _isFunction from 'lodash/isFunction'
import './index.scss'

import { AtIcon,AtBadge } from 'taro-ui'


export default class CBadge extends Component {
  constructor (props) {
    super(props)
  }

  handleClick = (...args) => {
    if (_isFunction(this.props.onClick)) {
      this.props.onClick(...args)
    }
  }

  componentWillMount() { }

  componentDidMount() {

  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  onClick () {
    if (!this.props.disabled) {
      this.props.onClick && this.props.onClick(...arguments)
    }
  }

  render() {
    var res = null
    if(this.props.badge){
      res = (<View className='badge'>{this.props.badge}</View>);
    }
    return (<View onClick={this.handleClick} className={this.props.className}>
        <View><AtIcon prefixClass='icon' value={this.props.icon} size='24' color='#666'></AtIcon></View>
        <Text>{this.props.text}</Text>
        {res}
      </View>)
  }
}

CBadge.defaultProps = {
  text:'',
  icon: '',
  className: '',
  onClick: () => {},
  badge:0
}

CBadge.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.string,
  badge:PropTypes.number,
  className: PropTypes.string,
  onClick: PropTypes.func,
}
