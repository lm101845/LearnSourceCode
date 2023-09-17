/**
 * @Author liming
 * @Date 2023/4/19 9:44
 **/
import { ReactiveEffect } from './effect'

export type Dep = Set<ReactiveEffect>

export const createDep = (effects?:ReactiveEffect[]) :Dep=>{
  const dep = new Set<ReactiveEffect>(effects) as Dep;
  return dep;
}