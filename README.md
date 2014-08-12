GetProducts后端可能需要的接口
===========
#### function loadDefaultComponent(components)
功能：根据配置，加载对应属性到视口
参数：数组，数组的每个元素是要加载的组件
应用示例：
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
		loadDefaultComponent(page1.show)	
这样就把id是1，和2的组件加载进来了
### function loadDefaultBtn(arry [])
功能：根据配置，加载对应的按钮到视口
参数：`[int b,int a]`,数组的每个元素是按钮添加的id
示例：
	age1 = {
  		show:[
			{
				id:2,src:'images/default.jpg'
			},
			{
				id:1,content:'这里添加文本'
			}],
			editBtns:[1]
		};
		loadDefaultComponent(page1.editBtns)
这样就在视口下面添加了一个富文本的添加按钮
###function getAll($nodelist);
功能：获取要post到服务器上的数据
参数：$nodelist (类型是jquery包装集)
在本例中：`$nodelist = $('#editor_body .module	');`
返回值：`[{},{},{}]`,其中`{}`是一个组件

