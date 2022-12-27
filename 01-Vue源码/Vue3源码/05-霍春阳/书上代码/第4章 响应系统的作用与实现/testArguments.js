/**
 * @Author liming
 * @Date 2022/12/27 14:08
 **/
function add(...values) {
    let sum = 0;

    for (var val of values) {
        sum += val;
    }
    console.log(...values)
    return sum;
}

console.log(add(2, 5, 3) )// 10
