/**
 * Created by Administrator on 16-4-19.
 */

var aqiData = {};

function addAqiData() {
    var city=document.getElementById("aqi-city-input").value.trim();
    var airData=document.getElementById("aqi-value-input").value.trim();
    if(!(city.match(/^[A-Za-z\u4E00-\u9FA5]+$/))){
        alert("城市名必须为中英文字符！");
    }
    if(!(airData.match(/^\d+$/))){
        alert("空气质量指数必须为整数！");
    }
    if(city.match(/^[A-Za-z\u4E00-\u9FA5]+$/)&&airData.match(/^\d+$/)){
        aqiData[city]=airData;
    }
    return aqiData;
}


function renderAqiList() {
    var innerHtml="<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>";
    var table=document.getElementById("aqi-table");
    for(var city in aqiData) {
        innerHtml += "<tr><td>"+city+"</td><td>"+aqiData[city]+"</td><td><button class='delete'>删除</button></td></tr>"
    }
    table.innerHTML=innerHtml;
}


function addBtnHandle() {
    addAqiData();
    renderAqiList();
}


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
    
    var buttonS=document.getElementById("add-btn");
    EventUtil.addHandler(buttonS,'click',addBtnHandle);
    var table=document.getElementById("aqi-table");
    EventUtil.addHandler(table,'click',function(event){delBtnHandle(event);});
}
window.onload=function(){       
    return init();
};
