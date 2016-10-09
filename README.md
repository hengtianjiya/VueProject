# VueProject
This is VUE project with ES5 programming which is simple to code.

npm install


目录结构
  
	└──app  
		│  index.html 			build完成后会自动生成 
		│  
		├─build     			项目编译完成后目录
		│      app.js  			编译完成后js
		│      style.css 		编译完成后css
		│      
		├─css             		引用的外部css以及字体css
		│      
		├─img             		压缩后图片目录（source/img下图片压缩后在此目录下）
		│      
		├─js					引用的外部js（jquery.js, zepto.js, vue.js, vue-router.js）
		│      
		├─mock            		伪造数据目录
		│      
		└──source         		开发目录
		  │ index.html 			html开发文件 
	  	  │
		  ├─img         		项目需要使用的图片
		  │      
		  ├─js					项目开发所需要的js
		  │   │
		  │	  ├─component   	每个页面所对应的components
		  │	  │      
		  │	  └─page			每一个页面对象的js页面
		  │	       
		  │	  	filter.js   	vue filter文件
	  	  │		main.js     	项目启动文件
	  	  │		router.js   	路由配置文件
		  │      
		  └─less            	项目css开发文件