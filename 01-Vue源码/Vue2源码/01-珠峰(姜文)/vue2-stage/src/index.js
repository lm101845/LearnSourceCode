/**
 * @Author: liming
 * @Date: 2022-07-18 21:12:21
 * @LastEditTime: 2022-07-18 21:12:21
 * @FilePath: \vue2-stage\src\index.js
 */

// export const a = 100;
// export default {
//     a : 1
// }

//类的特点：将所有的方法都耦合在一起,Vue源码没有采用这种方法，采用的是构造函数
// class Vue{
//     xxx(){}
//     xxx(){}
//     xxx(){}
//     xxx(){}
//     xxx(){}
// }

import { initMixin } from "./init"

initMixin(Vue)  //扩展了init方法

//options就是用户的选项——拿到options以后，进行Vue的初始化
function Vue(options) {
    this._init(options)
}


export default Vue