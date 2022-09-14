/*
 * @Author: liming
 * @Date: 2022-07-18 21:10:25
 * @LastEditTime: 2022-07-18 21:10:30
 * @FilePath: \vue2-stage\rollup.config.js
 */

//rollup默认可以导出一个对象，作为打包的配置文件
//注意：所有的插件都是函数，不管是什么语法,执行它就对了
import babel from 'rollup-plugin-babel'
export default {
    //打包入口
    input: './src/index.js',
    //打包出口
    output: {
        file: './dist/vue.js',
        name: 'Vue',  //打包后全局增加一个Vue属性,global.Vue,
        format: 'umd',   //ESM ES6模块 CommonJS模块  IIFE自执行函数 UMD(兼容CommonJS,AMD,IIFE)
        sourcemap:true,   //希望可以调试源代码
    },
    plugins: [
        babel({
            exclude:'node_modules/**'   //排除node_modules下的所有文件,**表示任意文件，任意文件夹
        })
    ]
}

//为什么Vue2只能支持IE9以上？——因为Object.defineProperty不支持低版本浏览器
//Proxy是ES6的，也没有替代方案