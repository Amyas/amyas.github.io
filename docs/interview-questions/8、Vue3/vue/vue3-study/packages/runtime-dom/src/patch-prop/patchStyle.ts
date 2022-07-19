export function patchStyle(el, preValue, nextValue) {
  const style = el.style;
  for (let key in nextValue) {
    style[key] = nextValue[key];
  }

  if (preValue) {
    for (let key in preValue) {
      if (nextValue[key] === null) {
        // 老的有，新的没有
        style[key] = null;
      }
    }
  }

  el.setAttribute("style", style);
}
