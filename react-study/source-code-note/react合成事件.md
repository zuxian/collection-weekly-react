
### React绑定事件

React的事件是通过onXxx属性指定事件处理函数

```js
//  在构造器中绑定this--constructor中bind--只会生成一个方法实例，并且绑定一次以后可以多次使用
export default class Test extends Component {
  constructor(props){
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick(){ console.log('点击了',this) }
  render(){ return ( <div onClick={ this.handleClick }>click btn</div> ) }
}

// 定义阶段使用箭头函数绑定---推荐---写法简单，性能也好
export default class Test extends Component {
  handleClick=()=>{ console.log('点击了',this) }
  render(){ return (<div onClick={ this.handleClick }>click btn</div>) }
}

// 在调用的时候绑定this---render方法中使用bind
export default class Test extends Component {
  handleClick(){ console.log('点击了',this) }
  render(){return (<div onClick={ this.handleClick.bind(this) }>click btn</div>) }
}

// 在调用的时候使用箭头函数绑定this --- render方法中使用箭头函数
export default class Test extends Component {
  handleClick(){ console.log('点击了',this) }
  render(){return (<div onClick={ e=> this.handleClick(e) }>click btn</div>)}
}
```

第二、三、四种方法的好处就是在不需要state的时候，不用额外的多写一个constructor构造函数。

但是第三、四种方法的问题在于每次渲染这个组件的时候，都会创建不同的回调函数，
通过ES6的上下文来将this的指向绑定给当前组件，同样在每一次render的时候都会生成新的方法，影响性能



###   事件捕获/冒泡/委托

https://blog.csdn.net/m0_37937502/article/details/82830992
https://zhuanlan.zhihu.com/p/134131941


事件捕获（event capturing）： 当鼠标点击或者触发dom事件时（被触发dom事件的这个元素被叫作事件源），浏览器会从根节点 =>事件源（由外到内）进行事件传播。
事件冒泡（dubbed bubbling）： 事件源 =>根节点（由内到外）进行事件传播。


dom标准事件流的触发的先后顺序为：先捕获再冒泡。即当触发dom事件时，会先进行事件捕获，捕获到事件源之后通过事件传播进行事件冒泡。

-  HTML DOM addEventListener() 方法

`element.addEventListener(event, function, useCapture);`

第三个参数默认值是false，事件冒泡。如果为true——事件捕获。

如果浏览器不支持addEventListener()方法, 使用attachEvent()方法替代--IE8及更早IE版本。



- **事件冒泡**

```js
<body>
  <div id="parent">
    父元素
    <div id="child">子元素</div>
  </div>
  <script type="text/javascript">
    var parent = document.getElementById("parent");
    var child = document.getElementById("child");
    document.body.addEventListener("click",function(e){console.log("click-body")},false);
    parent.addEventListener("click",function(e){console.log("click-parent")},false);
    child.addEventListener("click",function(e){console.log("click-child")},false);
  </script>
</body>

//  结果
//  click-child ---> click-parent ---> click-body
```

如果点击子元素不想触发父元素的事件，可使用event.stopPropagation();方法

```js
child.addEventListener("click",function(e){ console.log("click-child");
  　e.stopPropagation() }, false);
```


- **事件捕获**

```js
var parent = document.getElementById("parent");
var child = document.getElementById("child");
document.body.addEventListener("click",function(e){console.log("click-body")},false);
parent.addEventListener("click",function(e){console.log("click-parent事件传播")},false);
//新增事件捕获事件代码
parent.addEventListener("click",function(e){console.log("click-parent事件捕获")},true);
child.addEventListener("click",function(e){console.log("click-child")},false);

//  结果
//  click-parent事件捕获 ---> click-child ---> click-parent事件传播 ---> click-body
```

父元素通过事件捕获的方式注册了click事件，所以在事件捕获阶段就会触发，然后到了目标阶段，即事件源，
之后进行事件冒泡，parent同时也用冒泡方式注册了click事件，所以这里会触发冒泡事件，最后到根节点（body）


- **事件委托（事件代理）**


会把一个或者一组元素的事件委托到它的父层或者更外层元素上，真正绑定事件的是外层元素，
当事件响应到需要绑定的元素上时（事件捕获），会通过事件冒泡机制从而触发它的外层元素的绑定事件上，然后在外层元素上去执行函数


减少内存消耗

```js
<ul id="list">
  <li>item 1</li><li>item 2</li>...<li>item n</li>
</ul>
```

如果给每个列表项一一都绑定一个函数，那对于内存消耗是非常大的，比较好的方法就是把这个点击事件绑定到他的父层，
也就是 ul 上，然后在执行事件的时候再去匹配判断目标元素

```js
let ul = document.getElementsByTagName('ul')[0];
ul.onclick = function(e){
    if(e.target != li){console.log(e.target.innerText)}
}
```

动态绑定事件


