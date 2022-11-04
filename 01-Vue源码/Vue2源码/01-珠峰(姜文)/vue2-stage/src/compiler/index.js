/**
 * @Author liming
 * @Date 2022/11/2 10:35
 **/
import {parseHTML} from "./parse";

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function genProps(attrs) {
    let str = ''   //{name,value}
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        //特殊处理style
        if ("style" === attr.name) {
            //color:red;background:red => {color:'red'}
            let obj = {}
            attr.value.split(';').forEach(item => {  //或者使用qs库
                let [key, value] = item.split(':');
                obj[key] = value;
            })
            attr.value = obj;
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0, -1)}}`  //把最后一个逗号给删掉
}

function gen(node) {
    //看孩子节点是文本(创建文本)还是元素(直接生成即可)
    if (1 === node.type) {
        return codegen(node)
    } else {
        //生成文本(2种情况)
        let text = node.text;
        if (!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`
        } else {
            // console.log(text,'textxxx')
            //_v(_s(name)+'hello'+_s(name))
            let tokens = []
            let match;
            defaultTagRE.lastIndex = 0;
            let lastIndex = 0;
            //split
            while (match = defaultTagRE.exec(text)) {
                //exec方法用来截取符合正则表达式的字符串
                console.log(match, '--match')
                let index = match.index   //匹配的位置 {{name}} hello {{name}}
                if (index > lastIndex) {
                    tokens.push(JSON.stringify(text.slice(lastIndex, index)))
                }
                console.log(index, '--index')
                tokens.push(`_s(${match[1].trim()})`)
                lastIndex = index + match[0].length
            }
            console.log(tokens, 'tokens')
            if (lastIndex < text.length) {
                tokens.push(JSON.stringify(text.slice(lastIndex)))
            }
            return `_v(${tokens.join('+')})`
        }
    }

}

function genChildren(children) {
    return children.map(child => gen(child)).join(",")
}

function codegen(ast) {
    let children = genChildren(ast.children)
    //对ast进行处理——先不管函数，先考虑返回值
    let code = (`_c('${ast.tag}',${ast.attrs.length > 0 ? genProps(ast.attrs) : 'null'}
        ${ast.children.length ? `,${children}` : ''}
        )`)
    return code;
}

export function compileToFunction(template) {
    //1.将template转换为AST语法树
    let ast = parseHTML(template);
    //2.生成render方法(render方法执行后的返回结果就是虚拟DOM)
    console.log(ast, '--ast')

    //接下来，我们需要把ast树组装成下面的这种语法
    // render(){
    //     return _c('div',{id:'app'},_c('div',{style:{color:'red'}},_v(_s(name) + 'hello'),
    //         _c('span',undefined,_v(_s(age)))))
    // }
    console.log(codegen(ast), '---codegen');
}