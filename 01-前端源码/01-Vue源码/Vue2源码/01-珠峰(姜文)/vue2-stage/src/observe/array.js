/**
 * @Author liming
 * @Date 2022/11/2 9:24
 **/

//我们希望重写数组中的部分方法
let oldArrayProto = Array.prototype;//获取数组的原型

//newArrayProto.__proto__ = oldArrayProto
export let newArrayProto = Object.create(oldArrayProto)

//找到所有的变异方法(可以修改原数组的方法)
//concat,slice都不会改变原来数组
let methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice'
]

methods.forEach(method=>{
    //arr.push(1,2,3)
    newArrayProto[method] = function (...args){
        //push.call(arr)
        //你调新方法，默认调原来的
        //这里重写了数组的方法
        //TODO
        const result = oldArrayProto[method].call(this,...args)
        //这个this就是arr
        //内部调用原来的方法，这个叫函数的劫持，切片编程

        // console.log(method,'method')

        //我们需要对新增的数据，再次进行劫持
        let inserted;
        let ob = this.__ob__;
        switch (method){
            case 'push':
            case "unshift":
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2)
                break;
            default:
                break;
        }
        console.log(inserted,'inserted');  //新增的内容，是数组
        if(inserted){
            //对新增的内容再次进行观测
           ob.observeArray(inserted)
        }
        return result;
    }
})
// newArrayProto.push = function (){
//
// }
//我这个方法是加在自己身上了，并没有改变数组原型的方法,所以不用担心被覆盖掉
