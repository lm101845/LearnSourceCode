/**
 * @Author liming
 * @Date 2023/4/13 15:31
 **/
import { createDep, Dep } from './dep'
import { isArray } from '../../shared/src'
import { ComputedRefImpl } from './computed'

// type KeyToDepMap = Map<any,ReactiveEffect>;
type KeyToDepMap = Map<any,Dep>;

const targetMap = new WeakMap<any,KeyToDepMap>()
export function effect<T = any>(fn:()=>T){
  const _effect = new ReactiveEffect(fn)
  _effect.run();
}

export let activeEffect:ReactiveEffect | undefined

/**
 * ReactiveEffect类表示响应式函数，其构造函数接收一个函数参数fn，表示要执行的响应式函数。
 * 类中定义了一个方法run，用于执行响应式函数，并将当前的ReactiveEffect实例标记为被激活的effect。
 */
export class ReactiveEffect<T = any>{
  computed?:ComputedRefImpl<T>
  constructor(public fn:()=>T) {}
  run(){
    activeEffect = this;   //标记当前是被激活的effect
    return this.fn();
  }
}
//收集依赖
export function track(target:object,key:unknown){
  console.log('收集依赖')
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
  console.log(targetMap,'打印收集到的targetMap')
}

/**
 * 利用dep依次跟踪指定key的所有effect
 */
export function trackEffects(dep:Dep){
  dep.add(activeEffect!)
}
//触发依赖
export function trigger(target:object,key:unknown,newValue:unknown){
  console.log('触发依赖')
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
  for(const effect of effects){
    triggerEffect(effect)
  }
}

/**
 * 触发指定依赖
 * @param effect
 */
export function triggerEffect(effect:ReactiveEffect){
  effect.run()
}
