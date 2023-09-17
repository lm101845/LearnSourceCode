/**
 * @Author liming
 * @Date 2023/7/16 17:09
 **/
import { isArray, isFunction, isString } from '../../shared/src'
import { ShapeFlags } from '../../shared/src/shapeFlags'

export interface VNode{
  __v_isVNode:true
  type:any
  props:any
  children:any
  shapeFlag:number
}

export function isVNode(value:any):value is VNode{
  return value ? value.__v_isVNode === true :false
}

export function createVNode(type,props,children):VNode {
  const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0
  return createBaseVNode(type,props,children,shapeFlag)
}

function createBaseVNode(type,props,children,shapeFlag){
  const vnode = {
    __v_isVNode:true,
    type,
    props,
  }as VNode

  normalizeChildren(vnode,children)
  return vnode
}

export function normalizeChildren(vnode:VNode,children:unknown){
  let type = 0
  if(children === null){
    children = null
  }else if(isArray(children)){
    type = ShapeFlags.ARRAY_CHILDREN
  }else if(typeof children === 'object'){

  }else if(isFunction(children)){

  }else{
    children = String(children)
    type = ShapeFlags.TEXT_CHILDREN
  }
  vnode.children = children
  vnode.shapeFlag |= type     //按位或运算
}
