

const astHook = require("./astHook")
const handleCode = require("./handleCode")

module.exports = {
    *beforeSendResponse(requestDetail, responseDetail) {


        return astHook.astHook(requestDetail, responseDetail);
    },

    *beforeSendRequest(requestDetail){



        if (typeof requestDetail.url == "string" && requestDetail.url.match("handleJsCode")){



            let code = requestDetail.requestData.toString()

            code  = "(function tingHook(){"+code+"})(tingHook)"


            try{
                 var newJsCode = handleCode.handleJsCode(code,true).replace("(function tingHook() {\n  ","").replace("\n})(tingHook);","");

            }catch(err){
                console.log("请求解析失败",err,code)
                return null
            }


            return {
                      response: {
                        statusCode: 200,
                        header: { 'content-type': 'text/plain; charset=utf-8' ,"access-control-allow-origin": "*"},
                        body: newJsCode
                      }
                };
        }

        return null;

    }
}

