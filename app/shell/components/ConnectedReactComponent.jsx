import React from 'react'
import { toImmutable } from 'nuclear-js'

class ConnectedReactComponent extends React.Component {

  _reactor: Object
  _unsubscribeFns: Array
  _propMap: Map

  constructor (props, context) {
    super(props, context)
    this._reactor = props.reactor || context.reactor || global.reactor
    this._unsubscribeFns = []
    this._propMap = {}
    this.updatePropMap(props)
  }

  resubscribe (props) {
    this.unsubscribe()
    this.updatePropMap(props)
    this.updateState()
    this.subscribe()
  }

  componentWillMount () {
    this.updateState()
  }

  componentDidMount () {
    this.subscribe(this.props)
  }

  componentWillUnmount () {
    this.unsubscribe()
  }

  updatePropMap (props) {
    var mappedProperties = this.getConnectedProperties(props)
    this._propMap = mappedProperties || {}
  }

  updateState () {
    var propMap = this._propMap
    var stateToSet = {}
    for (var key in propMap) {
      var getter = propMap[key]
      stateToSet[key] = this._reactor.evaluate(getter)
    }
    this.setState(stateToSet)
  }

  subscribe () {
    var propMap = this._propMap
    var _loop = (key) => {
      var getter = propMap[key]
      var unsubscribeFn = this._reactor.observe(getter, (val) => {
        var _setState
        this.setState((_setState = {}, _setState[key] = val, _setState))
      })
      this._unsubscribeFns.push(unsubscribeFn)
    }
    for (var key in propMap) {
      _loop(key)
    }
  }

  unsubscribe () {
    if (this._unsubscribeFns.length === 0) {
      return
    }
    while (this._unsubscribeFns.length > 0) {
      this._unsubscribeFns.shift()()
    }
  }

  getConnectedProperties (props) {
    return {}
  }
}

ConnectedReactComponent.contextTypes = {
  reactor: React.PropTypes.object
}

ConnectedReactComponent.propTypes = {
  reactor: React.PropTypes.object
}

export default ConnectedReactComponent
