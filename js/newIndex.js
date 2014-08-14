var popover = {
	layoutWrap:document.getElementById("popover"),
	posTop:0,
	target:null,
	moduleId:null,
};
popover.hide = function(){
	this.layoutWrap.style.display = "none";
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
			_this.str1 = _this.target.dataset.identity;
		},
		//编辑器发生改变后执行
		afterChange:function(){
			var thisEditor = this;
			// @editor.text() 文本内容
			// @setTimeout 初始化编辑器时会先触发此回调，导致内容清空
			_this.tiemr = setTimeout(function(){
				_this.str2 = _this.target.dataset.identity;
				console.log(_this.str1==_this.str2);
				clearTimeout(_this.tiemr);
				//判断被编辑模块 target 是否发生改变
				if(_this.str1==_this.str2){
					popover.setDataForm(thisEditor.html());
				}
				// popover.target.innerHTML = thisEditor.text();
			},100);
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
popover.blank = function(){
	var _this = this;
	//插件代码开始
	var defaults = {
		speed: 400,
		lowerBound: 1,
		upperBound: 10
	};
	var options = $.extend(defaults, options);
	
	$(".slideControl").each(function() {
		
		// set vars
		var o = options;
		var controller = false;
		var position = 0;
		var obj = this;
		$(this).addClass('slideControlInput');
		var parent = $(this).parent();
		var label = $(parent).find('label');
		parent.html("<label>" + $(label).html() + "</label><span class=\"slideControlContainer\"><span class=\"slideControlFill\" style=\"width:" + $(obj).val()*10 + "%\"><span class=\"slideControlHandle\"></span></span></span>" + $(obj).wrap("<span></span>").parent().html());
		var container = parent.find('.slideControlContainer');
		var fill = container.find('.slideControlFill');
		var handle = fill.find('.slideControlHandle');
		var input = parent.find('input');
		var containerWidth = container.outerWidth() + 1;
		var handleWidth = $(handle).outerWidth();
		var offset = $(container).offset();
		var animate = function(value){$(fill).animate({ width: value + "%"}, o.speed);};
		
		$(window).resize(function() {
			offset = $(container).offset();
		});

		
		// when user clicks anywhere on the slider
		$(container).click(function(e) {		
			e.preventDefault();
			position = checkBoundaries(Math.round(((e.pageX - offset.left + handleWidth/2)/containerWidth)*100));
			
			animate(position);
			$(input).val(position/10);
		});
		
		// when user clicks handle
		$(handle).mousedown(function(e) {
			e.preventDefault();
			controller = true;
			$(document).mousemove(function(e) {
				e.preventDefault();
				position = checkBoundaries(Math.round(((e.pageX - offset.left + handleWidth/2)/containerWidth)*100));
				if (controller) {	
					$(fill).width(position + "%");
					$(input).val(position/10);
				}
			});
			$(document).mouseup(function() {
				e.preventDefault();
				controller = false;
			});
		});
		
		// when user changes value in input
		$(input).change(function() {
			var value = checkBoundaries($(this).val()*10);
			if ($(this).val() > o.upperBound)
				$(input).val(o.upperBound);
			else if ($(this).val() < o.lowerBound)
				$(input).val(o.lowerBound);
			animate(value);
		});
		
	});
	
	// checks if value is within boundaries
	function checkBoundaries(value) {
		if (value < options.lowerBound*10)
			return options.lowerBound*10;
		else if (value > options.upperBound*10)
			return options.upperBound*10;
		else
			return value;
	}
	
	//插件代码结束
	//获取初始化高度
	_this.target.style.height = _this.getDataForm()+"px";
	var value = parseInt(_this.getDataForm());
	// console.log(_this.getDataForm())
	$(".slideControlInput").val(value/10);
	$(".slideControlFill").animate({ width: value + "%"}, 400);
	$("#popover").on("mousemove mousedown mouseout",'.slideControlContainer',setHeight);
	function setHeight(){
		//document.title = $('.slideControlInput').val();
		_this.target.style.height = $('.slideControlInput').val()*10 + "px";
		_this.setDataForm($('.slideControlInput').val()*10 + "px");
	}
};
popover.setDataForm = function(option){
	var obj = {};
	obj.id = popover.target.dataset.index;
	switch(this.target.dataset.identity){
		case "fullText":
		obj.content = option;
		popover.target.innerHTML = option;
		break;
		case "img":
		obj.src = option;
		break;
		case "blankSpace":
		obj.height = option;
		break;
	}
	popover.target.dataset.form = JSON.stringify(obj);
};
popover.getDataForm = function(){
	switch(this.target.dataset.identity){
		case "fullText":
		return $(popover.target).html();
		case "img":
		return $(popover.target).attr("src");
		case "blankSpace":
		return $(popover.target).height();
		break;
	}	
	
	// return JSON.parse(popover.target.dataset.form);
};
//切换验证框皮肤
$(".popover-inner").on("click","input[name='skin']",function(e){
	var index = e.currentTarget.value;
	switch(index){
		case "0":
		$(popover.target).removeClass("red");
		break;
		case "1":
		$(popover.target).addClass("red");
		break;
	}
});
var pagelist = [
{
	show:[
		{
			id:2,src:'images/default.jpg'
		},
		{
			id:13,height:'30px'
		},		
		{
			id:1,content:'这里添加文本'
		}],
	editBtns:[1,13]
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
		{id:2,src:'images/default.jpg'}
	],
	editBtns:[1]
}];
//模拟数据结束
//默认模块数据
var default_config = ['',
	{id:1,content:'这里添加文本'},
	{id:2,src:'images/default.jpg'},
	{id:3,theme:'images/default.jpg'},
	{id:4,itmes:['北京','上海','广州','天津','大连']}
	];
default_config[13] = {id:13,height:'30px'};
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
		arr[i] = JSON.parse(o.dataset.form);
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
	//翻页
	function pageTurns(){
		$editor.html("");
		$("#btn_container").html("");
		loadDefaultComponent(pagelist[page].show);
		loadDefaultBtn(pagelist[page].editBtns);	
		//上传数据接口
		//所有data-form值 [{},{},{}]
		var uploadModuleConfig = getAllData($("#editor_body .module"));
		//流程标识active切换
		$(".dash_bar li:even").eq(page).addClass("active")
		.siblings().removeClass("active");
		//当有popover显示时隐藏它
		popover.hide();
	}	
	$("#prev").click(function(){
		if(page==0){
			return;
		}
		page--;
		pageTurns();	
	});
	$("#next").click(function(){
		if(page==pagelist.length-1){
			return;
		}
		page++;
		pageTurns();
	});
	//视图模块绑定事件，调用编辑框
	$editor.on('click','.module',function(e){
		var $this = $(this);
		$this.addClass('current').parent().siblings().find(".module").removeClass('current');
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
		if(popover.target.dataset.identity == "blankSpace"){
			popover.blank();
		}
		return false;		
	});
	//按钮绑定事件，添加视图模块
	$('#btn_container').on('click','li a',function(e){
		var $this = $(this);
		var relatedComponentId = $this[0].dataset.relateid;
		var com = default_config[relatedComponentId];
		addComponentToView(com);
		$editor.find("li:last").find("div").addClass("current").parent().siblings().find(".module").removeClass('current');
		$editor.find("li:last").find("div").trigger("click");
	});
});