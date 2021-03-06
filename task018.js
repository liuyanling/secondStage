﻿/**
 * Created by Administrator on 16-4-19.
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
var render=function(){
    var dataS=data.map(function (item){
        return "<div>"+item+"</div>";
    });
    var dataString=dataS.join('');
    document.getElementById("display").innerHTML=dataString;
};
var leftInput=function(){
    var inputData=parseInt(document.getElementById("inputData").value);
    data.unshift(inputData);
    render();
};
var rightInput=function(){
    var inputData=parseInt(document.getElementById("inputData").value);
    data.push(inputData);
    render();
};
var leftOutput=function(){
    data.shift();
    render();
};
var rightOutput=function(){
    data.pop();
    render();
};
function init(){
    var button=document.getElementsByTagName("button");
    var functions=[leftInput,rightInput,leftOutput,rightOutput];
    for(var i=0;i<button.length;i++){
        EventUtil.addHandler(button[i],'click',functions[i]);
    }
    EventUtil.addHandler(document.getElementById("display"),'click',function(event){
        var index = [].indexOf.call(event.target.parentNode.childNodes, event.target);//所点击元素是元素类数组的第几个，即下标
        data.splice(index, 1);
      
        render();
    });
}
window.onload=function(){
    return init();
}