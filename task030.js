/**
 * Created by Administrator on 16-5-21.
 */
function init() {
    var hintText=[
        {hint:"必填，长度为4~16位字符",right:"名称格式正确",wrong:"名称格式有误",isPassed:false},
        {hint:"必填，长度为4~16位字符,包含字母和数字",right:"密码可用",wrong:"密码不可用",isPassed:false},
        {hint:"必填，必须与密码相同",right:"密码输入一致",wrong:"密码输入不一致",isPassed:false},
        {hint:"填写正确的邮箱格式",right:"邮箱格式正确",wrong:"邮箱格式错误",isPassed:false},
        {hint:"必填，长度为4~16位字符",right:"手机格式正确",wrong:"手机格式错误",isPassed:false}
    ];
    var inputs=document.getElementsByTagName("input");
   
    function regValue(index,v){
        var flag=false;
        var hint=document.getElementById(v.getAttribute("id")+"Hint");
        var value=v.value;
        switch (index){
            case 0:
                flag=/^[a-zA-Z\*0-9_]{4,16}$/.test(value.replace(/[\u0391-\uFFE5]/g,"**")); //将汉字置换成**，占两个字符
                break;
            case 1:
                flag=/^\S{4,16}$/.test(value);
                break;
            case 2:
                flag=inputs[2].value===value;
                break;
            case 3:
                flag=/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$ /.test(value);
                break;
            case 4:
                flag=/^[1][0-9]{10}$/.test(value);
                break;
        }
        if(flag) {
            v.style.borderColor = "green";
            hint.className="right";
            document.getElementsByClassName("em"+index)[0].innerHTML=hintText[index].right;
            hintText[index].isPassed=false;
        }else{
            v.style.borderColor = "red";
            //hint.className="wrong";
            document.getElementsByClassName("em"+index)[0].innerHTML=hintText[index].wrong;
            document.getElementsByClassName("em"+index)[0].className+= " "+"wrong";
            hintText[index].isPassed=true;
        }
    }

    [].forEach.call(inputs,function(v){  //对inputs的每个元素执行函数function（v）{}
        var hintId= v.getAttribute("id")+"Hint";
        EventUtil.addHandler(v,"focus",function(){
            document.getElementById(hintId).style.display="table-row";
        });
        EventUtil.addHandler(v,"blur",function(){
            document.getElementById(hintId).style.display="none";
            var index=[].indexOf.call(inputs,v);
           // var index=inputs.indexOf(v);
            regValue(index,v);
        });  //失去焦点时校验表单内容
    });
    EventUtil.addHandler(document.getElementById("submit"),"click",function(event){
        var event=EventUtil.getEvent(event);
        EventUtil.preventDefault(event);
        [0,1,2,3,4].forEach.call(inputs,function(v){
            var index=[].indexOf.call(inputs,v);
            regValue(index,v);
        });
        var flag=hintText.forEach(function(v){
            return v.isPassed;
        });
        if(flag)
            alert("提交成功");
        else
            alert("提交失败");
    });
}
window.onload=function(){
    return init();
};