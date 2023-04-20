/**
 * @Author liming
 * @Date 2023/4/13 11:42
 **/
import { track, trigger } from './effect'

const get = createGetter();

function createGetter(){
  return function get(target:object,key:string | symbol,receiver:object){
    //`receiver` 是可选的，用于指定 getter 函数中的 `this` 值
    const res = Reflect.get(target,key,receiver);
    //使用 `Reflect.get()` 方法获取属性值时，会调用对象的原有 getter 函数，而不是替换后的新函数。
    //而直接修改 getter 函数则会替换原有的 getter 函数，使得后续的属性访问都会调用新函数。
    //只有在代理对象上执行这些操作才会触发捕获器。在目标对象上执行这些操作仍然会产生正常的行为

    track(target,key);   //getter时收集依赖
    return res;
  }
}

const set = createSetter();

function createSetter(){
  return function set(target:object,key:string | symbol,value:unknown,receiver:object){
    //unknown 类型只能被赋值给 any 类型和 unknown 类型本身。
    const result:boolean = Reflect.set(target,key,value,receiver)
    trigger(target,key,value);   //setter时触发依赖
    return result
  }
}

export const mutableHandlers:ProxyHandler<object> = {
  get,
  set
}


