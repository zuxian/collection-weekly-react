
##  hook使用


组件尽量写成纯函数，如果需要外部功能和副作用，就用钩子把外部代码"钩"进来

*   useState【维护状态】
*   useEffect【完成副作用操作】
*   useContext【使用共享状态】
*   useReducer【类似redux】
*   useCallback【缓存函数】
*   useMemo【缓存值】
*   useRef【访问DOM】
*   useImperativeHandle【使用子组件暴露的值/方法】
*   useLayoutEffect【完成副作用操作，会阻塞浏览器绘制】

###  **useState()**--状态

`const [name, setName] = useState(initState)
`
使用 `useState` 定义 state 变量时候，返回一个有两个值的数组。第一个值是当前的 state，第二个值是更新 state 的函数。

```js
import React, { useState } from 'react'
import { Button } from 'antd'
const Home: React.FC<Iprops> = ({ dispatch, goodsList }) => {
  const [info, setInfo] = useState('init info')
  return (
    <div>
      <p>{info}</p>
      <Button onClick={() => setinfo('改变info')}> 点击更改info</Button>
    </div>
  )
}
export default Home
```

React组件的更新机制对state只进行浅对比，即更新某个复杂类型数据时只要它的引用地址没变，那就不会重新渲染组件。对于数组、对象，需要使用深拷贝，即改变数组/对象的指针指向的地址，来实现组件的重新渲染。

```js
setArr((prev) => {  	 // 改变数组
    prev[0] = 1;
    const arrCopy = prev.slice();
    return arrCopy;
});

setObj((prev) => ({ ...prev, a1: 1 }));   // 改变对象
```

### useReducer

两种state管理的hook：useState、useReducer。 对于复杂的state操作逻辑，嵌套的state的对象，推荐使用useReducer。 

`const [state, dispatch] = useReducer(reducer, initState);`

```js
export default function ReducerDemo() {
    const [count, dispath] = useReducer((state,action)=> {
        if(action === 'add'){ return state + 1; }
        return state;
    }, 0);
    return (<div>
       <h1>{count}</h1>
       <button onClick={()=> dispath('add')} >Increment</button>
   </div>)
}
```

###  useEffect--副作用钩子

https://blog.csdn.net/glorydx/article/details/114107703

useEffet 合成了calss组件中的componentDidMount, componentDidUpdate, componentWillUnmount 这三个生命周期

1. Effect Hook 可以让你在函数组件中执行副作用操作，用于模拟类式组件中的生命周期勾子
2. React中的副作用操作：发送Ajax请求数据获取、设置订阅、启动定时器
3. 语法和说明：
   - componentDidMount()

```js
useEffect( ()=>{ },[] )     // 操作(仅在函数组件第一次调用后执行)
```

- componentDidUpdate()

```js
// 1.不传第二个参数，不会报错，但浏览器会无线循环执行逻辑处理函数
useEffect( ()=>{ } )         
// 或  2.传第二个参数，且指定监测对象， 状态更新后执行的操作
useEffect(()=>{ },[stateValue])
```

- componentWillUnmount()

```js
//  返回一个回调函数，回调函数将会在组件被摧毁之前和再一次触发更新时，将之前的副作用清除掉
useEffect(()=>{ return ()=>{ } },[])

const [time, setTime] = useState(0)
useEffect(() => {
	const InterVal = setInterval(() => { setTime(time + 1) },1000)
	return () => { clearInterval(InterVal)	}
},[])
```

- *useEffect常见跳坑*

1.  useEffect 只能是个同步函数，不能使用 async，如果要发送请求等异步操作，额外加个箭头函数包裹住

```js
useEffect(()={ async () => { const res = awiat xxx() } }, [])
```

2. 在useEffect执行函数里面改变了useEffect监测的变量

解决：不要在useEffect第一参数执行函数中去改变第二参数依赖元素的地址的值。当依赖元素的地址的值发生改变，又会执行一次执行函数，这不是无限循环么。 

