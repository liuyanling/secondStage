/**
 * Created by Administrator on 16-4-19.
 */
/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
    var city=document.getElementById("aqi-city-input").value.trim();
    var airData=document.getElementById("aqi-value-input").value.trim();
    if(!(city.match(/^[A-Za-z\u4E00-\u9FA5]+$/))){
        alert("请输入合法的城市名！");
    }
    if(!(airData.match(/^\d+$/))){
        alert("请输入合法的空气质量！");
    }
    if(city.match(/^[A-Za-z\u4E00-\u9FA5]+$/)&&airData.match(/^\d+$/)){
        aqiData[city]=airData;
    }
    return aqiData;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    var innerHtml="<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>";
    var table=document.getElementById("aqi-table");
    for(var city in aqiData) {
        innerHtml += "<tr><td>"+city+"</td><td>"+aqiData[city]+"</td><td><button class='delete'>删除</button></td></tr>"
    }
    table.innerHTML=innerHtml;
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    addAqiData();
    renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(event) {
    var actBtn=event.target;
    var delCity=(actBtn.parentElement.parentElement.children)[0].innerHTML;
    delete aqiData[delCity];
    renderAqiList();
}
var EventUtil = {
    addHandler: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    }
};
function init() {
    // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
    // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
    var buttonS=document.getElementById("add-btn");
    EventUtil.addHandler(buttonS,'click',addBtnHandle);
    var table=document.getElementById("aqi-table");
    EventUtil.addHandler(table,'click',function(event){delBtnHandle(event);});
}
window.onload=function(){       //未加window.onload=function(){}会出现报错：
  // Uncaught TypeError: Cannot read property 'addEventListener' of null
    return init();
};
