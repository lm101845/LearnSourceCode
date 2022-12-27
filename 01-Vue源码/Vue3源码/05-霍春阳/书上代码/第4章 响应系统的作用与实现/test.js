/**
 * @Author liming
 * @Date 2022/12/27 13:47
 **/
const target = {
    foo: 'bar',
    baz: 'qux'
};
const handler = {
    get(trapTarget, property, receiver) {
        let decoration = '';
        if (property === 'foo') {
            decoration = '!!!';
        }
        // console.log(...arguments,'参数')
        //在 JavaScript 中，函数的参数列表中的 ...arguments 表示 rest 参数。
        // 它代表函数中除了已命名参数外的其他所有参数的集合。
        return Reflect.get(...arguments) + decoration;
    }
};
const proxy = new Proxy(target, handler);
console.log(proxy.foo); // bar!!!
console.log(target.foo); // bar
console.log(proxy.baz); // qux
console.log(target.baz); // qux
