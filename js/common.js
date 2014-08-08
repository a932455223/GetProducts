//获取浏览器高度
	$(document).ready(function(){
	var h = $(window).height() - $('.fixed_content').height() - $('.header_container').height()-20;
	$('.have-tab').css('min-height',h);
	var h = $(window).height() - $('.header_container').height()-20;
	$('.no-tab').css('min-height',h);
	$('#menu_wrap').on('click','li>a',function(e){
		// e.preventDefault();
		var submenu = $(this).next();
		if(submenu.length > 0){
			var dl = $('#menu_wrap dl:visible').not(submenu[0]);
			if(dl.length > 0){
				dl.slideUp('fast',function() {
					submenu.slideToggle('fast');
					$(this).prev().toggleClass('active');
				});
			}else{
				submenu.slideToggle('fast');

			}
			$(this).toggleClass('active');
		}
	});
});
//仿select选择
$(document).ready(function () {
    $(".btn-group_more_show").hide();
    $(".btn-group_more").click(function () {
        $(".btn-group_more_show").toggle(200);
        return false;
        event.preventDefault();
    });
    $("body").click(function () {
        $(".btn-group_more_show").hide(100);
    });
});

//qq表情
// $(function(){
	// $('.tab_qqface').qqFace({
		// id : 'facebox', 
		// assign:'saytext', 
		// path:'images/arclist/'
	// });
// });
function replace_em(str){
	str = str.replace(/\</g,'&lt;');
	str = str.replace(/\>/g,'&gt;');
	str = str.replace(/\n/g,'<br/>');
	str = str.replace(/\[em_([0-9]*)\]/g,'<img src="images/arclist/$1.gif" border="0" />');
	return str;
}