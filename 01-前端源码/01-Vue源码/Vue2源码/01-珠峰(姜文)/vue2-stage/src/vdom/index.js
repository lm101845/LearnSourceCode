/**
 * @Author liming
 * @Date 2022/11/12 20:53
 **/

//h()  _c()
export function createElementVNode(vm,tag,data,...children){
    if(data == null){
        data = {}
    }
    let key = data.key
    if(key){
        delete data.key
    }
    return vnode(vm,tag,key,data,children)
}

//_v()
export function createTextVNode(vm,text){
    return vnode(vm,undefined,undefined,undefined,undefined,text)
}

//疑问：AST一样吗？
//回答：AST做的是语法层面的转化，他描述的是语法本身，不能存放一些自定义属性(可以描述JS,CSS,HTML)
//而我们的虚拟DOM描述的是DOM元素，可以添加一些自定义属性(描述DOM的)
function vnode(vm,tag,key,data,children,text){
    return {
        vm,
        tag,
        key,
        data,
        children,
        text
    }
}