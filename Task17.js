
/* ���ݸ�ʽ��ʾ
 var aqiSourceData = {
 "����": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */

// �������������������ģ�����ɲ�������
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = '';
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "����": randomBuildData(500),
    "�Ϻ�": randomBuildData(300),
    "����": randomBuildData(200),
    "����": randomBuildData(100),
    "�ɶ�": randomBuildData(300),
    "����": randomBuildData(500),
    "����": randomBuildData(100),
    "����": randomBuildData(100),
    "����": randomBuildData(500)
};

// ������Ⱦͼ�������
var chartData = {
};

// ��¼��ǰҳ��ı�ѡ��
var pageState = {
    nowSelectCity: -1,
    nowGraTime: "day"
};

/**
 * ��Ⱦͼ��
 */
var colorArray=["#258CC9","#EE0000","#C880FF","#FFB9B9","#13A7FF","#F1C022",
    "#E1C6F5","#FF108A","#FF728A", "#BBFFFF","#CD661D",
    "#FFE4B5" , "#FFAEB9" , "#FFB90F","#B5B5B5"];
function renderChart() {
    var barsize={};
    var suzy=0;

    var divChart=document.getElementsByClassName("aqi-chart-wrap");
    var cityArrays = Object.keys(aqiSourceData);//����["����"��"�Ϻ�"��������]
    if(pageState.nowGraTime==="day"){
        var cityBar={};
           for (var keyss in aqiSourceData){// ��Ҫ�õ�һ�� cityBar;//���ڴ�Ÿ����еĸ�insertHtml
              //���󣬴���ǣ���"01-01��253"��"03-31:65"
               var keylength=Object.keys(aqiSourceData[keyss]);
               var lens=keylength.length; //91
               var insertHtml=" ";
               (function(m){
                   var ts=0;
                   var barSizeIn=[];
                   for (var t in m){
                       var  barSizein={};
                       barSizein.height= m[t];
                       barSizein.width=1100/(lens*2);
                       barSizein.leftRight= barSizein.width/2;
                       barSizein.left=barSizein.leftRight+barSizein.width*2*(ts++);
                       barSizeIn.push(barSizein);
                   }
                   barsize[keyss]= barSizeIn;
                   var barSizeInlength=barSizeIn.length;
                   for(var k=0;k<barSizeInlength;k++){
                       insertHtml=insertHtml+"<div class='"+pageState.nowGraTime+"' style='height:"+   barsize[keyss][k].height
                           +"px; width:"+  barsize[keyss][k].width+"px; left:"+   barsize[keyss][k].left+"px; background-color:"
                           +colorArray[Math.floor(Math.random()*14+0)]+"'></div>";
                       insertHtml=insertHtml+"<div class='aqi-hint"+"' style='bottom:"+ (barsize[keyss][k].height+10)
                           +"px; left:"+(barsize[keyss][k].left+barsize[keyss][k].leftRight-60)+"px;'>"+keylength[k]+"<br/> [AQI]:"+
                           barsize[keyss][k].height+"</div>"
                   }
                   cityBar[keyss]=insertHtml;
                   return cityBar[keyss];
               })(aqiSourceData[keyss]);
          }
        var  allData=cityBar;
        }
  //  var barsize=[];
  //  var insertHtml=" ";
  //  var divChart=document.getElementsByClassName("aqi-chart-wrap");
 //   var cityArrays = Object.keys(aqiSourceData);  //����["����"��"�Ϻ�"��������]
    else if(pageState.nowGraTime==="week"){
        var  dataNumsArray=Object.keys(aqiSourceData.����);//���飬��������ڣ���"01-01"��"03-31"
        var tempMonth=dataNumsArray[0].slice(5,7);
        var weekInit= 5,weekCount=0;
        var datasum=0;
        var sumArray=[];//ÿ���ܵ�����
        for (var s=0;s<dataNumsArray.length-1;s++,weekInit++){//��3���¹�������
            if(dataNumsArray[s].slice(5,7)===tempMonth){ //1�·�
                datasum=datasum+1;
                if(weekInit%7==0){weekCount=weekCount+1;weekInit=0;sumArray[weekCount-1]=datasum;datasum=0;}
            }
            else{
                if(dataNumsArray[s].slice(5,7)!==tempMonth &&(dataNumsArray[s+1].slice(5,7)===dataNumsArray[s].slice(5,7))){//2�·���
                    weekInit=(weekInit-1)%7+1;
                    datasum=datasum+1;
                    if((weekInit)%7==0){
                        weekCount=weekCount+1;weekInit=0;sumArray[weekCount-1]=datasum;datasum=0;}
                }
                else{
                    weekInit=(weekInit-1)%7+1;
                    datasum=datasum+1;
                    if(weekInit<7){weekCount=weekCount+1;sumArray[weekCount-1]=datasum;datasum=0;}}
               }
        }
        if(s=== dataNumsArray.length-1){
            if(datasum+1<7){weekCount=weekCount+1;sumArray[weekCount-1]=datasum+1;}
        }

        function weekDatas(){
            var cityBar={};
            for (var keyss in aqiSourceData){// ��Ҫ�õ�һ�� cityBar;//���ڴ�Ÿ����еĸ�insertHtml
            // ���󣬴���ǣ���"01-01��253"��"03-31:65"
                var keylength=Object.keys(aqiSourceData[keyss]);
                var lens=keylength.length; //91
                (function(m){
                    var ts=0;
                    var j=0;
                    var insertHtml=" ";
                    var barSizeIn=[];
                    var  heightArray=[];
                    for (var t in m){
                        heightArray.push(m[t]);//���飬���91���m���еĸ߶�ֵ
                    }
                    for(var k= 0;k<weekCount;k++){
                        var barSizein = {};
                        barSizein.height=0;
                        for(var weekdatas=1;weekdatas<sumArray[k]+1;weekdatas++) {
                            barSizein.height = heightArray[j++] + barSizein.height;
                        }
                        barSizein.height=barSizein.height/sumArray[k];
                        barSizein.width=1100/(weekCount*2);
                        barSizein.leftRight= barSizein.width/2;
                        barSizein.left=barSizein.leftRight+barSizein.width*2*(k++);
                        k--;
                        barSizeIn.push(barSizein);
                    }
                    //barsize[keyss]= barSizeIn;//����
                    for(var h=0;h<weekCount;h++){
                        insertHtml=insertHtml+"<div class='"+pageState.nowGraTime+"' style='height:"+ barSizeIn[h].height
                            +"px; width:"+ barSizeIn[h].width+"px; left:"+ barSizeIn[h].left+"px; background-color:"
                            +colorArray[Math.floor(Math.random()*14+0)]+"'></div>"
                        insertHtml=insertHtml+"<div class='aqi-hint"+"' style='bottom:"+ (barSizeIn[h].height+10)
                            +"px; left:"+(barSizeIn[h].left+barSizeIn[h].leftRight-60)+"px;'> 2016���"+h+"��<br/> " +
                            "[AQI]:"+ Math.floor(barSizeIn[h].height)+"</div>"
                    }
                    cityBar[keyss]=insertHtml;
                    return cityBar[keyss];
                })(aqiSourceData[keyss]);
            }
            return cityBar;
        }
        var allData= weekDatas();

    }
    if(pageState.nowGraTime==="month"){
        var  dataNumsArray=Object.keys(aqiSourceData.����);//���飬��������ڣ���"01-01"��"03-31"
       // var tempMonth=dataNumsArray[0].slice(5,7);
        var monthsNum=1;
        var monthsArray=[];
        for (var months=1; months<dataNumsArray.length;months++){
            if(dataNumsArray[months-1].slice(5,7)===dataNumsArray[months].slice(5,7)){
                monthsNum++;
            }
            else{
                monthsArray.push(monthsNum);
                monthsNum=1;
            }
        }
        monthsArray.push(monthsNum);
        function monthDatas(){
            var cityBar={};
            for (var keyss in aqiSourceData){// ��Ҫ�õ�һ�� cityBar;//���ڴ�Ÿ����еĸ�insertHtml
                // ���󣬴���ǣ���"01-01��253"��"03-31:65"
                var keylength=Object.keys(aqiSourceData[keyss]);
                var lens=keylength.length; //91
                (function(m){
                    var ts=0;
                    var j=0;
                    var insertHtml=" ";
                    var barSizeIn=[];
                    var  heightArray=[];
                    for (var t in m){
                        heightArray.push(m[t]);//���飬���91���m���еĸ߶�ֵ
                    }
                    for(var k= 0;k<monthsArray.length;k++){
                        var barSizein = {};
                        barSizein.height=0;
                        for(var monthsdatas=1;monthsdatas<monthsArray[k]+1;monthsdatas++) {
                            barSizein.height = heightArray[j++] + barSizein.height;
                        }
                        barSizein.height=barSizein.height/monthsArray[k];
                        barSizein.width=1100/(monthsArray.length*2);
                        barSizein.leftRight= barSizein.width/2;
                        barSizein.left=barSizein.leftRight+barSizein.width*2*(k++);
                        k--;
                        barSizeIn.push(barSizein);
                    }
                    //barsize[keyss]= barSizeIn;//����
                    for(var h=0;h<monthsArray.length;h++){
                        insertHtml=insertHtml+"<div class='"+pageState.nowGraTime+"' style='height:"+ barSizeIn[h].height
                            +"px; width:"+ barSizeIn[h].width+"px; left:"+ barSizeIn[h].left+"px; background-color:"
                            +colorArray[Math.floor(Math.random()*14+0)]+"'></div>"
                        insertHtml=insertHtml+"<div class='aqi-hint"+"' style='bottom:"+ (barSizeIn[h].height+10)
                            +"px; left:"+(barSizeIn[h].left+barSizeIn[h].leftRight-60)+"px;'>2016���"+
                            h+"��<br/> [AQI]:"+Math.floor(barSizeIn[h].height)+"</div>"
                    }
                    cityBar[keyss]=insertHtml;
                    return cityBar[keyss];
                })(aqiSourceData[keyss]);
            }
            return cityBar;
        }
        var allData= monthDatas();

    }
    var divChart=document.getElementById("aqi-chart-wrap");
    var innerHtml =  allData[pageState.nowSelectCity ];
    divChart.innerHTML = innerHtml;
    return allData;
}

