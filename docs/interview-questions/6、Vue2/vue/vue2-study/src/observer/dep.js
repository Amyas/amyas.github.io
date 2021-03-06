let id = 0

export default class Dep {
  constructor(){
    this.id = id++
    this.subs = [] // 用来存放watcher
  }

  depend(){
    if(Dep.target) {
      Dep.target.addDep(this)
    }
  }

  addSub(watcher){
    this.subs.push(watcher)
  }

  notify(){
    this.subs.forEach(watcher=>watcher.update())
  }
}

Dep.target = null

let stack = []

export function pushTarget(watcher) {
  Dep.target = watcher
  stack.push(watcher)
}

export function popTarget(){
  stack.pop()
  Dep.target = stack[stack.length - 1]
}