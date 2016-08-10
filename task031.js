/**
 * Created by Administrator on 16-5-22.
 */
function radioChange() {
    if (document.getElementById("insRadio").checked) {
        document.querySelector(".inSchool").className = "inSchool";
        document.querySelector(".outSchool").className = "outSchool hide";
    }
    else {
        document.querySelector(".inSchool").className = "inSchool hide";
        document.querySelector(".outSchool").className = "outSchool";
    }
}

function selectDistrict() {
    var data = {
        bj: ["北京大学", "清华大学", "北京航空航天大学","北京师范大学","北京理工大学"],
        sh: ["复旦大学", "上海交通大学", "同济大学","华东师范大学","华东理工大学"],
        gz: ["中山大学", "华南理工大学", "暨南大学","华南师范大学","华南农业大学"]
    };
    var myselect = document.getElementById("select1");
    var select2 = document.getElementById("select2");
    var selected = myselect.options[myselect.selectedIndex].value;  //是value属性而不是text属性
    select2.innerHTML = "";
    for (var i = 0; i < data[selected].length; i++) {
        var opt = document.createElement('option');
        opt.value = data[selected][i];
        opt.innerHTML = data[selected][i];
        document.getElementById('select2').appendChild(opt);
    }
}