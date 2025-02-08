---
title: axios 基本使用及封装
date: '2023-12-02T00:00:00Z'
modifiedTime: '2023-12-04T00:00:00Z'
summary: 了解网络请求工具
categories: ['技术']
cover: 'https://img.leostar.top/study/20230616123026.png'
---


## 网络请求发展史

1. 传统的Ajax
     传统的Ajax请求是基于`XMLHttpRequest`（XHR）对象。可以直接使用。但是使用起来配置较为麻烦，实际开发中使用非常少，在MVC时代通常使用的是JQuery-Ajax。相对于传统的Ajax现在使用更多的是`Fetch`请求。

2. JQuery-Ajax
    JQuery-Ajax在前端JQuery时，因为JQuery的强大兼容性在项目开发中`$Ajax`使用非常广泛，需要引入JQuery库，其底层原理也是对传统的Ajax，XHR对象进行封装。但是在前端框架MVVC时代，例如使用vue搭建项目，如果再继续使用`$Ajax`就还需再单独引入JQuery重量级1w+代码量的库是得不偿失的。所以针对于框架的网络请求应运而生。

3. axios
    在Vue1.0时代，官方推出了`Vue-resource`，其体积相对于JQuery小的多，但是在Vue2.0时代官方宣布不再更新，那么继续使用`Vue-resource`就会存在版本无法匹配问题。因此在Vue2.0时代开始，官方推荐使用`axios`作为新一代的Ajax库。`axios`其优点：在浏览器中发送XMLHttpRequest请求、在node中发送http请求、支持Promise API、拦截请求和相应、转换请求和响应数据等，这里不再一一描述，想进一步了解其优点，可以查询相关资料。

## 原生XMLHttpRequest实现

~~~js
var request = new XMLHttpRequest(); // 创建XMLHttpRequest对象
//ajax是异步的，设置回调函数
request.onreadystatechange = function () { // 状态发生变化时，函数被回调
    if (request.readyState === 4) { // 成功完成
        // 判断响应状态码
        if (request.status === 200) {
            // 成功，通过responseText拿到响应的文本:
            return success(request.responseText);
        } else {
            // 失败，根据响应码判断失败原因:
            return fail(request.status);
        }
    } else {
        // HTTP请求还在继续...
    }
}
// 发送请求:
request.open('GET', '/api/categories');
request.setRequestHeader("Content-Type", "application/json") //设置请求头
request.send();//到这一步，请求才正式发出

~~~

## axios安装

先来看看axios的基本使用,本篇介绍axios的使用是与vue项目结合起来的，首先在命令行中输入`npm create vue`创建vue项目。其次，axios是一个第三方Ajax库，需要单独安装和引入，在命令行中输入`npm install axios --save-D`安装axios的依赖包。接着，在需要使用的地方引入axios对象`import axios from axios`，在实际开发中，通常会单独建立一个js文件引入axios引入再进行封装，下文会介绍。

## axios的基本使用

axios是基于Promise的，因此可以使用Promise API

### axios的请求方式

- axios(config)
- axios.request(config)
- axios.get(url[, config])
- axios.delete(url[, config])
- axios.head(url[, config])
- axios.post(url[, data[, config]])
- axios.put(url[, data[, config]])

- axios.patch(url[, data[, config]]) **axios(config)请求方式：** axios接收一个对象，在对象中使用`键值对`方式写入配置信息，get请求下，默认method可以不写。

~~~js
//执行GET请求
import axios from 'axios'
axios.default.baseURL = 'http://localhost:3000/api/products'
axios.get('/user?ID=12345')  //返回的是一个Promise
    .then(res=>console.log(res))
    .catch(err=>console.log(err));

//可配置参数的方式
axios.get('/user',{
    params:{
        ID:12345
    }
}).then(res=>console.log(res))
    .catch(err=>console.log(err));

~~~

~~~js
//发送post请求
axios.post('/user',{
    firstName: 'simon',
    lastName:'li'
}).then(res=>console.log(res))
    .catch(err=>console.log(err));

~~~

### axios配置

#### **常见配置项**

- 请求地址：`url: '/user'`
- 请求类型：`method: 'get'`
- 请根路径：`baseURL: 'http://www.mt.com/api'`
- 请求前的数据处理：`transformRequest:[function(data){}]`
- 请求后的数据处理：`transformResponse: [function(data){}]`
- 自定义的请求头：`headers:{'x-Requested-With':'XMLHttpRequest'}`
- URL查询对象：`params:{ id: 12 },`
- 查询对象序列化函数：`paramsSerializer: function(params){ }`
- request body：`data: { key: 'aa'}`
- 超时设置：`timeout: 1000,`
- 跨域是否带Token：`withCredentials: false`
- 自定义请求处理：`adapter: function(resolve, reject, config){}`
- 身份验证信息：`auth: { uname: '', pwd: '12'}`
- 响应的数据格式json / blob /document /arraybuffer / text / stream：`responseType: 'json'`

#### 参数配置方法

**全局配置**

第三方框架通过`import axios from axios`引入axios属于全局的axios。使用`default`关键字可以对axios进行一个配置。那么所有的axios请求都会携带default预先定义好的默认设置。对于公共的请求配置可以抽离出来，例如：请求超时时间、服务器地址、设置请求头等

语法格式：`axios实例.default.配置项`

~~~js
// axios.defaults.配置项===>axios全局配置
axios.defaults.baseURL = 'http://123.207.32.32:8000'
axios.defaults.timeout = 5000
axios.defaults.headers['X-TOKEN'] = '123xxx'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.responseType = 'blob' 

