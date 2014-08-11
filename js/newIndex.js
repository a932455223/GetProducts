var popover = {
	layoutWrap:document.getElementById("popover"),
	posTop:0,
	target:null,
	moduleId:null,
};
popover.pos = function(){	
	// this.layoutWrap.style.top = this.posTop + "px";
	$(this.layoutWrap).animate({top:this.posTop + "px"},300) ;
	return this;
};
popover.loadContent = function(){
	this.moduleId = this.target.dataset.identity;
	var tmpl = $("#popoverContent").find("."+this.moduleId),
		DEBUG = {"name":"liege"};
	$.template("controlTmpl",tmpl);
	$(".popover-inner").html($.tmpl("controlTmpl",DEBUG));	
};
popover.editor = function(){
	//编辑器
	var _this = this;
	var K=window.KindEditor;
	window.editor = K.create('textarea', {
		
		allowFileManager : true,
		langType : 'zh-CN',
		autoHeightMode : true,
		items:['source','preview','undo','redo','plainpaste','justifyleft','justifycenter',
		'justifyright','justifyfull','insertorderedlist','insertunorderedlist','indent',
		'outdent','subscript','superscript','formatblock','fontname','fontsize',
		'forecolor','hilitecolor','bold','italic','underline','strikethrough',
		'removeformat','hr','link','unlink','fullscreen','lineheight','clearhtml'],
		//初始化回调
		afterCreate:function(){
			this.html(popover.getDataForm());
		},
		//编辑器发生改变后执行
		afterChange:function(){
			var thisEditor = this;
			// @editor.text() 文本内容
			// @setTimeout 初始化编辑器时会先触发此回调，导致内容清空
			setTimeout(function(){
				popover.setDataForm(thisEditor.html());
				// popover.target.innerHTML = thisEditor.text();
			},300);
		}
	});
	// editor.sync(".txt");
	// K.sync("title")	
		
};
popover.upload = function(){	
	var uploader = new plupload.Uploader({
		runtimes : 'html5,flash,silverlight,html4',
		browse_button : 'pickfiles', // you can pass in id...
		container: document.getElementById('container'), // ... or DOM Element itself
		url : 'upload.php',
		flash_swf_url : '../js/Moxie.swf',
		silverlight_xap_url : '../js/Moxie.xap',
		
		filters : {
			max_file_size : '10mb',
			mime_types: [
				{title : "Image files", extensions : "jpg,gif,png"},
				{title : "Zip files", extensions : "zip"}
			]
		},
	
		init: {
			PostInit: function() {
				document.getElementById('filelist').innerHTML = '';
	
				$(document).on("click","#uploadfiles",function() {
					uploader.start();
					return false;
				});
			},
	
			FilesAdded: function(up, files) {
				plupload.each(files, function(file) {
					document.getElementById('filelist').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <b></b></div>';
				});
			},
	
			UploadProgress: function(up, file) {
				document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
			},
	
			Error: function(up, err) {
				document.getElementById('console').innerHTML += "\nError #" + err.code + ": " + err.message;
			}
		}
	});
	uploader.init();
};
popover.setDataForm = function(content){
	var obj = {};
	obj.id = popover.target.dataset.index;
	obj.content = content;
	popover.target.dataset.form = JSON.stringify(obj);
	popover.target.innerHTML = content;
};
popover.getDataForm = function(){
	return $(popover.target).html();
	// return JSON.parse(popover.target.dataset.form);
};
var pagelist = [
{
	show:[
		{
			id:2,src:'images/default.jpg'
		},
		{
			id:1,content:'这里添加文本'
		}],
	editBtns:[1]
	},

{
	show:[
		{
			id:3,theme:'default'
		}],
	editBtns:[1]
	},

{
	show:[
		{id:4,itmes:['北京','上海','广州','天津','大连']},
	],
	editBtns:[]
},

{
	show:[
		{id:1,content:'恭喜您领取成功!'},
		{id:2,src:'default.jpg'}
	],
	editBtns:[1]
}];
//模拟数据结束
//默认模块数据
var default_config = ['',
	{id:1,content:'这里添加文本'},
	{id:2,src:'images/default.jpg'},
	{id:3,theme:'default'},
	{id:4,itmes:['北京','上海','广州','天津','大连']}];
