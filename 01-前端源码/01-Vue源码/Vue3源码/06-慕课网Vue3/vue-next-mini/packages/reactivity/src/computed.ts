/**
 * @Author liming
 * @Date 2023/5/16 16:04
 **/
import { isFunction } from '../../shared/src'
import { Dep } from './dep'
import { ReactiveEffect } from './effect'
import { trackRefValue, triggerRefValue } from './ref'

export class ComputedRefImpl<T>{
  public dep?: Dep = undefined
  private _value !: T
  public readonly effect :ReactiveEffect<T>
  public readonly __v_ifRef = true
  public _dirty = true    //脏变量，默认为true,表示我们需要执行run方法
  constructor(getter) {
    console.log(getter,'打印getter')
    // debugger
    //构造函数内部又创建了ReactiveEffect实例，并把getter传递进来了
    this.effect = new ReactiveEffect(getter,()=>{
      if(!this._dirty){
        this._dirty = true
        triggerRefValue(this)
      }
    })
    this.effect.computed = this
  }

  /**
   *  get方法用于获取属性的值，它会被自动调用，当我们通过类的实例(new ComputedRefImpl时)访问属性时，实际上是调用了该属性的get方法。
   */
  get value(){
    console.log('get方法')
    trackRefValue(this)
    if(this._dirty){
      //只有脏状态为true,我们才需要执行get函数
      this._dirty = false
      this._value = this.effect.run()
    }
    return this._value
  }

  // set value(){
  //
  // }
}
export function computed(getterOrOptions){
  // debugger
  let getter;
  //判断形参是否是函数
  const onlyGeter = isFunction(getterOrOptions)

  if(onlyGeter){
    getter = getterOrOptions;
  }

  //把函数当成getter传给类ComputedRefImpl了，到时候constructor构造函数可以拿到这个参数(函数)
  const cRef = new ComputedRefImpl(getter)

  return cRef
}
