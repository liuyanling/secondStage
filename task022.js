/**
 * Created by Administrator on 16-4-26.
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
var functions=[preorder,inorder,postorder];
function preorder(node){
    elementArray.push(node);
    if(node.hasChildNodes())//p251是否有子节点，有返true，无返false
    {
        preorder(node.firstElementChild);
        preorder(node.lastElementChild);
    }
}
function inorder(node){
    if(node!== null)
    {
        inorder(node.firstElementChild);
        elementArray.push(node);
        inorder(node.lastElementChild);
    }
}
function postorder(node){
    if(node!== null)
    {
        postorder(node.firstElementChild);
        postorder(node.lastElementChild);
        elementArray.push(node);
    }
}
var render= function () {
    var i=0;
    elementArray[i].style.backgroundColor="#FF6C52";
    var timer=setInterval(function(){
        i=i+1;
        if(i<elementArray.length){
             elementArray[i].style.backgroundColor="#FF6C52";
             elementArray[i-1].style.backgroundColor="#fff";

    }
        else{
            clearInterval(timer);
            elementArray[elementArray.length-1].style.backgroundColor = '#fff';
        }
    },800);
};
function init(){
    var buttons=document.getElementsByTagName("button");
    for(var i=0;i<buttons.length;i++){
        EventUtil.addHandler(buttons[i],"click",function(cur){return function(){
            var node=document.getElementById("ancestors");
            elementArray=[];
            functions[cur](node);
            render();
        };
        }(i));
    }
}
window.onload=function(){
    return init();
};