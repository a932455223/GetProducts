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
			this.text(popover.getDataForm.context)
		},
		//编辑器发生改变后执行
		afterChange:function(){
			// console.log(this.text());
			// @editor.text() 文本内容
			_this.target.innerHTML = this.text();
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
	popover.target.dataset.form = content;
};
popover.getDataForm = function (){
	return popover.target.dataset.form;  
};
page1 = {
	show:[
		{
			id:2,src:'images/default.jpg'
		},
		{
			id:1,content:'这里添加文本'
		}],
	editBtns:[1]
	};

page2 = {
	show:[
		{
			id:3,theme:'default'
		}],
	editBtns:[1]
	};

page3 = {
	show:[
		{id:4,itmes:['北京','上海','广州','天津','大连']},
	],
	editBtns:[]
};

page4 = {
	show:[
		{id:1,content:'恭喜您领取成功!'},
		{id:2,src:'default.jpg'}
	],
	editBtns:[1]
};

//模拟数据结束
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
	$('#'+components[component.id]+'_tmpl').find("div").attr("data-identity",components[component.id]);
	$('#'+components[component.id]+'_tmpl').tmpl(component).appendTo(container);
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

$(document).ready(function(){
	//@$('#editor_body') 内容模块容器
	var $editor = $('#editor_body');
	//子元素拖拽交换位置
	$editor.sortable();
	//加载组件
	loadDefaultComponent(page1.show);
	//加载按钮
	loadDefaultBtn(page1.editBtns);
	//绑定事件
	$('#editor_body').on('click','li',function(e){
		var $this = $(this);
		$this.siblings().removeClass('current').end().addClass('current');
		//显示编辑框
		$("#popover").show();
		popover.target = $this.find("div")[0];
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

	$('#btn_container').on('click','li a',function(e){
		var $this = $(this);
		var relatedComponentId = $this[0].dataset.relateid;
		var com = {id:relatedComponentId,content:'这里填写内容'};
		addComponentToView(com);
	});
});