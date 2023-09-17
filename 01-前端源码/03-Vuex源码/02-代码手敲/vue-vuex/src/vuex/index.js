/**
 * @Author liming
 * @Date 2022/11/16 15:46
 **/
//主文件的作用：一版就是整合操作
import {Store, install} from './store'

//可以默认导出，也可以解构导出
// import Vuex from 'Vuex'
// import {Store} from 'Vuex'


export default {
    Store,
    install
}

export {
    Store,
    install
}
//2种方式都可以，可以采用默认导入，也可以采用解构使用

