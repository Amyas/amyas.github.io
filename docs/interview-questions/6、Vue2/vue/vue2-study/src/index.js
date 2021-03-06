import { initGlobalApi } from './global-api/index'
import {initMixin} from './init'
import {lifecycleMixin} from './lifecycle'
import {renderMixin} from './render'
import { stateMixin } from './state'

function Vue(options) {
  this._init(options)
}

initMixin(Vue)
renderMixin(Vue) // _render
lifecycleMixin(Vue) // _update
stateMixin(Vue) // watcher
initGlobalApi(Vue)

export default Vue