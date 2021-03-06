let watcherId = 0;

let has = {};
let queue = [];
let pending = false;

function fluashSchedulerQueue() {
  for (let i = 0; i < queue.length; i++) {
    queue[i].run();
  }
  queue = [];
  has = {};
  pending = false;
}

function queueWatcher(watcher) {
  const id = watcher.id;
  if (!has[id]) {
    has[id] = true;
    queue.push(watcher);

    if (!pending) {
      nextTick(fluashSchedulerQueue);
      pending = true;
    }
  }
}

class Watcher {
  constructor(vm, expOrFn, callback, options = {}) {
    this.vm = vm;
    this.expOrFn = expOrFn;
    this.callback = callback;
    this.options = options;
    this.id = watcherId++;
    this.user = !!options.user;

    this.depIds = new Set();
    this.deps = [];

    if (typeof expOrFn === "string") {
      this.getter = function () {
        const path = expOrFn.split(".");
        let obj = vm;
        for (let i = 0; i < path.length; i++) {
          obj = obj[path[i]];
        }
        return obj;
      };
    } else {
      this.getter = expOrFn;
    }

    this.value = this.get();
  }
  get() {
    pushTarget(this);
    const value = this.getter();
    popTarget();

    return value;
  }
  update() {
    queueWatcher(this);
  }
  run() {
    const newValue = this.get();
    const oldValue = this.value;

    this.value = newValue;

    if (this.callback) {
      this.callback.call(this.vm, newValue, oldValue);
    }
  }
  addDep(dep) {
    const id = dep.id;
    if (!this.depIds.has(id)) {
      this.depIds.add(id);
      this.deps.push(dep);
      dep.addSub(this);
    }
  }
}
