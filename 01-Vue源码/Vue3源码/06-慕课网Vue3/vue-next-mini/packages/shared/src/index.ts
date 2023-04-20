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