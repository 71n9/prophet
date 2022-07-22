# prophet

JAVASCRIPT AST HOOK JS逆向快速定位 <br>

### 这个项目是用AST语法树进行改写JavaScript代码,加上Anyproxy代理流量实现hook保存return值等等,以达到快速定位,指定参数值的相关代码位置。核心逻辑代码查看handleCode.js <br>

# 使用方法

### 第一步:下载文件 点击Download ZIP 直接下载文件到本地
![image](https://user-images.githubusercontent.com/44369205/170854768-40786304-2eb6-4872-9a86-b0f58b8731b1.png)


### 第二步:先安装node环境 在安装依赖库 

  
  - 需要安装的依赖库一键安装命令 npm install --save cheerio @babel/parser @babel/traverse @babel/types @babel/generator
  - anyoroxy安装遇到坑查百度一般都能解决，详细查看官方地址anyoroxy.io里面例子通俗易懂
  - 一般安装完上面几个库就可以了,还有有问题就缺啥补啥。
  
### 第三步:启动+使用
  - 打开server.js文件 设置参数主要有 port(代理端口) throttle（传输速度）一般默认无须修改 
  - 直接命令启动  node .\server.js 下面是启动成功的输出信息 Http proxy started on port 8001
 
  
  ![image](https://user-images.githubusercontent.com/44369205/170855448-3cee7ee9-765c-4a28-a2cc-8cd6d27f8fee.png)
   ### 浏览器挂上代理端口8001，打开网站等待加载完成,
   ![image](https://user-images.githubusercontent.com/44369205/170857331-5f4c23eb-75d2-4834-ab41-897b344bc0e7.png)

  ![138J1B5VMOH399(~3ET~ @J](https://user-images.githubusercontent.com/44369205/170857154-5f252ec8-6c2f-4bb8-983b-073c5cdd4178.png)

   ### 搜索参数值,ting_search(str) ,点击跳转到相应位置
  ![image](https://user-images.githubusercontent.com/44369205/170857206-10b86214-42db-4122-883c-d34cb9525a68.png)
  
  ### 极验 geetest
  ![image](https://user-images.githubusercontent.com/44369205/170858598-a181daed-b18c-42d0-a15d-c11f20e7f399.png)


### 安装问题,使用问题等等,有啥疑问可以直接提出来看到会及时解答.
