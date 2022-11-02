/**
 * @Author liming
 * @Date 2022/11/2 17:12
 **/
const args = require('minimist')(process.argv.slice(2))

const {resolve} = require("path");   //node中的内置模块
//node scripts/dev.js reactivity -f global
//minimist是用来解析命令行参数的(前2个参数我们不要，所以用slice去掉)
console.log(args)

const {build} = require("esbuild");

const target = args._[0] || "reactivity"

const format = args.f || "global"

//开发环境，只打包某一个(构建工具rollup可以同时打包多个)
const pkg = require(resolve(__dirname, `../packages/${target}/package.json`))

//输出格式
//iife:立即执行函数
//cjs node中的模块  module.exports
//esm 浏览器中的esModule模块  import
const outputFormat = format.startsWith('global') ? 'iife' : format === 'cjs' ? 'cjs' : 'esm'

const outfile = resolve(__dirname, `../packages/${target}/dist/${target}.${format}.js`)

//天生就支持TS(不会校验TS写的对不对，所以块)
build({
    entryPoints:[ resolve(__dirname, `../packages/${target}/src/index.ts`)],
    outfile,
    bundle:true,  //把所有的包全部打包到一起
    sourcemap:true,
    format:outputFormat,  //输出的格式
    globalName: pkg.buildOptions?.name,   //打包的全局的格式
    platform:format === 'cjs'? 'node':'browser',  //平台
    watch:{   //监控文件变化
       onRebuild(error){
            if (!error) console.log('rebuilt~~~~')
       }
    }
}).then(()=>{
    console.log('wathcing~~~')
})