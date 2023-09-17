import { EMPTY_OBJ, hasChanged, isObject } from '../../shared/src'
import { isReactive } from '../../reactivity/src/reactive'
import { queuePreFlushCb } from './scheduler'
import { ReactiveEffect } from '../../reactivity/src/effect'

/**
 * @Author liming
 * @Date 2023/7/7 16:13
 **/

export interface WatchOptions<immediate = boolean>{
  immediate?:immediate
  deep?:boolean
}
export function watch(source,cb:Function,options?:WatchOptions){
  return doWatch(source,cb,options)
}

function doWatch(source,cb:Function,{immediate,deep}:WatchOptions = EMPTY_OBJ){
  let getter:()=>any
  if(isReactive(source)){
    getter = ()=>source
    deep = true
  }else{
    getter = ()=>{}
  }

  if(cb && deep){
    const baseGetter = getter
    // getter = () => baseGetter()
    getter = () => traverse(baseGetter())
  }

  let oldValue = {}

  const job = ()=>{
    //job的实现本质上是达到newValue
    if(cb){
      const newValue = effect.run()
      if(deep || hasChanged(newValue,oldValue)){
        cb(newValue,oldValue)
        oldValue = newValue
      }
    }
  }

  let scheduler = ()=>queuePreFlushCb(job)

  const effect = new ReactiveEffect(getter,scheduler)

  if(cb){
    if(immediate){
      job()
    }else{
      oldValue = effect.run()
    }
  }else{
    effect.run()
  }
  return ()=>{
    effect.stop()
  }
}

export function traverse(value:unknown){
  if(!isObject(value)){
    return value
  }
  for(const key in value as Object){
    traverse((value as object)[key])
  }
  return value
}
