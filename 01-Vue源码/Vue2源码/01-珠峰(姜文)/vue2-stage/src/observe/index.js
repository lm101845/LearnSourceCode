/**
 * @Author liming
 * @Date 2022/9/14 20:09
 **/
import {newArrayProto} from "./array";

class Observer {
    constructor(data) {
        // debugger
        Object.defineProperty(data,'__ob__',{
            //将__ob__变成不可枚举的属性(循环的时候无法获取，解决死循环问题)
            value:this,
            enumerable:false
        })
        //data.__ob__ = this;  //给数据加了一个标识，如果数据上有__ob__，则说明这个属性被观测过了
        // console.log(data, 'Observer构造函数中的data')
        //object.defineProperty只能劫持已经存在的属性，后增的，或者删除的，就不知道了，无法劫持
        //vue2里面为此写了一些api进行修复，例如$set,$delete等

        //看一个data是否是数组
        if (Array.isArray(data)) {
            //需要保留数组原有的特性，并且可以重写数组中的部分方法
            // data.__proto__ = {
            //     push(){
            //         console.log('重写的push方法')
            //     }
            // }

            //这里我们可以重写数组中的方法，Vue里面只重写了7个
            //7个变异方法，是可以修改数组本身的
            // debugger
            this.observeArray(data)
            //如果数组中放的是对象，可以监控到对象的变化
            data.__proto__ = newArrayProto
        } else {
            this.walk(data);
        }
    }

    //观测对象，对属性依次劫持，重新定义，性能差
    walk(data) {
        //重新定义属性——Vue2的性能瓶颈在这里，重写影响性能
        Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
    }

    //观测数组
    observeArray(data) {
        data.forEach(item => observe(item))
        //把数组中的每一项都进行观测
    }
}

//把当前的目标属性给重新定义
//闭包，属性劫持
export function defineReactive(target,key,value){
    //value可能是个对象，我们需要继续劫持
    observe(value)
    Object.defineProperty(target,key,{
        //取值的时候，执行get,拦截用户操作
        get(){
            // console.log('defineReactive函数中get方法--用户取值了')
            console.log(key,'key')
            return value
        },
        //修改值的时候，执行set,拦截用户操作
        set(newValue){
            // console.log('defineReactive函数中set方法--用户设置值了')
            if(newValue === value) return
            value = newValue
        }
    })
}

export function observe(data){
    // console.log(data, 'observe函数中的data')
    //对这个对象进行劫持——特殊情况(不是对象则不劫持)
    if(typeof data !== 'object' || data == null){
        return;  //只对对象进行劫持
    }

    if(data.__ob__ instanceof Observer){
        //说明这个对象被代理过了
        return data.__ob__;
    }
    //如果一个对象被劫持过了，那就不需要再被劫持了(要判断一个对象是否被劫持过,可以增添一个实例，用实例判断是否被劫持)
    return new Observer(data);
}
