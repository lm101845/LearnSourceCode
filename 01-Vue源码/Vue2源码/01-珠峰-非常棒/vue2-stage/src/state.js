/**
 * @Author: liming
 * @Date: 2022-07-18 22:22:29
 * @LastEditTime: 2022-07-18 22:22:30
 * @FilePath: \vue2-stage\src\state.js
 */
import {observe} from "./observe/index";

export function initState(vm) {
    const opts = vm.$options;   //获取所有的选项
    //如果有data属性就初始化数据
    if (opts.data) {
        initData(vm);
    }
}

function proxy(vm,target,key){
   Object.defineProperty(vm,key,{
       get(){
           return vm[target][key]
       },
       set(newValue){
           vm[target][key] = newValue
       }
   })
}

//拿到data后对里面的数据进行代理
function initData(vm) {
    let data = vm.$options.data;  //data Vue2里面可以是函数，也可以是对象
    data = typeof data === 'function' ? data.call(vm) : data
    //data是用户返回的对象
    console.log(data,'data');

    vm._data = data
    //把对象data放在实例身上,并且把对象进行了观测(给age和name添加了get和set)
    //但是这样做，用户访问的时候，就很恶心，只能vm._data.age这样访问

    //拿到数据以后，要对数据进行劫持 vue2里采用了一个api defineProperty
    observe(data)
    //observe方法用于观测数据，它是一个核心模块，叫响应式模块

    //最终将vm._data用vm来代理就可以了
    //for...in遍历的是对象的属性
    for(let key in data){
        proxy(vm,'_data',key)
    }
}