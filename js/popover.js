/**
 * @author liege
 * 2014-8-5 
 */

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
	this.moduleId = this.target.dataset.appid;
	var tmpl = $("#popoverContent").find("."+this.moduleId),
		DEBUG = {"name":"liege"};
	$.template("controlTmpl",tmpl);
	$(".popover-inner").html($.tmpl("controlTmpl",DEBUG));	
};
//显示并定位编辑框
$("#mobile-body").on("click",".module",function(e){
	$("#popover").show();
	popover.target = e.currentTarget;
	popover.posTop = e.currentTarget.offsetTop;	
	popover.pos().loadContent();
	return false;
});
//切换大小图
$(".popover-inner").on("click","input[name='size']",function(e){
	var index = e.currentTarget.value;
	$(popover.target).find("ul").eq(index).show().siblings().hide();
});
//文本编辑
$(".popover-inner").on("keyup","textarea[name='details']",function(e){
	var elem = e.currentTarget;
	elem.id = "t1";
	//elem.timer = setTimeout(function(){
		$(".txt").html($(e.currentTarget).val());
	//},200);
});
//dialog
$(function() { 
    $(".popover-inner").on("click",".dialog",function(e){
    	//被点击的元素data-appid值，对应其内容DOM的ID
    	var elem = e.currentTarget;
		var d = dialog({
			title: '消息',
			content:  $("#"+elem.dataset.appid).html(),
			okValue: '确 定',
			ok: function () {
				var that = this;
				setTimeout(function () {
					that.title('提交中..');
				}, 2000);
				return false;
			},
			cancelValue: '取消',
			cancel: function () {}
		});

		d.show();        
    });
});
//$(".txt").trigger("click")
//分页切换
// (function(){
	// var page = 0;
	// $list = $(".page");
	// $("#prev").click(function(){
		// sw();
	// });
	// $("#next").click(function(){
		// sw(true);
	// });
	// function sw(op){
		// //next
		// if(op){
			// if(page<$list.size()-1){
				// page++;
			// }
		// }else{
		// //prev	
			// if(page>0){
				// page--;
			// }
		// }
		// $list.eq(page).show().siblings().hide();
	// }
// })();
//编辑器
// KindEditor.ready(function(K) {
	// window.editor = K.create('textarea', {
					// allowFileManager : true,
					// langType : 'zh-CN',
					// autoHeightMode : true
	// })
// });
function addModule(data){
	var showList = data.show;
	var allId = $.each(showList,function(i,v){
		console.log(v.id);
	});
	console.dir(showList);
}
addModule(page1);
