page1 = {
	show:[
		{
			id:2,src:'images/default.jpg'
		},
		{
			id:1,content:'这里添加文本'
		}],
	editBtns:[1]
	}

page2 = {
	show:[
		{
			id:3,theme:'default'
		}],
	editBtns:[1]
	}

page3 = {
	show:[
		{id:4,itmes:['北京','上海','广州','天津','大连']},
	],
	editBtns:[]
}

page4 = {
	show:[
		{id:1,content:'恭喜您领取成功!'},
		{id:2,src:'default.jpg'}
	],
	editBtns:[1]
}

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
function addComponentToView(component,container){
	if(!container){
		container = '#editor_body';
	}
	$('#'+components[component.id]+'_tmpl').tmpl(component).appendTo(container);
}

//加载组件
function loadDefaultComponent(components){
	if(components.length  == 0){
		return;
	}
	components.forEach(function(com){
		addComponentToView(com);
	});
}

//加载按钮
function loadDefaultBtn(btns){
	if(btns.length == 0){
		return;
	}

	btns.forEach(function(btn){
		$('#btn_Tmpl').tmpl({id:btn,text:btnText[btn],type:components[btn]}).appendTo('#btn_container');
	});
}

$(document).ready(function(){
	var $editor = $('#editor_body');
	$editor.sortable();
	//加载组件
	loadDefaultComponent(page1.show);
	//加载按钮
	loadDefaultBtn(page1.editBtns);
	//绑定事件
	$('#editor_body').on('click','li',function(e){
		var $this = $(this);
		$this.siblings().removeClass('current').end().addClass('current');
	});

	$('#btn_container').on('click','li a',function(e){
		var $this = $(this);
		var relatedComponentId = $this[0].dataset.relateid;
		var com = {id:relatedComponentId,content:'这里填写内容'}
		addComponentToView(com);
	});
});