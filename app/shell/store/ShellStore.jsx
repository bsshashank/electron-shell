// @flow

import { Store, toImmutable } from 'nuclear-js'
import ActionTypes from '../actions/ShellActionTypes'

export default Store({

  getInitialState () {
    return toImmutable({})
  },

  initialize () {
    this.on(ActionTypes.MOUNT_AVAILABLE_EXTENSIONS, (state, payload) => {
      return state.merge({ extensions: toImmutable(payload.extensions).toMap() })
    })
    this.on(ActionTypes.ACTIVATE_EXTENSION, (state, payload) => {
      console.log(state, payload)
      return state.merge(toImmutable(payload.extension).toMap())
    })
    this.on(ActionTypes.DEACTIVATE_EXTENSION, (state, payload) => {
      console.log(state, payload)
      return state.merge(toImmutable(payload.extension).toMap())
    })
    this.on(ActionTypes.UPDATE_EXTENSION, (state, payload) => {
      console.log(state, payload)
      return state.merge(toImmutable(payload.extension).toMap())
    })
  }
})
