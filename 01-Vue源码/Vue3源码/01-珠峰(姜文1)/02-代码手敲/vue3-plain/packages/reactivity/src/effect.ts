/**
 * @Author liming
 * @Date 2022/11/2 19:11
 **/

export let activeEffect = undefined;
class ReactiveEffect{
    //这里表示在实例上新增了active属性
    active = true;   //这个effect默认是激活状态
    constructor( public fn) {   //加了public以后，用户传递的参数也会加到this上，等价于this.fn = fn

    }
    run(){  //run就是执行effect
        if(!this.active){   //这里表示如果是非激活的情况，只需要执行函数，不需要进行依赖收集
            this.fn()
        }

        //这里就要依赖收集了
        //核心就是将当前的effect和稍后渲染的属性关联在一起
        try{
            activeEffect = this;
            return this.fn()   //当稍后调用取值操作的时候，就可以获取到这个全局的activeEffect了
        }finally {
            activeEffect = undefined;
        }

    }
}
export function effect(fn){
    //这里fn可以根据状态变化,重新执行
    //而且effect可以嵌套着写
    //这里我们将fn包装一个，变成响应式的函数
    const _effect = new ReactiveEffect(fn);   //创建响应式的effect
    _effect.run();    //默认先执行一次
}

// effect(()=>{
//     state.name
//     effect(()=>{
//         state.age
//     })
// })

