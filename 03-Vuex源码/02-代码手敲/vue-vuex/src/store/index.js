//Vuex无法脱离Vue，因为它内部创建了Vue实例。
import Vue from 'vue'
// import Vuex from 'vuex'   //源码里面的Vuex
import Vuex from '../vuex'   //我们自己实现的Vuex
Vue.use(Vuex)
//跨组件通信
export default new Vuex.Store({   //内部也会创造一个Vue实例，通信用的
  state: {   //组件的状态  new Vue(data)
    age:28,
    a:1
  },
  getters:{   //获取 计算属性  new Vue(computed) 依赖  当依赖的值变化后，会重新执行
    getAge(state){  //如果返回的结果相同，不会重新执行这个函数
      //如果age属性不发生变化，就不会重新执行
      console.log("getter执行了")
      return state.age - 10
    }
  },
  mutations: {  //Vue中的方法【唯一】可以改状态的方法(?那getters呢?)
    changeAgeMutation(state,payload){  //且必须是同步的
      state.age += payload
    }
  },
  actions: {   //通过action中发起请求
    changeAgeAction({commit},payload){
      //这个表示store里面有一个commit方法
      setTimeout(()=>{
        console.log('函数执行了')
        commit('changeAgeMutation',payload)
        //先调changeAgeAction这个方法，过3秒之后会调changeAgeMutation这个方法
      },2000)
    }
  },
  modules: {
  }
})
