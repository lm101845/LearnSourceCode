/**
 * @Author liming
 * @Date 2022/11/7 16:14
 **/
import {activeEffect} from "./effect";

export const enum ReactiveFlags{
    IS_REACTIVE = '__v__isReactive'
}
export const mutableHandlers = {
    //注意：操作proxy,不影响target
    get(target,key,receiver) {
        if(key === ReactiveFlags.IS_REACTIVE){
            return true;
        }
        //target:我要代理(服务)的对象，从谁的身上取值
        //key:代理对象的哪个属性
        //receiver：代表当前的代理对象
        //去代理对象上取值 就走get
        // return target[key]
        //这里可以监控到用户取值了
        return Reflect.get(target,key,receiver)
    },
    set(target,key,value,receiver) {
        //去代理上设置值，执行set
        // target[key] = value
        // return true
        //这里可以监控到用户设置值了
        return Reflect.set(target,key,value,receiver)
    }
}