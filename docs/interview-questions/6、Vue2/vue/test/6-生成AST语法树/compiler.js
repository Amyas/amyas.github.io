function parseHTML(html) {
  const ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
  const startTagOpen = new RegExp(`^<${qnameCapture}`);
  const startTagClose = /^\s*(\/?)>/;
  const attribute =
    /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'<>`=]+)))?/;
  const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);

  let root = null;
  let stack = [];

  function createAstElement(tag, attrs) {
    return {
      tag,
      attrs,
      type: 1, // 1->元素、3->文本
      parent: null,
      children: [],
    };
  }

  function start(tagName, attrs) {
    let parent = stack[stack.length - 1];
    let element = createAstElement(tagName, attrs);
    element.parent = parent;
    if (!root) {
      root = element;
    }
    if (parent) {
      parent.children.push(element);
    }
    stack.push(element);
  }

  function end(tagName) {
    let last = stack.pop();
    if (last.tag !== tagName) {
      throw new Error("标签闭合错误");
    }
  }

  function chars(text) {
    text = text.replace(/\s/g, "");
    let parent = stack[stack.length - 1];
    if (text) {
      parent.children.push({
        type: 3,
        text,
      });
    }
  }
  function advance(len) {
    html = html.substring(len);
  }

  function parseStartTag() {
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
      };
      advance(start[0].length);

      let end;
      let attr;
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5],
        });
        advance(attr[0].length);
      }

      if (end) {
        advance(end[0].length);
      }

      return match;
    }
    return false;
  }

  while (html) {
    let textEnd = html.indexOf("<");
    if (textEnd === 0) {
      const startTagMatch = parseStartTag();
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      }

      const endTagMatch = html.match(endTag);
      if (endTagMatch) {
        end(endTagMatch[1]);
        advance(endTagMatch[0].length);
        continue;
      }
    }

    let text;
    if (textEnd > 0) {
      text = html.substring(0, textEnd);
    }

    if (text) {
      chars(text);
      advance(text.length);
    }
  }
  return root;
}

function compileToFunction(html) {
  const root = parseHTML(html);
  console.log(root);
}
