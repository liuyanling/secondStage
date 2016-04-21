/**
 * Created by Administrator on 16-4-21.
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
var render=function(){
    var dataS=data.map(function (item){
        return "<div>"+item+"</div>";
    });
    var dataString=dataS.join('');
    //if (feedIn !== null && feedIn.length > 0) {
    if(data.indexOf(feedIn)!==-1){
        var insert="<div>" + feedIn + "</div>";
        dataString = dataString.replace(new RegExp(insert, "g"), "<div class='select-feed'>" + feedIn + "</div>");
    }
   if(data.indexOf(feedIn)==-1&&feedIn.length > 0){
        alert("未能为您查找到匹配项！");
    }
    document.getElementById("display").innerHTML=dataString;

};
var string=function(){
     inputData=document.getElementById("inputData").value.trim();
     inputString = inputData.split(/[^0-9a-zA-Z\u4e00-\u9fa5]+/);
};
var leftInput=function(){
    string();
    [].unshift.apply(data,inputString);
    render();
};
var rightInput=function(){
    string();
    [].push.apply(data,inputString);
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
var search= function () {
    feedIn=document.getElementById("feedIn").value.trim();
    render(feedIn);
};
function init(){
    var button=document.getElementsByTagName("button");
    var functions=[leftInput,rightInput,leftOutput,rightOutput,search];
    for(var i=0;i<button.length;i++){
        EventUtil.addHandler(button[i],'click',functions[i]);
    }
    EventUtil.addHandler(document.getElementById("display"),'click',function(event){
        var del=event.target.innerHTML;
        data.splice(data.indexOf(del),1);
        render();
    });
}
window.onload=function(){
    return init();
};