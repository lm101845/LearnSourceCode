<template>
  <div id="app">
    我的年龄是(state)：{{$store.state.age}}
    <hr>
<!--    <button @click="$store.state.age += 10">添加</button>-->
    珠峰的年龄是(getters):{{$store.getters.getAge}}
    <p>看似是方法，其实是属性</p>
    <hr>
    <button @click="$store.commit('changeAgeMutation',10)">同步更新状态(mutation)</button>
    <hr>
    <button @click="$store.dispatch('changeAgeAction',10)">异步更新状态(dispatch)</button>
  </div>
</template>

<script>


export default {
  name: 'App',
  mounted(){
    console.log(this,'this')
  }
}
</script>

<style>

</style>
