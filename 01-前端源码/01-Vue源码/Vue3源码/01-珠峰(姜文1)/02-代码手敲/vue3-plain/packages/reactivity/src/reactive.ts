/**
 * @Author liming
 * @Date 2022/11/2 19:12
 **/
import {isObject} from "@vue/shared";
import {mutableHandlers,ReactiveFlags} from './baseHandler'
// 1.将数据转换成响应式数据，只能做对象的代理
const reactiveMap = new WeakMap();
//这里使用WeakMap原因是它不会导致内存泄漏
//WeakMap和Map很像，但是区别是它的key只能是对象
//弱引用对象的一大用处，就是作为缓存，未被清除时可以从缓存取值，一旦清除缓存就自动失效。

//实现同一个对象，代理多次，返回同一个代理
//实现代理对象被再次代理，可以直接返回
//取值的时候依赖收集，更新的时候重新渲染
export function reactive(target) {
    //它得先是对象，才能变(reactive只能做对象的代理)
    if (!isObject(target)) {
        return
    }

    if(target[ReactiveFlags.IS_REACTIVE]){
        //如果目标是一个代理对象，那么一定被代理过了，会走get
        return target
        //如果有这个字段，我们就直接返回，不要代理了
    }


    //常见的一种缓存机制，使用对象映射表缓存起来，下次使用的时候再进行返回
    let existingProxy = reactiveMap.get(target)
    if(existingProxy){
        return existingProxy;
    }
    //并没有重新定义属性，只是代理，在取值的时候，会调用get，赋值的时候会调用set
    //第一次普通对象代理，我们会通过new Proxy代理一次
    //下一次，你传递的是proxy,我们可以看一下它有没有代理过，如果访问这个proxy有get方法时就说明访问过了
    const proxy = new Proxy(target, mutableHandlers)
    reactiveMap.set(target,proxy);   //把原对象和代理对象关联起来
    return proxy
}

//============================测试代码================================
// let target = {
//     name:'zf',
//     get alias(){
//         console.log(this)
//         return this.name
//     }
// }
//
//
// const proxy = new Proxy(target, {
//     get(target,key,receiver) {
//         //target:我要代理(服务)的对象，从谁的身上取值
//         //key:代理对象的哪个属性
//         //receiver：代表当前的代理对象——可以改变调用取值时的this指向
//         //去代理对象上取值 就走get
//         console.log(key,'key')
//         // return target[key]
//         return Reflect.get(target,key,receiver)
//         //使用Reflect进行反射
//     },
//     set(target,key,value,receiver) {
//         //去代理上设置值，执行set
//         // target[key] = value
//         // return true
//         return Reflect.set(target,key,value,receiver)
//     }
//
// })
// proxy.alias
//去alias上取了值时，也访问到了name,但是没有监控到name
//解决方法：使用Reflect

//我在页面中使用了alias对应的值，稍后name变化了，要重新渲染吗？——需要的
//============================测试代码================================