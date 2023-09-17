/**
 * @Author liming
 * @Date 2022/11/16 16:10
 **/

const applyMixin = (Vue)=>{
    Vue.mixin({
        //插件的混合一般都在beforeCreate中进行
        beforeCreate:vueInit
    })
}

//组件的创建过程是先父后子
function vueInit(){
    //和router差不多，但又有些区别
    //vue-router是把属性定义到了根实例上，所有组件都能拿到这个根，通过根实例获取这个属性
    //而vuex给每个组件都定义了一个$store属性，指向的是同一个人
    const options = this.$options;
    if(options.store){
        //根实例
        this.$store = options.store
    }else if(options.parent && options.parent.$store){
        //有爸爸，并且爸爸上有$store属性
        //父亲有store,儿子才能继承
        //子组件
        this.$store = options.parent.$store;
    }
}
export default applyMixin