axios('home/multidata',
    {
        params: {
            type: 'pop',
            page: 1
        }
    }
).then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
})
~~~

**实例配置**

~~~js
 let instance = axios.create(
   //基本配置方法
 )
~~~

**axios请求配置**

视具体情况而定，如调用某个路径的文件巨大，我们可以单独对其请求时长进行设置：

```js
 instance.get('/data.json',{
   timeout:5000
 })
```

>优先级：请求配置 > 实例配置 > 全局配置

### axios并发请求

#### 简介

同时进行多个请求，并统一处理返回值。

案例：假设有一个聊天工具，同时有你的聊天记录和个人信息。此时需要调用两个接口去请求数据。此时需要统一处理他们的返回值。

#### axios提供的方法：all、spread

axios.all方法接受一个数组作为参数，数组中的每个元素都是一个请求，返回一个promise对象，当数组中所有请求均已完成时，执行then方法。 在then方法中执行了 axios.spread 方法。该方法是接收一个函数作为参数，返回一个新的函数。接收的参数函数的参数是axios.all方法中每个请求返回的响应。

~~~js
function getUserAccount() {
  return axios.get('/user/12345');
}

function getUserPermissions() {
  return axios.get('/user/12345/permissions');
}

axios.all([getUserAccount(), getUserPermissions()])
  .then(axios.spread((acct, perms) => {
    // 两个请求都完成后,acct是getUserAccount的返回值，同理，perms是 getUserPermissions的返回值
  }));

~~~

### 创建axios实例

>思考一下，我们通过`import axios from 'axios'`引入了全局的axios对象，为什么还要再单独创建axios实例呢？

在实际项目开发中，我们存在不同的请求默认配置可能不一样，例如，服务器地址、请求超时...默认配置不同，那么全局引进的axios再使用`axios.default.配置项`设置全局的默认统一的配置无法解决这个问题。因此，我们使用`axios.create()`函数创建新的axios实例，不同的axios实例可以设置不同的默认配置，各个axios实例之间的配置是互不影响的。
 `axios.create()`接收一个对象参数，使用键值对传入默认的配置，返回axios实例。

~~~js
import axios from 'axios'
// axios实例1
const axiosInstance1 = axios.create({
    baseURL:'http://123.207.32.32:8000',
    timeout:5000
})

axiosInstance1({
    url:'/home/multidata',
    params:{
        type:'pop',
        page:3
    }
}).then(res=>{
    console.log(res)
}).catch(err=>{
    console.log(err)
})


// axios实例2
const axiosInstance2 = axios.create({
    baseURL:'http://192.168.5.110:9001',
    timeout:5000
})

axiosInstance1({
    url:'/home/multidata'',
    params:{
        type:'pop',
        page:3
    }
})
.then(res=>{
    console.log(res)
}).catch(err=>{
    console.log(err)
})
~~~

也可以对新创建的axios实例使用.default方法配置

~~~js
import axios from 'axios'
// axios实例1
const axiosInstance1 = axios.create()
axiosInstance1.default.baseURL = 'http://123.207.32.32:8000'
axiosInstance1.default.timeout = 5000

axiosInstance1({
    url:'/home/multidata',
    params:{
        type:'pop',
        page:3
    }
}).then(res=>{
    console.log(res)
}).catch(err=>{
    console.log(err)
})
~~~

### axios拦截器

拦截器顾名思义即为拦截，对所有的请求和响应进行拦截。

**方法：**
`axios.interceptor.request.use()`请求拦截器
`axios.interceptor.response.use()`响应拦截器

两个拦截器使用方法一致，都接收两个参数：

- 参数1：拦截成功回调函数
- 参数2：拦截失败回调函数。 注意，无论请求还是响应拦截，拦截完了要return 返回拦截的请求体和响应体，不然就不会执行后边的请求和响应结果操作了。

可参axios照源码如下：

```typescript
export interface AxiosInterceptorManager<V> {
  use<T = V>(onFulfilled?: (value: V) => T | Promise<T>, onRejected?: (error: any) => any): number;
  eject(id: number): void;
}
```

**请求拦截器使用场景:**

- 发送请求时添加‘正在加载中...’图标
- 某些请求必须用户登陆，判断是否有用户token，没有跳转到登陆页
- 对请求的参数进行序列化

```js
axios.interceptor.request.use(res=>{
    console.log('来到了request拦截的success中');
    // 拦截完了要返回
    return res
},err=>{
    console.log('来到了request拦截的failure中');
})
```

**响应拦截器使用场景：**

- 返回响应的res.data数据结果
- 根据响应的status状态码，做出不同的操作。例如：如果status是401，响应拦截失败，那么通常是token失效，没有授权，要跳转至登陆页；status是200，响应拦截成功操作，返回res.data响应数据

```js
axios.interceptor.response.use(res=>{
    console.log('来到了response拦截的success中');
    // 拦截完了要返回
    return res.data
},err=>{
    console.log('来到了response拦截的failure中');
})
```

### axios封装

在项目中，我们通常会对请求进行二次封装，在项目中src/utils文件下新建request.js文件存放封装的请求，导入第三方请求库。那么为什么会二次封装请求呢？因为例如axios请求属于第三方库，如果后期作者不再维护axios库的时候，我们只需要修改request.js文件依赖的第三方框架部分，这样不会影响项目中其他需要发送请求的代码。

```js
import axios from 'axios'
import { useMsgbox, Message } from 'element3'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000, // request timeout
})

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  },
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 20000) {
      console.log('接口信息报错',res.message)
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('接口信息报错' + error) 
    return Promise.reject(error)
  },
)

export default service
```
