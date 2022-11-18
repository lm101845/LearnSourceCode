/**
 * @Author liming
 * @Date 2022/11/16 15:50
 **/
import applyMixin from './mixin'
import {forEach} from "./util";


let Vue
//最终用户拿到的是这个类的实例
class Store {
    //这个类用于接收用户选项
    constructor(options) {
        debugger
        console.log(options, '--options')
        // this.state = options.state;  //用户传递过来的状态
        //缺陷：如果直接将state定义在实例上，稍后这个状态发生变化，视图是不会更新的
        let state = options.state;  //用户传递过来的状态
        //1.getters:其实写的是方法，但是取值的时候是属性
        //解决方法：使用Object.defineProperty去定义属性
        // this.getters = options.getters;
        this.getters = {}
        const computed = {}
        //只要用户一取值，就会走这个方法
        forEach(options.getters, (fn, key) => {
            console.log(options.getters,'options.getters')
            console.log(fn,'fn',key,'key')
            computed[key] =  (params)=>{   //通过计算属性实现懒加载
                //计算属性也是一个方法，用做缓存
                return fn(this.state);
                //把函数的返回结果放到这里
            }
            Object.defineProperty(this.getters, key, {
                get: () => this._vm[key]
            })
        })

        //vue-router是用defineReactive,不过它只定义了一个属性
        //observer
        //Vue中定义数据，属性名是有特点的，如果属性名是通过$xxx命名的，它不会被代理到Vue实例上
        this._vm = new Vue({
            //这个代码一写,Vuex就只能用在Vue里面了
            data: {  //$$表示内部的状态，你不能通过实例.$$state来拿
                $$state: state
            },
            computed   //计算属性会将自己的属性放到实例上
        })
        // console.log(this._vm,'this._vm')

        //使用发布订阅模式,将用户订阅的mutation和action先保存起来，稍后，
        // 当调用commit时,就找订阅的mutation方法,调用dispatch,就找对应的action方法
        this._mutations = {};
        //我先订阅一个函数
        forEach(options.mutations,(fn,type)=>{
            this._mutations[type] = (payload)=>{
                fn.call(this,this.state,payload)
            }
        })

        this._actions = {}
        forEach(options.actions,(fn,type)=>{
            this._actions[type] = (payload)=>{
                fn.call(this,this,payload)
            }
        })
    }

    //用箭头函数处理this的问题
    //你调commit的时候，就找对应的函数，让它执行
    commit = (type,payload)=>{
        debugger
        this._mutations[type](payload)
    }

    dispatch = (type,payload)=>{
        debugger
        this._actions[type](payload)
    }
    //类的属性访问器:当用户去这个实例上取state属性时,会执行此方法
    get state(){
        // return this._vm.$$state;
        //不能这样拿，拿不到,$$state可以通过_data去拿
        return this._vm._data.$$state;
    }
}
//install主要用于安装
//vue使用install函数把组件做成插件
const install = (_Vue)=>{
    Vue = _Vue;
    console.log('install')
    //vue-router调用Install目的？ 注册了全局组件 注册原型方法  mixin=>router示例绑定给了所有组件
    applyMixin(Vue)
}

export {
    Store,
    install
}