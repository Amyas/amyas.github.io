export let activeEffect = undefined;

// 依赖收集的原理是借助js单线程，默认调用effect时候去调用proxy的get
// 让属性记住依赖的effect，同理让effect记住对应的属性
// 靠的是数据结果weak map {map:{key: new Set()}}
// 稍后数据变化的时候，找到对应的map，通过属性发出set中effect
export class ReactiveEffect {
  public active = true;
  public parent = null;
  public deps = []; // effect中用了哪些属性，后续清理的时候使用
  constructor(public fn) {
    // public fn === this.fn = fn
  }
  run() {
    // 去proxy对象上取值，
    // 取值的时候，让这个属性和当前的effect函数关联起来
    // 稍后数据变化后，可以重新执行effect函数
    // 以来收集，让属性和effect关联起来
    if (!this.active) {
      return this.fn();
    } else {
      try {
        this.parent = activeEffect;
        activeEffect = this;
        return this.fn();
      } finally {
        // 取消当前正在运行的effect
        activeEffect = this.parent;
        this.parent = null;
      }
    }
  }
}

const targetMap = new WeakMap();

export function trigger(target, key, value) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return; // 属性没有依赖任何effect
  }

  const effects = depsMap.get(key);
  effects &&
    effects.forEach((effect) => {
      // 该判断解决effect内修改state数据，造成无限执行，栈溢出
      // 保证执行的effect不是当前的activeEffect
      if (effect !== activeEffect) {
        effect.run(); // 重新执行effect
      }
    });
}

// 哪个对象中的哪个属性，对应哪个effect，一个属性可以对应多个effect
// 外层用一个map{object:{name:[effect],age:[effect, effect]}}
export function track(target, key) {
  // 让属性记录所用到的effect是谁
  if (activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }

    let deps = depsMap.get(key);
    if (!deps) {
      depsMap.set(key, (deps = new Set()));
    }

    let shouldTrack = !deps.has(activeEffect);
    if (shouldTrack) {
      deps.add(activeEffect);
      activeEffect.deps.push(deps);
    }
  }
}

export function effect(fn) {
  // 将用户传递的函数变成响应式的effect

  const _effect = new ReactiveEffect(fn);
  _effect.run();
}
