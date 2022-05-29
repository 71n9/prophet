
const handleCode =require("./handleCode")


function astHook(requestDetail, responseDetail){


    // 跳过官方库

    if( typeof requestDetail.url == "string" && (requestDetail.url.match("jquery") || requestDetail.url.match("layui")|| requestDetail.url.match("swiper") || requestDetail.url.match("element"))){
        return {
            response: responseDetail.response
        }
    }

    // 处理Js文件

    if( typeof requestDetail.url == "string" && requestDetail.url.match(".js")  && responseDetail.response.header['Content-Type'] && responseDetail.response.header['Content-Type'].match("javascript")){
        let newResponse= responseDetail.response;


        let body = newResponse.body.toString();

        try{
            let newBody = handleCode.handleJsCode(body)
            newResponse.body = newBody
        }catch(err){
            console.log("解析js文件错误:",err,requestDetail.url)

            return null
        }


        return {response:newResponse}
    }


    // 处理Html文件
    if (typeof requestDetail.url == "string" && responseDetail.response.header['Content-Type'] && responseDetail.response.header['Content-Type'].match("text/html")){
        let newResponse= responseDetail.response;



        let body = newResponse.body.toString();

        let newBody = handleCode.handleHtmlCode(body)
        newResponse.body = newBody
        return {response:newResponse}
    }


    return {
            response: responseDetail.response
        }

    }

module.exports.astHook = astHook