/**
 * select�����仯ʱ�Ĵ�����
 */
function citySelectChange() {
    // ȷ���Ƿ�ѡ����˱仯
    var city = this.value;
    var divChart=document.getElementById("aqi-chart-wrap");
    if (city !== pageState.nowSelectCity) {
        pageState.nowSelectCity = city;
        var innerHtml = renderChart()[city];
        divChart.innerHTML = innerHtml;
        // ���ö�Ӧ����
        // ����ͼ����Ⱦ����

    }
}
/**
 * �����������Ĳ���
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
/**
 * �ա��ܡ��µ�radio�¼����ʱ�Ĵ�����
 */
function graTimeChange(inputi) {
    // ȷ���Ƿ�ѡ����˱仯
    var spanArr=document.getElementsByTagName("span");
    for(var i=0;i<spanArr.length;i++){
        spanArr[i].setAttribute("class"," ");
    }
    var spanSelect=inputi.previousElementSibling;
    spanSelect.className="selected";
    if(inputi.value!==pageState.nowGraTime){
        pageState.nowGraTime=inputi.value;
    }
    renderChart();
    // ���ö�Ӧ����
    // ����ͼ����Ⱦ����
}
/**
 * ��ʼ���ա��ܡ��µ�radio�¼��������ʱ�����ú���graTimeChange
 */
