/**
 * @Author liming
 * @Date 2023/9/17 22:07
 **/


// @ts-ignore
import {REACT_ELEMENT_TYPE} from '/shared/ReactSymbols'
// @ts-ignore
import {Type,Key,Ref,Props,ReactElement,ElementType} from 'shared/ReactTypes'

//ReactElement数据结构
const ReactElement = function(type:Type,key:Key,ref:Ref,props:Props):ReactElement{
  const element = {
    $$typeof:REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
    __mark:'uniqueMark'
  }
  return element
}

export const jsx = (type:ElementType,config:any,...maybeChildren:any)=>{
  let key:Key = null
  const props:Props = {}
  let ref:Ref = null

  //使用for...in不是效率很低吗
  for (const prop in config){
    const val = config[prop]
    if(prop === 'key'){
      if(val !== undefined){
        key = '' + val
      }
      continue
    }
    if(prop === 'ref'){
      if(val !== undefined){
        ref = val
      }
      continue
    }
    if({}.hasOwnProperty.call(config,prop)){
      props[prop] = val
    }
  }

  const maybeChildrenLength = maybeChildren.length
  if(maybeChildrenLength){
    if(maybeChildrenLength === 1){
      props.children = maybeChildren[0]
    }else{
      props.children = maybeChildren
    }
  }
  return ReactElement(type,key,ref,props)
}

export const jsxDev = jsx
