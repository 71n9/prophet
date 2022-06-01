if (!window.MyDb) {
    window.MyDb = {};
    window.MyXhr =  XMLHttpRequest;


}

if(!window.ting_hook||!window.ting_search){

    function ting_hook(s, n,functionType ) {

        if (typeof s !== "string") {
            return s
        }

        if (n==3){


            console.log("解析:",functionType,"内容")
            xhr = new window.MyXhr()
            xhr.open("POST", "/handleJsCode", false);
            xhr.send(s);
            let res = xhr.responseText

            return res
        }

        let _ting_obj = {};
        Error.captureStackTrace(_ting_obj);
        let _stack = _ting_obj.stack.split("\n")[n];

        if (functionType!="eval" && "大Function"){
              _stack = "源代码:"+functionType+" "+_stack;
        }



        window.MyDb[s]instanceof Array ? window.MyDb[s].push(_stack) : window.MyDb[s] = Array(_stack);
        return s
    }
    function ting_search(res) {
        let arr = window.MyDb[res];

        if (arr) {
            let d = {};
            for (let i = 0; i < arr.length; i++) {

                if (arr[i]){
                    let jsPath = arr[i]
//                    let jsPath = arr[i].split(":")
//
//                    jsPath.pop()
//                    jsPath = jsPath.join(":")

                    d[jsPath]? d[jsPath]+=1: d[jsPath]=1
                }else{
                    d[typeof arr[i]] +=1

                }

            }
            console.log("\t\t\t\t\t\t\t\t出现次数\t\t\t\t\t\t\t\t位置地址");
            for(let i in d){
                console.log("\t\t\t\t\t\t\t\t",d[i],"\t\t\t\t\t\t\t\t",i);
            }
            return
        }
        console.log("无数据！！");

    }
    window.ting_hook = ting_hook;
    window.ting_search = ting_search;
}