```js
const [a, setA] = useState(1);
useEffect(() => { setA(a + 1) }, [a])
```

3. useEffect监测不到引用类型数据的变化， 依赖数组元素的地址的值根本就没变 

```js
const [a, setA] = useState({ b: 'dx', c: '18' })
const changeA = () => {
	setA((old) => { old.b = 'yx'; return old })
}
useEffect(() => { changeA () },[])
/**当changeA执行却没有打印 a*/
useEffect(() => { console.log(a) },[a])
```

解决：changeA没有真正的改变a在栈中的值（地址的值），只是改变了a在堆中的值。useEffect监测不到堆中值得变化。换个引用地址。

```js
const [a, setA] = useState({ b: 'dx', c: '18' })
const changeA = () => {
	setA((old) => {
        const newA = {...old}
        newA.b = 'yx'
        return newA 
	})
}
useEffect(() => { changeA() }, [])
/**当changeA执行打印  {b:'yx',c:'18'}  */
useEffect(() => { console.log(a) }, [a])
```

### useContext()--共享状态钩子

Context ：在组件之间共享值，不必显式地通过组件树的逐层传递 props。类似于 React 中Context Api 和 Vue 中的 provide/inject Api

使用context的子组件直接使用`React.useContext(Context)`就可获得context，而在Context Api中需使用`<Consumer>({vlaue} => {})</Consumer>`；父组件Provider写法不变。

useContext(MyContext) 相当于 class 组件中的 static contextType = MyContext 或者 <MyContext.Consumer>

useContext(MyContext) 只是让你能够读取 context 的值以及订阅 context 的变化。需要在上层组件树中使用 <MyContext.Provider> 来为下层组件提供 context

```js
const obj = { value: 1 };
const obj2 = { value: 2 };
const ObjContext = React.createContext(obj);
const Obj2Context = React.createContext(obj2);

const App = () => { return (
  <ObjContext.Provider value={obj}>
  <Obj2Context.Provider value={obj2}> <ChildComp /> </Obj2Context.Provider>
  </ObjContext.Provider>
);};
// 子级
const ChildComp = () => { return <ChildChildComp />; };
// 孙级或更多级
const ChildChildComp = () => {
  const obj = useContext(ObjContext);
  const obj2 = useContext(Obj2Context);
  return ( <><div>{obj.value}</div><div>{obj2.value}</div></> );
};
```

- 类组件中的Provider、Context和contextType的使用

https://blog.csdn.net/landl_ww/article/details/93514944

```js
import React, { createContext } from 'react';
const ThemeContext = createContext()
const SizeContext = createContext()
class App extends React.Component {
  state = { theme: 'red', size: 'small' }
  render () {
    const { theme, size } = this.state
    return (
      // 使用 Context.Provider 包裹后续组件，value 指定值 
      <ThemeContext.Provider value={theme}>
        {/* 当出现多个Context的时候，只需要将Context.Provider 嵌套即可 */}
        <SizeContext.Provider value={size}>
          {/* 当Context的Provider值更改时，Consumer 的值必须重新渲染 */}
          <button onClick={()=>{this.setState({ theme:'yellow'})}}>按钮</button>
          <Middle></Middle>
        </SizeContext.Provider>
      </ThemeContext.Provider>
    )
  }
}
class Bottom extends React.Component {
  // 申明静态变量、contextType 将 context 直接赋值于 contextType
  // static contextType = ThemeContext
  // 在 render 函数中可以直接 访问this.context获取共享变量、这样就可以不使用consumer
  // const theme = this.context

  render () {
    return (
      // Context.Consumer Consumer消费者使用Context值
      // 但子组件不能是其他组件，必须渲染一个函数，函数的参数是Context值
      // 当出现 多个Consumer的时候，进行嵌套，每个Consumer 的子组件必须是一个函数
      <ThemeContext.Consumer> {theme => (
            <SizeContext.Consumer>
              {size => (<h1>ThemeContext值为{theme}; SizeContext值为{size}</h1>)}
            </SizeContext.Consumer>
      )} </ThemeContext.Consumer>
    )
  }
}
class Middle extends React.Component{ render(){ return <Bottom></Bottom> } }
export default App;
```

