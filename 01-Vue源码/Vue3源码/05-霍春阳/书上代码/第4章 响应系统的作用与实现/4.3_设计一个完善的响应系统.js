/**
 * 例如在上一节的实
 * 现中，我们硬编码了副作用函数的名字（effect），导致一旦副作用
 * 函数的名字不叫 effect，那么这段代码就不能正确地工作了。而我们
 * 希望的是，哪怕副作用函数是一个匿名函数，也能够被正确地收集到
 * “桶”中。为了实现这一点，我们需要提供一个用来注册副作用函数的
 * 机制，如以下代码所示：
 * (看的时间挺长的，但是感觉还是没有完全明白，尤其是那个weakMap,Set这些)
 */

//原对象
const data = {text: 'hello world'}

// 用一个全局变量存储被注册的副作用函数
let activeEffect = undefined;

// 重新定义了effect 函数，它变成了一个用于注册副作用函数的函数
function effect(fn) {
    // 当调用 effect 注册副作用函数时，将副作用函数 fn 赋值给activeEffect
    activeEffect = fn
    // 执行副作用函数
    fn()
}

/**
 * 可以看到，我们使用一个匿名的副作用函数作为 effect 函数的
 * 参数。当 effect 函数执行时，首先会把匿名的副作用函数 fn 赋值给
 * 全局变量 activeEffect。接着执行被注册的匿名副作用函数 fn，
 * 这将会触发响应式数据 obj.text 的读取操作，进而触发代理对象
 * Proxy 的 get 拦截函数
 *
 */

// const bucket = new Set() // 副作用函数的桶

const bucket = new WeakMap()
/**
 * 副作用函数的桶 使用WeakMap,key为target对象,value为Map
 * WeakMap 的键是原始对象 target，WeakMap 的值是一个
 * Map 实例，而 Map 的键是原始对象 target 的 key，Map 的值是一个
 * 由副作用函数组成的 Set。
 */
console.log(bucket, '初始bucket')
/**
 * WeakMap是一种特殊的映射，它具有与Map类似的功能，但键是弱引用，并且不可遍历。
 * 这意味着无法使用for-of循环来遍历WeakMap中的条目，也无法使用
 * Object.keys()、Object.values()或Object.entries()来访问它们。
 *
 * WeakMap的一个主要用途是为了防止内存泄漏。因为键是弱引用，所以只要没有其他的引用指向该键，
 * 它就可以被垃圾回收。这使得WeakMap特别适合存储与对象相关的数据，
 * 并且只有对象本身存在时，才希望这些数据存在。
 *
 * Set是一种特殊的数据结构，它由一组唯一的值组成，这些值可以是任何类型的值，
 * 包括对象。Set支持遍历，因此可以使用for-of循环遍历Set中的值。
 * Set还支持添加、删除和检查值的存在性。
 *
 * 总的来说，WeakMap是一种特殊的映射，用于防止内存泄漏，而Set是一种特殊的数据结构，
 * 用于存储唯一的值。
 *
 * Map中的键可以是任意类型的值，包括对象。WeakMap中的键必须是对象，且是弱引用，
 * 也就是说，只要没有其他的引用指向该对象，它就可以被垃圾回收。
 */

/**
 * 从这段代码可以看出构建数据结构的方式，我们分别使用了
 * WeakMap、Map 和 Set：
 * WeakMap 由 target --> Map 构成；
 * Map 由 key --> Set 构成。
 */
const obj = new Proxy(data, {
    // 拦截读取操作
    //get函数一共执行了2次，第一次是执行了effect函数，第二次是执行了setTimeout函数
    //这2个函数都修改了obj.text
    get(target, property, receiver) {
        console.log(target === data, '这里的target就是data吧');
        track(target, property)
        return Reflect.get(...arguments)
        //return Reflect.get(...arguments)和return target[key]是等价写法
    },
    // 拦截设置操作
    set(target, property, value, receiver) {
        Reflect.set(...arguments) // 设置属性值
        // console.log(...arguments, '打印参数')
        trigger(target, property) // 把副作用函数取出并执行
        return Reflect.set(...arguments)
    }
})

// track函数
function track(target, key) {
    if (!activeEffect) return target[key]
    // 没有正在执行的副作用函数 直接返回
    console.log(bucket,'track函数里面的bucket')
    //bucket第一次是空的WeakMap{}
    let depsMap = bucket.get(target)
    console.log(depsMap, 'track函数里面的depsMap')
    //depsMap第一次是undefined
    // 如果不存在 depsMap，那么新建一个 Map 并与 target 关联
    if (!depsMap) {
        // 不存在(第一次的时候)，则创建一个Map
        bucket.set(target, depsMap = new Map())
        //depsMap是一个Map集合
        console.log(bucket, '新创建的bucket')
        //此时bucket的key：{text: 'hello Vue3'}，value:Map(1) {'text' => Set(1)}
        //它的value为什么是Map(1) {'text' => Set(1)}？？？？
    }
    let deps = depsMap.get(key)
    //deps是depsMap这个Map集合的key
    console.log(deps, 'deps')
    //undefined
    //再根据 key 从 depsMap 中取得 deps，它是一个 Set 类型，
    //里面存储着所有与当前 key 相关联的副作用函数：effects
    if (!deps) {
        // 如果 deps 不存在，同样新建一个 Set 并与 key 关联
        depsMap.set(key, (deps = new Set()))
        console.log(depsMap,'depsMap',deps,'deps')
        //{'text' => Set(0)};Set(0){size: 0}
    }
    //最后将当前激活的副作用函数添加到“桶”里
    deps.add(activeEffect)
    console.log(deps,'添加副作用函数的deps')
    //Set(1){fn}
}

// trigger函数
function trigger(target, key) {
    const depsMap = bucket.get(target)
    console.log('set函数中的depsMap',depsMap)
    // target Map
    //根据 target 从桶中取得 depsMap，它是 key --> effects
    if (!depsMap) return true;
    const effects = depsMap.get(key)
    console.log('set函数中的effects',effects)
    // effectFn Set
    //根据 key 取得所有副作用函数 effects
    effects && effects.forEach(fn => fn())
    //执行副作用函数
    return true // 返回true
}

//我们可以按照如下所示的方式使用 effect 函数
// 执行副作用函数，触发读取
/**
 * 可以看到，我们使用一个匿名的副作用函数作为 effect 函数的
 * 参数。当 effect 函数执行时，首先会把匿名的副作用函数 fn 赋值给
 * 全局变量 activeEffect。接着执行被注册的匿名副作用函数 fn，
 * 这将会触发响应式数据 obj.text 的读取操作，进而触发代理对象
 * Proxy 的 get 拦截函数：
 */
effect(
    // 一个匿名的副作用函数
    () => {
    document.body.innerText = obj.text
    //注意：这里修改的是obj,即生成的代理对象的text属性，我之前写成data.text了......
})

console.log(activeEffect,'执行副作用函数后此时打印activeEffect')

// 1 秒后修改响应式数据
setTimeout(() => {
    obj.text = 'hello Vue3'
}, 3000)
