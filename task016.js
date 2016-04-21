/**
 * Created by Administrator on 16-4-19.
 */
/**
 * aqiData���洢�û�����Ŀ���ָ������
 * ʾ����ʽ��
 * aqiData = {
 *    "����": 90,
 *    "�Ϻ�": 40
 * };
 */
var aqiData = {};

/**
 * ���û������л�ȡ���ݣ���aqiData������һ������
 * Ȼ����Ⱦaqi-list�б���������������
 */
function addAqiData() {
    var city=document.getElementById("aqi-city-input").value.trim();
    var airData=document.getElementById("aqi-value-input").value.trim();
    if(!(city.match(/^[A-Za-z\u4E00-\u9FA5]+$/))){
        alert("������Ϸ��ĳ�������");
    }
    if(!(airData.match(/^\d+$/))){
        alert("������Ϸ��Ŀ���������");
    }
    if(city.match(/^[A-Za-z\u4E00-\u9FA5]+$/)&&airData.match(/^\d+$/)){
        aqiData[city]=airData;
    }
    return aqiData;
}

/**
 * ��Ⱦaqi-table���
 */
function renderAqiList() {
    var innerHtml="<tr><td>����</td><td>��������</td><td>����</td></tr>";
    var table=document.getElementById("aqi-table");
    for(var city in aqiData) {
        innerHtml += "<tr><td>"+city+"</td><td>"+aqiData[city]+"</td><td><button class='delete'>ɾ��</button></td></tr>"
    }
    table.innerHTML=innerHtml;
}

/**
 * ���add-btnʱ�Ĵ����߼�
 * ��ȡ�û����룬�������ݣ�������ҳ����ֵĸ���
 */
function addBtnHandle() {
    addAqiData();
    renderAqiList();
}

/**
 * �������ɾ����ť��ʱ��Ĵ����߼�
 * ��ȡ�ĸ��������ݱ�ɾ��ɾ�����ݣ����±����ʾ
 */
function delBtnHandle(event) {
    var actBtn=event.target;
    var delCity=(actBtn.parentElement.parentElement.children)[0].innerHTML;
    delete aqiData[delCity];
    renderAqiList();
}
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
function init() {
    // ���������add-btn��һ������¼������ʱ����addBtnHandle����
    // ��취��aqi-table�е�����ɾ����ť���¼�������delBtnHandle����
    var buttonS=document.getElementById("add-btn");
    EventUtil.addHandler(buttonS,'click',addBtnHandle);
    var table=document.getElementById("aqi-table");
    EventUtil.addHandler(table,'click',function(event){delBtnHandle(event);});
}
window.onload=function(){       //δ��window.onload=function(){}����ֱ���
  // Uncaught TypeError: Cannot read property 'addEventListener' of null
    return init();
};
