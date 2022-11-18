/**
 * @Author liming
 * @Date 2022/11/16 17:37
 **/

export const forEach = (obj={},fn)=>{
    console.log(obj,'obj')  //{name: 'zf', age: 10}
    console.log(Object.keys(obj),'Object.keys(obj)')  //['name', 'age']
    Object.keys(obj).forEach((key,index)=>{
        fn(obj[key],key)
    })
    //拿到对象所有的key
}

// forEach({name:'zf',age:10},(value,key)=>{
//     console.log(value,key)
// })