/**
 * @Author liming
 * @Date 2023/5/16 16:04
 **/
import { isFunction } from '../../shared/src'
import { Dep } from './dep'
import { ReactiveEffect } from './effect'
import { trackRefValue } from './ref'

export class ComputedRefImpl<T>{
  public dep?: Dep = undefined
  private _value !: T
  public readonly effect :ReactiveEffect<T>
  public readonly __v_ifRef = true
  constructor(getter) {
    this.effect = new ReactiveEffect(getter)
    this.effect.computed = this
  }

  get value(){
    trackRefValue(this)
    this._value = this.effect.run()
    return this._value
  }

  // set value(){
  //
  // }
}
export function computed(getterOrOptions){
  let getter;
  const onlyGeter = isFunction(getterOrOptions)

  if(onlyGeter){
    getter = getterOrOptions;
  }

  const cRef = new ComputedRefImpl(getter)

  return cRef
}
