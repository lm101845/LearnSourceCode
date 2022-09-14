/**
 * @Author liming
 * @Date 2022/9/14 20:09
 **/
class Observer {
    constructor(data) {
        //object.defineProperty只能劫持已经存在的属性，后增的，或者删除的，就不知道了，无法劫持
        //vue2里面为此写了一些api进行修复，例如$set,$delete等
        this.walk(data);
    }

    //循环对象，对属性依次劫持，重新定义，性能差
    walk(data) {
        //重新定义属性——Vue2的性能瓶颈在这里，重写影响性能
        Object.keys(data).forEach(key => defineReactive(data,key,data[key]))
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
            console.log('用户取值了')
            return value
        },
        //修改值的时候，执行set,拦截用户操作
        set(newValue){
            console.log('用户设置值了')
            if(newValue === value) return
            value = newValue
        }
    })
}

export function observe(data){
    //对这个对象进行劫持——特殊情况(不是对象则不劫持)
    if(typeof data !== 'object' || data == null){
        return;  //只对对象进行劫持
    }
    //如果一个对象被劫持过了，那就不需要再被劫持了(要判断一个对象是否被劫持过,可以增添一个实例，用实例判断是否被劫持)
    return new Observer(data);
}
