---
title: 队列
---

## 认识队列

队列（Queue）是一种运算受限的线性表，特点：先进先出。（FIF0：First In First Out）。

**受限指出：**

- 只允许在表的前端（front）进行删除操作。

- 只允许在表的后端（rear）进行插入操作。

生活中类似队列结构的场景：

- 排队，比如在电影院，商场。

- 优先排队的人，优先处理。（买票、结账）

### 队列图解

![queue2022-03-03-16-53-54](https://raw.githubusercontent.com/Amyas/picgo-bed/master/amyas.github.io/queue2022-03-03-16-53-54.png)

### 队列在程序中的应用

- 打印队列：计算机打印多个文件的时候，需要排队打印。

- 线程队列：在开启多线程时，当新开启的线程所需的资源不足时将放入线程队列，等待CPU处理。

## 队列的实现

队列的实现和栈一样，有两种方案：

- 基于数组实现。

- 基于链表实现。

### 队列常见的操作

- `enqueue(element)` 向队列尾部添加一个（或多个）新的项。

- `dequeue()` 移除队列的第一（即排在队列最前面的）项，并返回被移除的元素。

- `front()` 返回队列中的第一个元素————最先被添加的，队列不做任何变动。

- `isEmpty()` 如果队列中不包含任何元素，返回true，否则返回false。

- `size()` 返回队列包含的元素个数，与数组的length属性类似。

- `toString()` 将队列中的元素，转成字符串形式。

### 代码实现

``` js
function Queue() {
  // 属性
  this.items = [];

  // 方法
  // 1.将元素加入到队列中
  Queue.prototype.enqueue = function (element) {
    this.items.push(element);
  };

  // 2.从队列中删除前端元素
  Queue.prototype.dequeue = function () {
    return this.items.shift();
  };

  // 3.查看前端元素
  Queue.prototype.front = function () {
    return this.items[0];
  };

  // 4.查看队列是否为空
  Queue.prototype.isEmpty = function () {
    return this.items.length === 0;
  };

  // 5.产看队列中元素的个数
  Queue.prototype.size = function () {
    return this.items.length;
  };
}
```

### 测试代码

``` js
const queue = new Queue();

// enqueue() 测试
queue.enqueue("a");
queue.enqueue("b");
queue.enqueue("c");
queue.enqueue("d");
console.log(queue.items); //--> ["a", "b", "c", "d"]

// dequeue() 测试
queue.dequeue();
queue.dequeue();
console.log(queue.items); //--> ["c", "d"]

// front() 测试
console.log(queue.front()); //--> c

// isEmpty() 测试
console.log(queue.isEmpty()); //--> false

// size() 测试
console.log(queue.size()); //--> 2

// toString() 测试
console.log(queue.toString()); //--> c d
```

## 队列应用

使用队列实现小游戏：**击鼓传花**

分析：传入一组数据集合和设定的数字number，循环遍历数组内的元素，遍历到的元素为指定数字number时将该元素删除，直至数组剩下一个元素。

### 代码实现

``` js
// 击鼓传花
function passGame(nameList, num) {
  // 1.创建一个队列结构
  var queue = new Queue();

  // 2.将所有人依次加入到队列中
  for (var i = 0; i < nameList.length; i++) {
    queue.enqueue(nameList[i]);
  }

  // 3.开始数数字
  while (queue.size() > 1) {
    // 不是num的时候，重新加入到队列的末尾
    // 是num这个数字的时候，将其从队列中删除

    // 3.1 num数字之前的人重新放入队列的末尾
    for (var i = 0; i < num - 1; i++) {
      queue.enqueue(queue.dequeue());
    }

    // 3.2 num对应的这个人，直接从队列中删除
    queue.dequeue();
  }

  // 4.获取剩下的那个人
  var name = queue.front();
  console.log("最终剩下的人： " + name);

  return nameList.indexOf(name);
}
```

### 测试代码

``` js
// passGame() 测试
const names = ["lily", "lucy", "tom", "tony", "jack"];
const targetIndex = passGame(names, 4);
console.log("击鼓传花", names[targetIndex]); //--> lily
```