//组件列表
var components = ['','fullText','img','msgVerify','locationInfo','imgAd','title','textNav','imgNav','listLink','goodSearch','showcase','subline','blankSpace'];
//按钮列表
var btnText = ['','富文本','图片区域','短信验证','地址信息','图片广告','标题','文本导航','图片导航','列表链接','商品搜索','橱窗','辅助线','辅助空白'];
/*
	component :一个组件的对象
	container:插入的容器的选择符号
*/

//把组件加载进入视口
// @component:对象，属性id值为按钮data-relateid值
function addComponentToView(component,container){
	if(!container){
		container = '#editor_body';
	}
	$('#'+components[component.id]+'_tmpl').find("div")
	.attr({"data-identity":components[component.id],"data-index":component.id,"data-form":JSON.stringify(component)});
	$('#'+components[component.id]+'_tmpl').tmpl(component).appendTo(container);
}
//重新加载组件
/*
$com:视口容器中得组件的jq包装集
config:从新渲染它用到的配置
usage:  在page1时运行:  
var $img = $('.img').parent();
refreshComponent($img,{id:2,src:'http://www.baidu.com/img/baidu_sylogo1.gif'});
*/
function refreshComponent($com,config){
	var target= $('#'+components[config.id]+'_tmpl').tmpl(config);
	console.log(JSON.stringify(target.html()));
	$com.replaceWith(target[0].outerHTML);
}

//加载组件
//@ components:数组[{},{},{}]，值为要加载的模块数据{}
function loadDefaultComponent(components){
	if(components.length  == 0){
		return;
	}
	components.forEach(function(com){
		addComponentToView(com);
	});
}

//加载按钮 
//btns:数组，元素为数字，用来标识按钮类别。每一个元素为一个按钮
function loadDefaultBtn(btns){
	if(btns.length == 0){
		return;
	}
	//根据不同的按钮类别，来生成不同的按钮html模板
	//text为按钮value，id为按钮data-relateid值，type为对应模块类型
	btns.forEach(function(btn){
		$('#btn_Tmpl').tmpl({id:btn,text:btnText[btn],type:components[btn]}).appendTo('#btn_container');
	});
}
//全部视图模块信息
//@selector dom nodelist 
function getAllData($nodelist){
	var arr = [];
	$nodelist.each(function(i,o){
		arr[i] = o.dataset.form;
	});
	return arr;
};

$(document).ready(function(){
	//@$('#editor_body') 内容模块容器
	var $editor = $('#editor_body'),
		page = 0;
	//子元素拖拽交换位置
	$editor.sortable({
		stop:function(){
			//拖动时重新定位编辑框
			if(popover.target){
				popover.posTop = popover.target.offsetTop;
				popover.pos();
			}
		}		
	});
	//加载组件
	loadDefaultComponent(pagelist[0].show);
	//加载按钮
	loadDefaultBtn(pagelist[0].editBtns);
	
	$("#prev").click(function(){
		if(page==0){
			return;
		}
			page--;
		$editor.html("");
		$("#btn_container").html("");
		loadDefaultComponent(pagelist[page].show);
		loadDefaultBtn(pagelist[page].editBtns);
	});
	$("#next").click(function(){
		if(page==pagelist.length-1){
			return;
		}
		page++;
		$editor.html("");
		$("#btn_container").html("");
		loadDefaultComponent(pagelist[page].show);
		loadDefaultBtn(pagelist[page].editBtns);
	});
	//视图模块绑定事件，调用编辑框
	$editor.on('click','.module',function(e){
		var $this = $(this);
		$this.siblings().removeClass('current').end().addClass('current');
		//显示编辑框
		$("#popover").show();
		popover.target = $this[0];
		popover.posTop = popover.target.offsetTop;	
		popover.pos().loadContent();	
		if(popover.target.dataset.identity == "fullText"){
			popover.editor();
		}
		if(popover.target.dataset.identity == "img"){
			popover.upload();
		}
		return false;		
	});
	//按钮绑定事件，添加视图模块
	$('#btn_container').on('click','li a',function(e){
		var $this = $(this);
		var relatedComponentId = $this[0].dataset.relateid;
		var com = default_config[relatedComponentId];
		addComponentToView(com);
	});
	//所有data-form值 [{},{},{}]
	var uploadModuleConfig = getAllData($("#editor_body .module"));
});