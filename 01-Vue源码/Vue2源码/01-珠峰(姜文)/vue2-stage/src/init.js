/**
 * @Author: liming
 * @Date: 2022-07-18 21:40:44
 * @LastEditTime: 2022-07-18 21:40:44
 * @FilePath: \vue2-stage\src\init.js
 */

import { initState } from "./state";
import {compileToFunction} from "./compiler";

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

        if (options.el) {
            //挂载我们的应用
            vm.$mount(options.el)   //实现数据的挂载
        }
    }

    Vue.prototype.$mount = function (el) {
        const vm = this;
        el = document.querySelector(el);
        let ops = vm.$options
        if (!ops.render) {  //先进行查找有没有render函数
            let template; //没有render看一下是否写了template,没写template，采用外部的template
            if (!ops.template && el) { //没有写模板，但是写了el
                //没有写模板，但是写了el
                template = el.outerHTML;
            } else {
                if (el) {
                    template = ops.template;  //如果有el,则采用模板的内容
                }
            }

            //写了template就用写了的template
            if (template) {
                //如果有模板，才做模板编译
                const render = compileToFunction(template)
                ops.render = render  //JSX最终会被编译成h('xxx')
            }
            // console.log(template, 'template')
        }
        ops.render //最终就可以获取render方法

        //script标签引用的vue.global.js 这个编译过程是在浏览器运行的
        //runtime是不包含模板编译的，整个编译时打包的时候通过loader来转义.vue文件的
        //用runtime时，不能使用template
    }
}

