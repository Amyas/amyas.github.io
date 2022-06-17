import install, { Vue } from "./install"
import { createMatcher } from './create-matcher'
import HashHistory from "./history/hash"
import HTML5History from "./history/h5"

class VueRouter {
  constructor(options = {}) {
    const routes = options.routes
    this.mode = options.mode || 'hash'

    this.matcher = createMatcher(routes || [])

    // 根据模式需要初始化不同的路由系统 hash/history 底层实现不一样，但是使用方法一样
    switch(this.mode) {
      case 'hash':
        this.history = new HashHistory(this)
        break;
      case 'history':
        this.HISTORY = new HTML5History(this)
    }
  }
  init(app) {
    const history = this.history // 当前管理路由

    // hash -> hashchange，但是浏览器支持popstate就优先popstate
    // history -> popState 性能高于hashchange但是有兼容问题
    
    // 页面初始化完毕后，需要先进行一次跳转
    // 跳转到某个路径
    const setUpListener = () => {
      history.setUpListener()
    }
    history.transtionTo(
      history.getCurrentLocation(),
      setUpListener
    )
  }
  match(location){
    return this.matcher.match(location)
  }
}

VueRouter.install = install

export default VueRouter