```js
<ul id="list">
  <li className="class-1">item 1</li>
  <li>item 2</li>
  <li className="class-1">item 3</li>
  ......
  <li>item n</li>
</ul>

document.getElementById('list').addEventListener('click', function (e) {
  var event = e || window.event;
  var target = event.target || event.srcElement;
  if (target.matches('li.class-1')) {
    console.log('the content is: ', target.innerHTML);
  }
});
```


###  合成/原生事件区别


React自己实现了一套高效的事件注册，存储，分发和重用逻辑，
在DOM事件体系基础上做了很大改进，减少了内存消耗，简化了事件逻辑，并最大化的解决了IE等浏览器的不兼容问题。


- **合成事件优点**

> - React组件上声明的事件最终绑定到了document这个DOM节点上，而不是React组件对应的DOM节点。
> 故只有document这个节点上面才绑定了DOM原生事件，其他节点没有绑定事件。这样简化了DOM原生事件，减少了内存开销

> - React以队列的方式，从触发事件的组件向父组件回溯，调用它们在JSX中声明的callback。
> 也就是React自身实现了一套事件冒泡机制。我们没办法用event.stopPropagation()来停止事件传播，应该使用event.preventDefault()

> - React使用对象池来管理合成事件对象的创建和销毁，这样减少了垃圾的生成和新对象内存的分配，大大提高了性能

> - React有一套自己的合成事件SyntheticEvent，不同类型的事件会构造不同的SyntheticEvent



-  **例子**

```js
import React from 'react';
class Test extends React.Component {
  parentRef: React.RefObject<any>;
  childRef: React.RefObject<any>;
  constructor(props) {
    super(props);
    this.parentRef = React.createRef();
    this.childRef = React.createRef();
  }
  componentDidMount() {
    document.addEventListener('click', ()=>{console.log(`document原生事件捕获`)}, true);  //  1
    document.addEventListener('click', ()=>{console.log(`document原生事件冒泡`)});      //  10
    this.parentRef.current.addEventListener('click',()=>{console.log(`父元素原生事件捕获`)}, true); //  2
    this.parentRef.current.addEventListener('click', ()=>{console.log(`父元素原生事件冒泡`)});  //  5
    this.childRef.current.addEventListener('click',()=>{console.log(`子元素原生事件捕获`)}, true,);   //  3
    this.childRef.current.addEventListener('click', ()=>{console.log(`子元素原生事件冒泡`)});   //  4
  }
  handleParentBubble = () => {console.log(`父元素React事件冒泡`)};    //  9
  handleChildBubble = () => {console.log(`子元素React事件冒泡`)};     //  8
  handleParentCapture = () => {console.log(`父元素React事件捕获`)};   //  6
  handleChileCapture = () => {console.log(`子元素React事件捕获`)};    //  7
  render() {
    return (<div
        ref={this.parentRef}
        onClick={this.handleParentBubble}
        onClickCapture={this.handleParentCapture}
      >
        <div
          ref={this.childRef}
          onClick={this.handleChildBubble}
          onClickCapture={this.handleChileCapture}
        >事件处理测试</div>
    </div>);
  }
}
export default Test;
```

先执行所有捕获事件后，再执行所有冒泡事件。document原生事件冒泡最后执行！！

无论是否是对于同一元素监听的同种类型事件，原生事件总是比合成事件先触发。
这是由于上面我们说到的合成事件最终都会绑定到documnet DOM上导致的，当合成事件监听到后，总是冒泡到document才会真正触发。
而documnet DOM上监听的原生事件则总是最后触发


- 为什么react事件需要手动绑定this?

> 合成事件触发之后会冒泡一路到document的节点，然后开始分发document节点收集到的事件，这个时候react从事件触发的组件实例开始，遍历虚拟dom树，从树上取下我们绑定的事件，收集起来，然后执行。
> react会把所有的事件处理函数放到一个数组里。最后react只要遍历执行这个数组，就能执行所有需要执行的事件处理函数。
> 这里react对函数进行了临时保存，这个时候执行的话，this自然就丢失了。
> 如果react保存顺便保存一下实例，还是可以做到，不需要你绑定this的，但是这样对于react来说代价太大了。


- 合成事件和原生事件混用?

> 可以通过e.target.matches(selector)来进行事件触发元素的区分
> 原生事件中如果执行了stopPropagation（阻止冒泡）方法，则很容易导致其他同类型react合成事件失效。
> 因为这样所有同级以及后代元素的合成事件和原生事件都将无法冒泡到document上。
> 而如果仅仅是合成事件中使用了e.stopPropagation（阻止冒泡）方法，则不会影响原生事件的冒泡



###  合成原理

https://zhuanlan.zhihu.com/p/25883536

https://www.zhihu.com/people/xieyangyi/posts?page=3

当事件触发的时候，组件生成一个合成事件传递到document当中，在document处监听所有支持的事件，当事件发生并冒泡至document处时，React将事件内容封装交给中间层SyntheticEvent（负责所有事件合成）
所以当事件触发的时候，对使用统一的分发函数dispatchEvent将指定函数执行。






















