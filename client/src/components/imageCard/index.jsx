import Taro, { Component } from "@tarojs/taro"
import { View, Text, Button } from "@tarojs/components"
import classNames from 'classnames'
import PropTypes from 'prop-types'
import _isFunction from 'lodash/isFunction'
import './index.scss'

import CAvatar from '../../components/avatar/index'

const SIZE_CLASS = {
  normal: 'normal',
  small: 'small',
}

const TYPE_CLASS = {
  primary: 'primary',
  secondary: 'secondary',
}

export default class CCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      context: {},
      src:''
    }
  }

  handleClick = (...args) => {
    if (_isFunction(this.props.onClick)) {
      this.props.onClick(...args)
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
          own.setState({src:res.fileList[0].tempFileURL})
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

  onClick () {
    if (!this.props.disabled) {
      this.props.onClick && this.props.onClick(...arguments)
    }
  }

  render() {
    const { title, note, extra, thumb, isFull, icon } = this.props
    const rootClass = classNames(
      'grid',
      {
        'at-card--full': isFull
      },
      this.props.className
    )

    const iconClass = classNames({
      'at-icon': true,
      [`at-icon-${icon && icon.value}`]: icon && icon.value,
      'at-card__header-icon': true,
    })

    return (
      <View onClick={this.handleClick} className={rootClass}>

        <Image className='image' mode='aspectFill' src = {this.state.src}></Image>
        {this.props.children}
        <Text className='alt'style={this.state.src==''?'':'display:none'}>Loading</Text>
      </View>
    )
  }
}

CCard.defaultProps = {
  size: 'normal',
  title:'',
  type: '',
  circle: false,
  full: false,
  loading: false,
  cloudId:'',
  disabled: false,
  customStyle: {},
  onClick: () => {}
}

CCard.propTypes = {
  title: PropTypes.string,
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
