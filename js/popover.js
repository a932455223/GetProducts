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

//显示并定位编辑框
$("#mobile-body").on("click",".module",function(e){
	$("#popover").show();
	popover.target = e.currentTarget;
	popover.posTop = e.currentTarget.offsetTop;	
	popover.pos().loadContent();	
	if(e.currentTarget.className.match("txt")){
		popover.editor();
	}
	if(e.currentTarget.className.match("pic")){
		popover.upload();
	}
	return false;
});
//切换大小图
$(".popover-inner").on("click","input[name='size']",function(e){
	var index = e.currentTarget.value;
	$(popover.target).find("ul").eq(index).show().siblings().hide();
});
//文本编辑
// $(".popover-inner").on("keyup focus","textarea[name='details']",function(e){
	// var elem = e.currentTarget;
	// elem.id = "t1";
	// $(".txt").html($(e.currentTarget).val());
// });
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

//通过json插入模块
var MdList=["","fullText","img","msgVerify","locationInfo"];
function addModule(data){
	var show = data.show;
	$.each(show,function(i,o){
		var tmplData=o;
		var markup = $("."+MdList[o.id]).html();
		$.template("controlTmpl",markup);
		$.tmpl("controlTmpl",tmplData).appendTo("#mobile-body");
	});
}
addModule(page1);
addModule(page2);
addModule(page3);
