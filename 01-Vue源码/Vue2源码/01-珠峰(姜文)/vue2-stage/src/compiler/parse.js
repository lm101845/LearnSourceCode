/**
 * @Author liming
 * @Date 2022/11/4 14:09
 **/

// {
//     tag:'div',
//     type:1,
//     attrs:[{name,age,address}],
//     parent:null,
//     children:[
//
//     ]
// }


const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`)
// startTagOpen匹配的是<xxx,最终匹配到的分组就是开始标签的名字
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
//endTag匹配的是</xxx>,最终匹配到的分组就是结束标签的名字
const attribute = /^\s*([^\s”'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>']+)))?/;
//attribute匹配属性，第一个分组就是属性的key,value就是分组3/4/5
const startTagClose = /^\s*(\/?)>/;
//匹配<div>或<br/>

//{{xx}},匹配到的内容就是表达式的变量
//注：Vue3采用的不是使用正则，是一个字符一个字符判断的
//对模板进行编译处理(我们每解析一个标签，就将它从字符串里面删除掉)

export function parseHTML(html) {
    const ELEMENT_TYPE = 1;
    const TEXT_TYPE = 3;
    const stack = [];   //创建栈，用于存放元素的
    let currentParent;  //创建指针，永远指向栈中的最后一个
    let root;
    //最终需要转化成一棵抽象语法树
    function createASTElement(tag,attrs){
        return {
            tag,
            type:ELEMENT_TYPE,
            children:[],
            attrs,
            parent:null
        }
    }
    // console.log(html, '--最初的html')
    //利用栈型结构
    function start(tag,attrs){
        // console.log('start开始标签',tag,attrs)
        let node = createASTElement(tag,attrs)   //创造一个AST节点
        if(!root){  //看一下是否是空树
            //如果没有根节点(空树)，那这个开始节点就是根节点
            root = node;
        }
        if(currentParent){
            node.parent = currentParent  //只赋予了parent属性
            //如果当前有根节点，就让当前节点指向它
            currentParent.children.push(node)  //还需要让父亲记住自己
        }
        stack.push(node)  //把这个节点丢进来
        currentParent = node;  //currentParent为栈中的最后一个
    }
    function chars(text){  //文本直接放到当前指向的节点
        // console.log('chars文本',text)
        text = text.replace(/\s/g,'')   //如果空格超过2，就删除2个以上的
        text && currentParent.children.push({
            type:TEXT_TYPE,
            text,
            parent:currentParent
        })
    }

    function end(tag){
        // console.log('end结束',tag)
        //遇到结束标签，直接把它弹出来，并且更新currentNode
        let node = stack.pop();   //把栈中的最后一个弹出来,还可以校验标签是否合法
        currentParent = stack[stack.length - 1]
    }
    function advance(n) {
        html = html.substring(n)
    }

    //写在外面还要传参，直接写里面不用传参，也是可以的
    function parseStartTag() {
        const start = html.match(startTagOpen);
        if (start) {
            const match = {
                tagName: start[1],   //标签名
                attrs: []
            }
            advance(start[0].length)  //匹配完之后，截取掉，再匹配完剩下的

            //如果不是开始标签的结束，就一直匹配下去
            let attr, end;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length)
                match.attrs.push({name:attr[1],value:attr[3] || attr[4] || attr[5] || true})
            }
            if (end) {
                advance(end[0].length)
            }
            // console.log(html, '匹配后的html')
            // console.log(match,'--match')
            return match;
        }
        return false  //不是开始标签
    }

    //html最开始肯定是一个尖角号 <
    while (html) {
        let textEnd = html.indexOf("<")
        //如果textEnd为0，说明是一个开始标签或结束标签
        //如果textEnd > 0,说明就是文本的结束位置
        if (textEnd == 0) {
            const startTagMatch = parseStartTag();  //开始标签的匹配结果
            if(startTagMatch){   //解析到的开始标签
                // console.log(html,'截完开始标签后的html')
                start(startTagMatch.tagName,startTagMatch.attrs)
                continue;
            }
            //如果不是开始标签，那就是结束标签
            let endTagMatch = html.match(endTag);
            if(endTagMatch){
                end(endTagMatch[1])
                advance(endTagMatch[0].length)
                continue;
            }
        }
        if(textEnd > 0){
            //继续截取文本的内容
            let text = html.substring(0,textEnd)  //文本内容
            if(text){
                chars(text)
                advance(text.length)   //解析到的文本
                // console.log(text,'--截取文本后的html')
            }
        }
    }
    // console.log(root,'root')
    // console.log(html,'--html是否为空')
    return root
}