const data = {
    foo: true,
    bar: true
}
/**
 * 我们用全局变量 activeEffect 来存储通过 effect 函数注册的
 * 副作用函数，这意味着同一时刻 activeEffect 所存储的副作用函数
 * 只能有一个。当副作用函数发生嵌套时，内层副作用函数的执行会覆
 * 盖 activeEffect 的值，并且永远不会恢复到原来的值。这时如果再
 * 有响应式数据进行依赖收集，即使这个响应式数据是在外层副作用函
 * 数中读取的，它们收集到的副作用函数也都会是内层副作用函数，这
 * 就是问题所在。
 *
 * 为了解决这个问题，我们需要一个副作用函数栈 effectStack，
 * 在副作用函数执行时，将当前副作用函数压入栈中，待副作用函数执
 * 行完毕后将其从栈中弹出，并始终让 activeEffect 指向栈顶的副作
 * 用函数。这样就能做到一个响应式数据只会收集直接读取其值的副作
 * 用函数，而不会出现互相影响的情况
 */
let activeEffect
// 用一个全局变量存储当前激活的 effect 函数

const effectStack = []
//新增副作用函数栈

const bucket = new WeakMap()
// 副作用函数的桶 使用WeakMap
debugger
console.log(bucket,'初始bucket桶')

function effect(fn) {
    const effectFn = () => {
        // 副作用函数执行之前，将该函数从其所在的依赖集合中删除
        console.log(effectFn,'打印effect函数中的effectFn变量名')
        cleanup(effectFn)
        // 当effectFn执行时，将其设置为当前激活的副作用函数
        activeEffect = effectFn
        effectStack.push(activeEffect) // 将当前副作用函数推进栈
        debugger
        fn()
        // 当前副作用函数结束后，将此函数推出栈顶，并将activeEffect指向栈顶的副作用函数
        // 这样：响应式数据就只会收集直接读取其值的副作用函数作为依赖
        debugger
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
    }
    effectFn.deps = []
    // activeEffect.deps用来存储所有与该副作用函数相关联的依赖集合
    // 写给它设置初始值为空数组
    effectFn()
    debugger
}

function cleanup(effectFn) {
    for (let i = 0, len = effectFn.deps.length; i < len; i++) {
        console.log(effectFn.deps,'cleanup函数中打印effectFn.deps')
        let deps = effectFn.deps[i] // 依赖集合
        console.log(deps,'cleanup函数中的deps')
        //Set(1)
        deps.delete(effectFn)

    }
    effectFn.deps.length = 0 // 重置effectFn的deps数组
}

const obj = new Proxy(data, {
    get(target, p, receiver) {
        track(target, p)
        return target[p]
    },
    set(target, p, value, receiver) {
        target[p] = value
        trigger(target, p) // 把副作用函数取出并执行
        return true
    }
})

// track函数
function track(target, key) {
    console.log('track函数执行了=======================>')
    if (!activeEffect) return // 没有正在执行的副作用函数 直接返回
    let depsMap = bucket.get(target)
    console.log(bucket,'track函数中的bucket')
    console.log(depsMap,'track函数中的depsMap')
    if (!depsMap) { // 不存在，则创建一个Map
        bucket.set(target, depsMap = new Map())
    }
    let deps = depsMap.get(key) // 根据key得到 depsSet(set类型), 里面存放了该 target-->key 对应的副作用函数
    console.log(deps,'track函数中的deps')
    if (!deps) { // 不存在，则创建一个Set
        console.log(depsMap,'track函数中的depsMap')
        depsMap.set(key, (deps = new Set()))
    }
    deps.add(activeEffect) // 将副作用函数加进去
    // deps就是当前副作用函数存在联系的依赖集合
    // 将其添加到activeEffect.deps数组中
    activeEffect.deps.push(deps)
}

// trigger函数
function trigger(target, key) {
    console.log('trigger函数执行了=======================>')
    const depsMap = bucket.get(target) // target Map
    if (!depsMap) return;
    const effects = depsMap.get(key) // effectFn Set
    const effectToRun = new Set(effects)
    effectToRun && effectToRun.forEach(fn => {
        if (typeof fn === 'function') fn()
    })
}

let tmp1, tmp2;
//全局变量

//执行此函数

effect(() => {
    console.log('eff1')
    effect(() => {
        console.log('eff2')
        tmp1 = obj.bar
    })
    tmp2 = obj.foo
})

// setTimeout(() => {
//     obj.foo = false
// }, 1000)

// setTimeout(() => {
//     obj.foo = false
// }, 2000)

obj.foo = false
obj.foo = false
obj.bar = false // 此处会执行3次! Vue的bug