一个组件如果有多个 consumer ， contextType 只对其中一个有效，所以contextType 只能有一个

###  useMemo--缓存值

类组件中解决子组件被再次渲染：

1. shouldComponentUpdate这个钩子做判断返回true或者false；  2. ComponentPure 使用纯组件

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
//  不管页面 render 几次，时间戳都不会被改变，因为已经被被缓存了，除非依赖改变
const getNumUseMemo = useMemo(() => `${+new Date()}`, [])
```
在a和b的变量值不变的情况下，memoizedValue的值不变，useMemo函数的第一个入参函数不会被执行，节省计算量（像vue的 computed 计算属性）

```js
import React, { useState } from 'react'
import { Input } from 'antd'
import Son1 from './son1'
interface Iprops {}
const Home: React.FC<Iprops> = () => {
  const [info, setInfo] = useState('')
  const [visible, setVisible] = useState(true)
  // const onVisible = () => { setVisible((visible) => !visible) }
  const onVisible = useMemo(() => {
    return () => { setVisible((visible) => !visible) }
  }, [])
  const changeInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInfo(value)
  }
  return ( <div>
      <p>{info}</p>
      <Input onChange={(e) => changeInfo(e)}></Input>
      <Son1 onVisible={onVisible} />
    </div>)
}
export default Home
// 子组件
import React, { memo } from 'react'
import { Button } from 'antd'
interface Iprops { onVisible: () => void }
const Son1: React.FC<Iprops> = ({ onVisible }) => {
  console.log('我被重新渲染了....')
  return ( <Button onClick={() => onVisible()}>button</Button> )
}
// export default memo(Son1)  
export default Son1
```
在父组件中Input输入框每次输入新的值，父组件的info的值就会发生改变，子组件每次都会重新渲染，即使子组件没用到info值，因为setInfo导致父组件重新渲染了，也导致onVisible每次都变成一个新的值，所以引起子组件重新渲染。

利用React.memo，props.onVisible是一个函数，它是一个引用类型的值，当父组件重新渲染onVisible 这个函数也会重新生成,这样引用地址变化就导致对比出新的数据,子组件就会重新渲染。

 React.memo() 会在整个组件入口进行拦截，如果 isEqual 返回为 true， 则整个组件都不会执行
而useMemo() 可以更细致的操作 组件的 render 渲染，按照useMemo() 第二个参数数组 [] 依赖项来进行render，而不会拦截整个函数组件的其他业务逻辑 

https://www.jianshu.com/p/9af1c9c3a02b

```js
Function.prototype.memoize = function() {
  var self = this
  return function () {
    var args = Array.prototype.slice.call(arguments)
    self.cache = self.cache || {};
    return self.cache[args] ? self.cache[args] : (self.cache[args] = self(args))
  }
}

