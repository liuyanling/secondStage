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
var data=[];
var colors = [ "#E1CD47","#D76D1E","#EE6658","#43B0A8","#0B8CB0"];
var isvalid=function(){
    var inputN=document.getElementById("inputData").value.trim();
    if(((/^([1-9][0-9]|100)$/).test(inputN))){
        inputN=parseInt(inputN);
        return inputN;
    }
    try{
        if(!((/^([1-9][0-9]|100)$/).test(inputN))){
            throw "请输入合法的数据";
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
        } //没有60<=value<70这样的表示方法的哦
    }
};
var render=function(datas){
    if((datas.length>60)||(data.length>60)){
        alert("队列元素数量最多60个！");
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
   if (inputData!==undefined){ data.unshift(inputData);render(data);}//当元素不在10至100的范围时，
   // 该元素仍然会在isvalid（）中成为underfined后给了data数组，使得产生一根高度为NaN的空白柱子。

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
    data=datas;  //datas表示随机生成的55个数
    render(datas);
};

var cameraSetInterval=function(){ if (camera.length !== 0) {
    var cameraGet = camera.splice(0, data.length);
    render(cameraGet);}
     else{
      clearInterval(timer); //绘制结束
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
        [].push.apply(camera, data);  //camera中存的是快照，大大大的数组，每cameraGet中存一张快照，整个冒泡过程由好多快照组成
        }
    }
    timer = setInterval(cameraSetInterval, parseInt(document.getElementById("inputTime").value)); //定时绘制
};

function init(){
    var button=document.getElementsByTagName("button");
    var functions=[leftInput,rightInput,leftOutput,rightOutput,random,sort];
    for(var i=0;i<button.length;i++){
        EventUtil.addHandler(button[i],'click',functions[i]);
    }
    EventUtil.addHandler(document.getElementById("display"),'click',function(event){
        var index = [].indexOf.call(event.target.parentNode.childNodes, event.target);//点击的元素在所以同辈元素中的下标
        data.splice(index, 1);
        event.target.parentNode.removeChild(event.target);
        render(data);
    });
}
window.onload=function(){
    return init();
};