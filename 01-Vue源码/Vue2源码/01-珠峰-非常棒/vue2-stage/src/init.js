/**
 * @Author: liming
 * @Date: 2022-07-18 21:40:44
 * @LastEditTime: 2022-07-18 21:40:44
 * @FilePath: \vue2-stage\src\init.js
 */

import { initState } from "./state";

//给Vue增加init方法
export function initMixin(Vue) {
    //用户初始化操作
    Vue.prototype._init = function (options) {
        //vue vm.$options 就是获取用户的配置
        //我们使用Vue的时候 $nextTick $data $attr
        const vm = this; 
        vm.$options = options;  //将用户的选项挂载到实例上
        //为了想让用户配置大家都能拿到，所以给它放到实例里面
        //$表示是用户实例里面的变量

        //初始化状态
        initState(vm);
        //TODO:编译模板，创建虚拟DOM,真实DOM等,以后再写
    }
}

