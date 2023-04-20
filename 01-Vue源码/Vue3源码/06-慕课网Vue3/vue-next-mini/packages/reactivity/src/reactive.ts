/**
 * @Author liming
 * @Date 2023/4/13 11:38
 **/
import { mutableHandlers } from './baseHandlers'
import { isObject } from '../../shared/src'

export const reactiveMap = new WeakMap<object,any>()

export function reactive(target:object){
  return createReactiveObject(target,mutableHandlers,reactiveMap);
}

function createReactiveObject(target:object,baseHandlers:ProxyHandler<any>,proxyMap:WeakMap<object,any>){
  const existingProxy = proxyMap.get(target)
  // console.log(existingProxy,'打印existingProxy')
  if(existingProxy){
    return existingProxy;
  }
  const proxy = new Proxy(target,baseHandlers)
  proxyMap.set(target,proxy)   //target为key,proxy为value
  return proxy;
}

export const toReactive = <T extends unknown>(value:T):T =>{
  return isObject(value) ? reactive(value as Object) : value;
}