function initGraTimeForm() {
    var inputArr=document.getElementsByName("gra-time");
    for(var i= 0;i<inputArr.length;i++){
        (function(m){
            EventUtil.addHandler(inputArr[m],'click',function(){
                graTimeChange(inputArr[m]);
            })
        })(i);
    }
}

window.onload=function(){
    EventUtil.addHandler(document.getElementById("aqi-chart-wrap"),'mouseover',function(event){
        var divAqi=event.target;
        divAqi.nextSibling.className+=" show";  //����ƶ����ĸ�Ԫ�أ���Ԫ�ص��ֵ�Ԫ�ؼ�show������Ԫ�ص�classΪ"aqi-hint show",
        //���������ˣ���.aqi-hint .show���Ч����ע�⣺�������и����������ֲ㣩Ӱ��������Ԫ�ص�ѡȡ�����ǽ�.day,.week,.month{
   //     z-index:1;}����״�ƶ������ϱߣ�.aqi-hint.show{ z-index:555;}��˵�����ƶ������������ټӸ�͸���ȡ�ʵ�֣�����ƶ������ӵ�����ط���
   // �����Դ���˵�����¼���
    });
    EventUtil.addHandler(document.getElementById("aqi-chart-wrap"),'mouseout',function(event){
        var divAqi=event.target;
        divAqi.nextSibling.className=divAqi.nextSibling.className.replace(/show/,"  ");
    });
};
/**
 * ��ʼ������Select����ѡ����е�ѡ��
 */
function initCitySelector() {
    // ��ȡaqiSourceData�еĳ��У�Ȼ������idΪcity-select�������б��е�ѡ��
    var select=document.getElementById("city-select");
    var cityArrays = Object.keys(aqiSourceData);
    var options=cityArrays.map(function(item){
            return "<option>"+item+"</option>";
        }
    );
    var insertHtml=options.join(" ");
    select.innerHTML=insertHtml;
    pageState.nowSelectCity=cityArrays[0];
    var divChart=document.getElementById("aqi-chart-wrap");//�����к���һ�в�Ҫ������ˢ��ҳ��Ϊ���ǰ��ҳ��Ϊ��ͼ
    divChart.innerHTML= renderChart()[cityArrays[0]];
    // ��select�����¼�����ѡ����仯ʱ���ú���citySelectChange
    EventUtil.addHandler(select,'change', citySelectChange);
}

/**
 * ��ʼ��ͼ����Ҫ�����ݸ�ʽ
 */
//function initAqiChartData() {
    // ��ԭʼ��Դ���ݴ����ͼ����Ҫ�����ݸ�ʽ
    // ����õ����ݴ浽 chartData ��
//}

/**
 * ��ʼ������
 */
function init(){
    initGraTimeForm();
    initCitySelector();
   // initAqiChartData();
}

init();
