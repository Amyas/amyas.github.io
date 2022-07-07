function initGlobalApi(Vue) {
  Vue.options = {};
  Vue.mixin = function (options) {
    this.options = mergeOptions(this.options, options);
    return this;
  };
}
