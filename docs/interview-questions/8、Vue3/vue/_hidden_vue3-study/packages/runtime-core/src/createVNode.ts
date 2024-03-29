import { isArray, isObject, isString } from "@vue/shared";

export const Text = Symbol("text");
export function isVNode(value) {
  return !!value.__v_isVNode;
}

export function isSameVNode(v1, v2) {
  return v1.type === v2.type && v1.key === v2.key;
}

export function createVNode(type, props = null, children = null) {
  // 判断后有不同类型的虚拟节点
  let shapeFlags = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : 0; // 标记出来自己是什么类型

  // vnode要对应实际的节点
  const vnode = {
    __v_isVNode: true,
    type,
    props,
    children,
    key: props && props.key,
    el: null,
    shapeFlags,
  };

  if (children !== undefined) {
    let temp = 0;
    if (isArray(children)) {
      // 走到createVNode要么是数组要么是字符串
      temp = ShapeFlags.ARRAY_CHILDREN;
    } else if (isObject(children)) {
      temp = ShapeFlags.SLOTS_CHILDREN;
    } else {
      children = String(children);
      temp = ShapeFlags.TEXT_CHILDREN;
    }

    vnode.shapeFlags = vnode.shapeFlags | temp;
  }

  return vnode;
}

export const enum ShapeFlags {
  ELEMENT = 1,
  FUNCTIONAL_COMPONENT = 1 << 1,
  STATEFUL_COMPONENT = 1 << 2,
  TEXT_CHILDREN = 1 << 3,
  ARRAY_CHILDREN = 1 << 4,
  SLOTS_CHILDREN = 1 << 5,
  TELEPORT = 1 << 6,
  SUSPENSE = 1 << 7,
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  COMPONENT_KEPT_ALIVE = 1 << 9,
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT,
}
