const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generator = require("@babel/generator").default;

const cheerio = require("cheerio");


const fs = require("fs");
const hookHeadJsCode = fs.readFileSync('./hookHead.js').toString();

function handleJsCode(jsCode,noHead){


    var ast = parser.parse(jsCode,{sourceType:"unambiguous"});



    traverse(ast, {

        // 补for in 括号{}
        ForInStatement(path){
            if (path.node.body && path.node.body.type !== "BlockStatement"){
                path.node.body = t.BlockStatement([path.node.body]);

            }
        }

        // 补while 括号{}
        ,WhileStatement(path){
            if (path.node.body && path.node.body.type !== "BlockStatement"){
                path.node.body = t.BlockStatement([path.node.body])

            }
        }

        // 补for(;;;) 括号{}
        ,ForStatement(path){
            if (path.node.body && path.node.body.type !== "BlockStatement"){
                path.node.body = t.BlockStatement([path.node.body])

            }
        }

        // 补if else 括号{}
        ,IfStatement(path){
            if (path.node.consequent && path.node.consequent.type !== "BlockStatement"){
                path.node.consequent = t.BlockStatement([path.node.consequent])

            }

            if (path.node.alternate && path.node.alternate.type !== "BlockStatement"){
                path.node.alternate = t.BlockStatement([path.node.alternate])

            }
        }

        // hook return 值
        ,ReturnStatement(path) {
            if (path.node.argument != null){
                path.node.argument = t.CallExpression(t.Identifier("window.ting_hook"),[path.node.argument,t.NumericLiteral(2),t.StringLiteral(path.toString().substring(0,100))])
            }

        }

        // hook 赋值
        ,AssignmentExpression(path){
            if(path.node.operator=="="){
                path.node.right = t.CallExpression(t.Identifier("window.ting_hook"),[path.node.right,t.NumericLiteral(2),t.StringLiteral(path.toString().substring(0,100))])

            }
        }

        // hook 声明定义 值
        ,VariableDeclarator(path){
            if(path.node.init !=null){
                path.node.init = t.CallExpression(t.Identifier("window.ting_hook"),[path.node.init,t.NumericLiteral(2),t.StringLiteral(path.toString().substring(0,100))])

            }
        }

        // hook 字典value
        ,ObjectExpression(path){
			for(let i=0;i<path.node.properties.length;i++){
              	if (path.node.properties[i].type !="ObjectMethod"){
              	    path.node.properties[i].value = t.CallExpression(t.Identifier("window.ting_hook"),[path.node.properties[i].value,t.NumericLiteral(2),t.StringLiteral(path.toString().substring(0,100))])
              	}





            }
        	// t.CallExpression(t.Identifier("window.ting_hook"),[path.node.value,t.NumericLiteral(2)])

        }

        ,CallExpression(path){
            if(path.node.callee.name=="eval" &&  path.node.arguments.length>0 ){

                if (path.node.arguments[0].type == "StringLiteral"){
                    try{

                     let code = path.node.arguments[0].value
                     code  = "(function(){"+code+"})()"
                     path.node.arguments[0].value = handleJsCode(code,true).replace("function tingHook() {\n  ","").replace("\n})(tingHook);","");

                    }catch(err){
                        console.log("CallExpression解析失败:",err,path.node.arguments[0].value)
                    }

                }


                if(path.node.arguments[0].type !== "StringLiteral"){
                    path.node.arguments[0]  = t.CallExpression(t.Identifier("window.ting_hook"),[path.node.arguments[0],t.NumericLiteral(3),t.StringLiteral("eval")])

                }


            }





            if(path.node.callee.name == "Function" && path.node.arguments.length ){

                if (path.node.arguments[path.node.arguments.length-1].type == "StringLiteral"){
                    try{
                        let code = path.node.arguments[path.node.arguments.length-1].value
                        code  = "(function tingHook(){"+code+"})(tingHook)"

                        path.node.arguments[path.node.arguments.length-1].value = handleJsCode(code,true).replace("(function tingHook() {\n  ","").replace("\n})(tingHook);","")

                    }catch(err){
                        console.log("NewExpression解析失败:",err,path.node.arguments[path.node.arguments.length-1].value)
                    }

                }

                if(path.node.arguments[path.node.arguments.length-1].type !== "StringLiteral"){
                    path.node.arguments[path.node.arguments.length-1] =t.CallExpression(t.Identifier("window.ting_hook"),[path.node.arguments[path.node.arguments.length-1],t.NumericLiteral(3),t.StringLiteral("大Function")])

                }

            }





        }

        ,NewExpression(path){
            if(path.node.callee.name == "Function" && path.node.arguments.length ){

                if (path.node.arguments[path.node.arguments.length-1].type == "StringLiteral"){
                    try{
                        let code = path.node.arguments[path.node.arguments.length-1].value
                        code  = "(function tingHook(){"+code+"})(tingHook)"

                         path.node.arguments[path.node.arguments.length-1].value = handleJsCode(code,true).replace("(function tingHook() {\n  ","").replace("\n})(tingHook);","")

                    }catch(err){
                        console.log("NewExpression解析失败:",err,path.node.arguments[path.node.arguments.length-1].value)
                    }

                }

                if(path.node.arguments[path.node.arguments.length-1].type !== "StringLiteral"){
                    path.node.arguments[path.node.arguments.length-1] =t.CallExpression(t.Identifier("window.ting_hook"),[path.node.arguments[path.node.arguments.length-1],t.NumericLiteral(3),t.StringLiteral("大Function")])

                }

            }



        }


    },false);


    let head_code = hookHeadJsCode


    let JsCode = generator(ast)["code"];

    return noHead ? JsCode:head_code+JsCode


 }



function handleHtmlCode(htmlCode){


    let $ = cheerio.load(htmlCode);
    let scriptList = $("script");



    if (scriptList.length == 0){
        // console.log("无scrpit标签");
        return htmlCode
    }


    var addHookHeadJsCode = false;
    for(let script of scriptList){
        // 忽略外部引用 和 无内容的标签
        if (script.attribs.src || script.children.length == 0|| script.attribs.type == "application/json"){
            continue
        }

        let newJsCode = "";
        for(let child of script.children){
            newJsCode += child.data;
        }

        if(newJsCode==""){
            continue
        }

        try{

            newJsCode = handleJsCode(newJsCode,addHookHeadJsCode)

            addHookHeadJsCode = true
        }catch(err){
            console.log("handleHtmlCode解析失败：",err,newJsCode)
            continue
        }



        var newScript = cheerio.load("<script>" + newJsCode + "</script>")("script");
        newScript.attribs = script.attribs;

        $(script).replaceWith(newScript);

    }
    let newHtmlCode = $.html();

    return newHtmlCode



}

//const htmlCode = fs.readFileSync('./1.html').toString();
//newHtmlCode = handleHtmlCode(htmlCode)
//console.log(newHtmlCode)

module.exports.handleJsCode  = handleJsCode;
module.exports.handleHtmlCode  = handleHtmlCode;