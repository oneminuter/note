(function(){
	let data = {
		host: "",
		dataPath: "/data/", //数据文件存放目录
		reqUrl: {
			catalog: "catalog.json",
		},
	};
	let page = {
		controller: function(){
			//获取目录
			page.getCatalog();
			page.bind();
		},
		bind: function(){
			document.querySelector(".content .close").onclick = function(){
				document.querySelector(".content").classList.remove("show");
			}
		},
		//获取目录数据
		getCatalog: function(){
			util.ajax({
				url: data.dataPath + data.reqUrl.catalog,
				method: "get",
				success: function(data){
					page.renderCatalog(data.list);
				},
				error: function(err){
					console.log(err);
				}
			});
		},
		//渲染目录
		renderCatalog: function(data) {
			for(let i = 0; i < data.length; i++) {
				let li = document.createElement("li");
				li.onclick = function() {
					page.getNoteMD(data[i].file);
				}
				li.innerHTML = ['<a href="javascript:;">' + data[i].title + '</a>',
								'<label>' + data[i].classfiy + '</label>',
								'<span>' + data[i].time + '</span>'].join("");
				document.querySelector(".container ul").appendChild(li);
			}
		},
		//获取md数据
		getNoteMD: function(file){
			util.getMDFile({
				url: data.dataPath + file,
				method: "get",
				data: {
					time: new Date().valueOf()
				},
				success: function(data){
					page.renderContent(data);
				},
				error: function(err){
					console.log(err);
				}
			});
		},
		//渲染内容
		renderContent: function(text) {
			let content = document.querySelector(".content");
			content.querySelector(".context").innerHTML = marked(text);
			content.classList.add("show");
		},
	};
	page.controller();
})()