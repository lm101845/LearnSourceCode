/**
 * @Author liming
 * @Date 2023/9/17 22:10
 **/

//判断是否支持Symbol特性
const supportSymbol = typeof Symbol === 'function' && Symbol.for

export const REACT_ELEMENT_TYPE = supportSymbol ? Symbol.for('react.element') : 0xeac7
