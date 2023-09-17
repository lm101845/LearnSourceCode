/**
 * @Author liming
 * @Date 2023/4/13 15:31
 **/
import { createDep, Dep } from './dep'
import { extend, isArray } from '../../shared/src'
import { ComputedRefImpl } from './computed'

export type EffectScheduler = (...args:any[])=>any
// type KeyToDepMap = Map<any,ReactiveEffect>;
type KeyToDepMap = Map<any,Dep>;

const targetMap = new WeakMap<any,KeyToDepMap>()

export interface ReactiveEffectOptions{
  lazy?:boolean
  scheduler?:EffectScheduler
}

//effect形参是一个函数,执行时会调用ReactiveEffect类，将这个函数形参作为参数传递，生成一个对象
export function effect<T = any>(fn:()=>T,options?:ReactiveEffectOptions){
  // debugger
  const _effect = new ReactiveEffect(fn)
  if(options){
    extend(_effect,options)  //合并
  }
  if(!options || !options.lazy){
    _effect.run();
  }
}

export let activeEffect:ReactiveEffect | undefined



/**
 * ReactiveEffect类表示响应式函数，其构造函数接收一个函数参数fn，表示要执行的响应式函数。
 * 类中定义了一个方法run，用于执行响应式函数，并将当前的ReactiveEffect实例标记为被激活的effect。
 */
export class ReactiveEffect<T = any>{
  computed?:ComputedRefImpl<T>
  constructor(public fn:()=>T,public scheduler:EffectScheduler | null = null) {}
  run(){
    // debugger
    activeEffect = this;   //标记当前是被激活的effect
    // console.log(activeEffect,' activeEffect = this--标记当前是被激活的effect')
    return this.fn();
  }

  stop(){}
}

//收集依赖
export function track(target:object,key:unknown){
  // console.log('收集依赖')
  if(!activeEffect) return;
  let depsMap = targetMap.get(target)
  if(!depsMap){
    targetMap.set(target,(depsMap = new Map()));
  }
  let dep = depsMap.get(key)
  // depsMap.set(key,activeEffect)
  if(!dep){
    depsMap.set(key,(dep = createDep()))
  }
  trackEffects(dep)
  // console.log(targetMap,'打印收集到的targetMap')
}

/**
 * 利用dep依次跟踪指定key的所有effect
 */
export function trackEffects(dep:Dep){
  dep.add(activeEffect!)
}
//触发依赖
export function trigger(target:object,key:unknown,newValue:unknown){
  // console.log('触发依赖')
  const depsMap = targetMap.get(target)
  if(!depsMap) return;
  // const effect = depsMap.get(key) as ReactiveEffect;
  const dep:Dep | undefined = depsMap.get(key);

  // if(!effect) return;
  //
  // effect.fn();

  if(!dep) return;
  triggerEffects(dep);
}

/**
 * 依次触发dep中保存的依赖
 * @param dep
 */
export function triggerEffects(dep:Dep){
  const effects = isArray(dep) ? dep : [...dep];
  //依次触发依赖
  // for(const effect of effects){
  //   triggerEffect(effect)
  // }

  //解决死循环问题，2次for循环
  for (const effect of effects) {
    if (effect.computed) {
      triggerEffect(effect)
    }
  }

  for (const effect of effects) {
    if (!effect.computed) {
      triggerEffect(effect)
    }
  }
}

/**
 * 触发指定依赖
 * @param effect
 */
export function triggerEffect(effect:ReactiveEffect){
  if(effect.scheduler){
    effect.scheduler()
  }else {
    effect.run()
  }
}
