/**
 * Created by Administrator on 16-4-20.
 */

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
var data=[]; //全局
var colors = [ "#E1CD47","#D76D1E","#EE6658","#43B0A8","#0B8CB0"];
var isvalid=function(){
    var inputN=document.getElementById("inputData").value.trim();
    if(((/^([1-9][0-9]|100)$/).test(inputN))){
        inputN=parseInt(inputN);
        return inputN;
    }
    try{
        if(!((/^([1-9][0-9]|100)$/).test(inputN))){
            throw "请输入范围为：10--100的数字";
        }
    }
    catch(err){
        alert(err);
    }
};
var colorsSelect= function (item) {
    for (var i = 0; i < 5; i++) {
        if (i*20< item && item <= i*20+20) {
            return colors[i];
        } 
    }
};
var render=function(datas){
    if((datas.length>60)||(data.length>60)){
        alert("队列元素最多60个，已达上限");
        return;
    }
    var width=23;
    var dataS=datas.map(function (item){
        return "<div class='bar' style=' height:"+(item*3)+"px;width:"+width+"px;background-color:"+colorsSelect(item)+"'"+"></div>";
    });
    var dataString=dataS.join("");
    document.getElementById("display").innerHTML=dataString;
};

var leftInput=function(){
    var inputData=isvalid();
   if (inputData!==undefined){ data.unshift(inputData);render(data);}//函数没有返回值时，默认返回undefined
};
var rightInput=function(){
    var inputData=isvalid();
    if (inputData!==undefined){ data.push(inputData);render(data);}
};
var leftOutput=function(){
    data.shift();
    render(data);
};
var rightOutput=function(){
    data.pop();
    render(data);
};
var random=function(){
    var datas=[];
    for(var i= 0;i<55;i++){
        datas.push(Math.floor(Math.random()*90+10));
    }
    data=datas; 
    render(datas);
};

var cameraSetInterval=function(){ if (camera.length !== 0) {
    var cameraGet = camera.splice(0, data.length);//作用于自己而非副本
    render(cameraGet);}
     else{
      clearInterval(timer); //结束间歇调用
    }
};
var sort=function() { 
    camera = [];
    var temp;
    for (var i = 0; i < data.length; i++){
        for (var j = 0; j < data.length - i - 1; j++){
            if (data[j] > data[j + 1]) {
                temp = data[j + 1];
                data[j + 1] = data[j];
                data[j] = temp;
            }
        [].push.apply(camera, data);  //数组data整个赋给camera，数值变换一次，给camera后push进一次此时的data
        }
    }
    timer = setInterval(cameraSetInterval, parseInt(document.getElementById("inputTime").value)); //类似动画表示
};

function init(){
    var button=document.getElementsByTagName("button");
    var functions=[leftInput,rightInput,leftOutput,rightOutput,random,sort];
    for(var i=0;i<button.length;i++){
        EventUtil.addHandler(button[i],'click',functions[i]);
    }
    EventUtil.addHandler(document.getElementById("display"),'click',function(event){
        var index = [].indexOf.call(event.target.parentNode.childNodes, event.target);//所点击元素是元素类数组的第几个，即下标
        data.splice(index, 1);
        event.target.parentNode.removeChild(event.target);
        render(data);
    });
}
window.onload=function(){
    return init();
};