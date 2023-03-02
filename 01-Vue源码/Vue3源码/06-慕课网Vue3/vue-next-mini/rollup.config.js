//默认导出一个数组，数组的每一个对象都是一个单独的导出配置
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
export default [
  {
      //入口文件
      input:'packages/vue/src/index.ts',
      output:[
        //导出一个iife格式的包(可以导出格式的包有很多,如esm等)
        {
          //开启sourceMap
          sourcemap:true,
          //导出文件地址
          file:'./packages/vue/dist/vue.js',
          //生成包的格式
          format:'iife',
          //变量名：
          name:'Vue'
        }
      ],
      //插件
      plugins:[
        //ts
        typescript({
          sourceMap: true
        }),
        //模块导入的路径补全插件
        resolve(),
        //转commonjs为ESM
        commonjs()
      ]
  }
]