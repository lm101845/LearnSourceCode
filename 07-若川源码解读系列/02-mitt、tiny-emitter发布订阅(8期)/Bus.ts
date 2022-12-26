/**
 * @Author liming
 * @Date 2022/12/19 8:53
 **/

type BusClass = {
    emit:(name:string)=>void
    on:(name:string,callback:Function)=>void
}

type ParamKey = string | number | symbol;

type List = {
    [key:ParamKey]:Array<Function>
}

/**
 * 这是一个 TypeScript 类型定义。它定义了一个名为 List 的类型，该类型是一个对象，其中键为 ParamKey 类型，值为一个包含函数的数组。
 *
 * 具体来说，List 是一个对象，它有一个或多个键，这些键的类型为 ParamKey，而每个键所对应的值是一个函数数组。
 * 每个键-值对都是 List 对象的一个属性。
 *
 * 例如，你可以创建一个名为 list 的变量，并声明它的类型为 List：
 *
 * const list: List = {};
 * 然后，你可以将函数添加到 list 对象的属性中：
 *
 * list.key1 = [function() { console.log('Hello, world!') }];
 * 在这种情况下，list 对象具有一个名为 key1 的属性，该属性是一个包含一个函数的数组。
 */
class Bus implements BusClass{
    /**
     * 你可以在 TypeScript 中使用类型来实现接口
     * 注意，在这里我们使用了 TypeScript 的类型别名（type 关键字）来定义 BusClass，
     * 而不是接口（interface 关键字）。这两者在大多数情况下是等价的，但是在某些情况下，类型别名可能更方便。
     */
    constructor() {
        this.list = {}
    }

    list:List
    emit(name:string,...args:Array<any>){
        let eventName:Array<Function> = this.list[name]
        eventName.forEach(fn=>{
            fn.apply(this,args)
            //这个args正好是一个数组
        })
    }

    on(name:string,callback:Function){
        let fn:Array<Function> = this.list[name] || []
        fn.push(callback)
        this.list[name] = fn;
    }
}

export default new Bus()