function sqrt(arg) { return Math.sqrt(arg); }
const memoizedSqrt = sqrt.memoize()
log(memoizedSqrt(4)) // 2, calculated
log(memoizedSqrt(4)) // 2, returns result from cache
```

###   useCallback-缓存函数

```js
// 除非 `a` 或 `b` 改变，否则不会变
const memoizedCallback = useCallback(() => doSomething(a, b),  [a, b],);
```
react中只要父组件的 render 了，那么默认情况下就会触发子组的render，避免这种重渲染方法： `React.PureComponent`、`React.memo` ，`shouldComponentUpdate()`

useMemo是缓存值，useCallback一个是缓存函数的引用。也就是说 useCallback(fn, [deps]) 相当于 useMemo(() => fn, [deps])

```js
const Home: React.FC<Iprops> = () => {
  const [info, setInfo] = useState('')
  const [visible, setVisible] = useState(true)
  // const onVisible = useMemo(() => { return () => setVisible((visible) => !visible) }, [])
  const onVisible = useCallback(() => { setVisible(visible => !visible)}, [])
  const changeInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInfo(value)
  }
  return (<div>
    <p>{info}</p>
    <Input onChange={(e) => changeInfo(e)}></Input>
    <Son1 onVisible={onVisible} />
  </div>)
}
export default Home
```

 避免在component render时候声明匿名方法，因为这些匿名方法会被反复重新声明而无法被多次利用，然后容易造成component反复不必要的渲染。 

> 子组件接收一个函数作为props；子组件跟着父组件更新了。
>
> 借助useCallback来返回函数，然后把这个函数作为props传递给子组件；子组件就避免不必要的更新。

###   useRef

`const refContainer = useRef(initialValue);`

返回一个可变的 ref 对象，该对象只有个 current 属性，初始值为传入的参数( initialValue )。
返回的 ref 对象在组件的整个生命周期内保持不变
当更新 current 值时并不会 re-render ，这是与 useState 不同的地方

- 判断是否是由于页面更新而非首次渲染
- 获取 Dom 元素，在函数组件中通过useRef 来获取对应的 Dom 元素，拿到子组件的实例，相当于class组件的`React.createRef()`

```js
import { useRef } from 'react';
export function useFirstMountState(): boolean {
  const isFirst = useRef(true);
  if (isFirst.current) {
    isFirst.current = false;
    return true;
  }
  return isFirst.current;
}
```
访问DOM，从而操作DOM，如点击按钮聚焦文本框
```js
const Hook =()=>{
  const [count, setCount] = useState(0)
  const btnRef = useRef(null)
  useEffect(() => {
    const onClick = ()=>{ setCount(count+1)  }
    btnRef.current.addEventListener('click',onClick, false)
    return ()=> btnRef.current.removeEventListener('click',onClick, false)
  },[count])
  return(<div><div>{count}</div>
    <button ref={btnRef}>click me</button>
  </div>)
}
```
要访问的是一个组件，操作组件里的具体DOM----React.forwardRef 高阶组件来转发ref
```js
const Index = () => {
  const inputEl = useRef(null);
  const handleFocus = () => { inputEl.current.focus(); };
  return ( <>
    <Child ref={inputEl} />
    <button onClick={handleFocus}>Focus</button>
  </>);
};
const Child = forwardRef((props, ref) => {
  return <input ref={ref} />;
});
```

`useImperativeHandle(ref, createHandle, [deps]) // 第一个参数暴露哪个ref;第二个参数暴露什么信息`

为什么使用: 因为使用forward+useRef获取子函数式组件DOM时,获取到的dom属性暴露的太多了

解决: 使用 uesImperativeHandle 解决,在子函数式组件中定义父组件需要进行的 DOM 操作,没有定义的就不会暴露给父组件

- **createRef 和 useRef 区别**

  > 1. createRef常用于类组件中，useRef 只能用于函数组件
  > 2. useRef 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数(initialValue)。返回的对象将在组件的整个生命周期





###  自定义Hook

React约定自定义 Hook 必须以 use 开头；
自定义Hook可自由搭配其他hook使用；
只在React的函数组件中最顶层使用 Hook。

```js
import React, { useState, useEffect } from 'react';
function useOnResize (fn) {
  useEffect(() => {
    window.addEventListener('resize',fn);
    return () => { window.removeEventListener('resize',fn) }
  }, []);
}
export default function App() {
  useOnResize(() => { console.log(document.body.clientWidth) })
  return (
    <div className="App"><p> Hello React Hook! </p></div>
  );
}
```


##  参考

https://juejin.cn/post/6844904072168865800


源码——  https://juejin.cn/post/6961664628526940174#heading-1




























