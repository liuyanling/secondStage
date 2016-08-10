/**
 * Created by Administrator on 16-5-21.
 */
var inputValue = document.getElementById("input");
var btn=document.getElementById("btn");
var warn = document.getElementById('tip');
function init() {
    var lengths = function (str) {
    var Length = 0;
    for (var i = 0; i < str.length; i++) {
        var charCode = str.charCodeAt(i);// p123，得相应下标的字符的字符编码(unicode码)
       // cnChar=str.match(/[^\x00-\x80]/g);//利用match方法检索出中文字符并返回一个存放中文的
        if (charCode>255)  //判断输入的是否是汉字
            Length += 2;
        if(/[A-Za-z0-9]/.test(str))  //true为字母，false为非字母
            Length += 1;
    }
    return Length;
    };
    EventUtil.addHandler(btn, "click", function () {
        if (lengths(inputValue.value.trim()) == 0) {
            warn.innerHTML = '姓名不能为空';
            warn.style.color = 'red';
            inputValue.style.border = '2px solid red';
        }
        else if (lengths(inputValue.value.trim()) >= 4 && lengths(inputValue.value.trim()) <= 16) {
            warn.innerHTML = '格式正确';
            warn.style.color = '#2F79BA';
            inputValue.style.border = '2px solid #2F79BA';
        }
        else {
            warn.innerHTML = '字符数应为4~16位';
            warn.style.color = 'red';
            inputValue.style.border = '2px solid red';
        }
    });
}
window.onload=function(){
    return init();
};