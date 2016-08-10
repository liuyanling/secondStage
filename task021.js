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
function init(){
   function Constructor(Display) {
	   this.data=[];
       this.render=function(Display) {
           var dataS = this.data.map(function (item) {
               return "<div>" + item + "</div>";
           });
           var dataString = dataS.join('');
           Display.innerHTML = dataString; 
        }
	}
    Constructor.prototype={
        constructor:Constructor,
        
    };
    var tagDisplay=document.getElementById("tagDisplay");
    var tagData=new Constructor(tagDisplay);
    var hobbyDisplay=document.getElementById("hobbyDisplay");
    var hobbyData=new Constructor(hobbyDisplay);
    var tagInput=document.getElementById("tag");
    var button=document.getElementsByTagName("button")[0];
    EventUtil.addHandler(tagInput,'keyup',tagSub);//注意不是onkeyup
    EventUtil.addHandler(button,'click',hobbySub);

    function tagSub(event){
        var str=event.target.value;
        if(/(,| |\，)$/.test(str)||event.keyCode===13){  //p107 188为逗号
            // if(event.keyCode===32||event.keyCode===188||event.keyCode===13){188??????32????
            var newTag=str.match(/[^,| |\，]*/)[0];  //*重复零次或更多次，无匹配项返null  //[^abc]用来查找任何不属于方括号中出现的字符
            if(tagData.data.indexOf(newTag)===-1&&newTag!==""){//-1表所查找的项并没有在数组中
                tagData.data.push(newTag);
                if(tagData.data.length>10){
                    tagData.data.shift();
                }
                tagData.render(tagDisplay);
            }
            tagInput.value="";
        }
    }
    function hobbySub(){
        document.getElementById("hobby").value.split(/,|，|`|、| |  \t|\r|\n/).forEach(function(value){   //\t制表符，Tab   \r回车    \n换行符
                                               // 对数组中的每一项运行传入的函数，该方法无返回值p97
                if(hobbyData.data.indexOf(value)===-1){
                    hobbyData.data.push(value);
                    if(hobbyData.data.length>10){
                        hobbyData.data.shift();
                    }
                }
            });
			
        hobbyData.render(hobbyDisplay);
        document.getElementById("hobby").value="";
    }
    EventUtil.addHandler(tagDisplay,'click',function(event){
        var del=event.target.innerHTML;
        tagData.data.splice( tagData.data.indexOf(del),1);
        tagData.render(tagDisplay);
    });

	
    EventUtil.addHandler(hobbyDisplay,'click',function(event){
        var del=event.target.innerHTML;
        hobbyData.data.splice(hobbyData.data.indexOf(del),1);
        hobbyData.render(hobbyDisplay);
    });
	
	
}
window.onload=function(){
    return init();
};
