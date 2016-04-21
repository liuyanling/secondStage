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
            throw "������Ϸ�������";
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
        } //û��60<=value<70�����ı�ʾ������Ŷ
    }
};
var render=function(datas){
    if((datas.length>60)||(data.length>60)){
        alert("����Ԫ���������60����");
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
   if (inputData!==undefined){ data.unshift(inputData);render(data);}//��Ԫ�ز���10��100�ķ�Χʱ��
   // ��Ԫ����Ȼ����isvalid�����г�Ϊunderfined�����data���飬ʹ�ò���һ���߶�ΪNaN�Ŀհ����ӡ�

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
    data=datas;  //datas��ʾ������ɵ�55����
    render(datas);
};

var cameraSetInterval=function(){ if (camera.length !== 0) {
    var cameraGet = camera.splice(0, data.length);
    render(cameraGet);}
     else{
      clearInterval(timer); //���ƽ���
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
        [].push.apply(camera, data);  //camera�д���ǿ��գ���������飬ÿcameraGet�д�һ�ſ��գ�����ð�ݹ����ɺö�������
        }
    }
    timer = setInterval(cameraSetInterval, parseInt(document.getElementById("inputTime").value)); //��ʱ����
};

function init(){
    var button=document.getElementsByTagName("button");
    var functions=[leftInput,rightInput,leftOutput,rightOutput,random,sort];
    for(var i=0;i<button.length;i++){
        EventUtil.addHandler(button[i],'click',functions[i]);
    }
    EventUtil.addHandler(document.getElementById("display"),'click',function(event){
        var index = [].indexOf.call(event.target.parentNode.childNodes, event.target);//�����Ԫ��������ͬ��Ԫ���е��±�
        data.splice(index, 1);
        event.target.parentNode.removeChild(event.target);
        render(data);
    });
}
window.onload=function(){
    return init();
};