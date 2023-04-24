/**
 * @Author liming
 * @Date 2023/3/1 18:19
 **/

/**
 * 判断是否是一个数组
 */

export const isArray = Array.isArray

export const isObject = (val:unknown) =>{
  return val != null && typeof val === 'object';
}

/**
 * 对比2个数据是否发生改变
 * @param value
 * @param oldValue
 */
export const hasChanged = (value:any,oldValue:any):boolean=> !Object.is(value,oldValue)
//Object.is() 方法判断两个值是否为同一个值。