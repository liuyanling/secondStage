
/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */

// 以下两个函数用于随机模拟生成测试数据
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
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {
};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: -1,
    nowGraTime: "day"
};

/**
 * 渲染图表
 */
var colorArray=["#258CC9","#EE0000","#C880FF","#FFB9B9","#13A7FF","#F1C022",
    "#E1C6F5","#FF108A","#FF728A", "#BBFFFF","#CD661D",
    "#FFE4B5" , "#FFAEB9" , "#FFB90F","#B5B5B5"];
function renderChart() {
    var barsize={};
    var suzy=0;

    var divChart=document.getElementsByClassName("aqi-chart-wrap");
    var cityArrays = Object.keys(aqiSourceData);//数组["北京"，"上海"，。。。]
    if(pageState.nowGraTime==="day"){
        var cityBar={};
           for (var keyss in aqiSourceData){// 想要得到一个 cityBar;//用于存放各城市的各insertHtml
              //对象，存的是：从"01-01：253"至"03-31:65"
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
 //   var cityArrays = Object.keys(aqiSourceData);  //数组["北京"，"上海"，。。。]
    else if(pageState.nowGraTime==="week"){
        var  dataNumsArray=Object.keys(aqiSourceData.北京);//数组，存的是日期，从"01-01"至"03-31"
        var tempMonth=dataNumsArray[0].slice(5,7);
        var weekInit= 5,weekCount=0;
        var datasum=0;
        var sumArray=[];//每个周的天数
        for (var s=0;s<dataNumsArray.length-1;s++,weekInit++){//求3个月共多少周
            if(dataNumsArray[s].slice(5,7)===tempMonth){ //1月份
                datasum=datasum+1;
                if(weekInit%7==0){weekCount=weekCount+1;weekInit=0;sumArray[weekCount-1]=datasum;datasum=0;}
            }
            else{
                if(dataNumsArray[s].slice(5,7)!==tempMonth &&(dataNumsArray[s+1].slice(5,7)===dataNumsArray[s].slice(5,7))){//2月份了
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
            for (var keyss in aqiSourceData){// 想要得到一个 cityBar;//用于存放各城市的各insertHtml
            // 对象，存的是：从"01-01：253"至"03-31:65"
                var keylength=Object.keys(aqiSourceData[keyss]);
                var lens=keylength.length; //91
                (function(m){
                    var ts=0;
                    var j=0;
                    var insertHtml=" ";
                    var barSizeIn=[];
                    var  heightArray=[];
                    for (var t in m){
                        heightArray.push(m[t]);//数组，存放91天的m城市的高度值
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
                    //barsize[keyss]= barSizeIn;//数组
                    for(var h=0;h<weekCount;h++){
                        insertHtml=insertHtml+"<div class='"+pageState.nowGraTime+"' style='height:"+ barSizeIn[h].height
                            +"px; width:"+ barSizeIn[h].width+"px; left:"+ barSizeIn[h].left+"px; background-color:"
                            +colorArray[Math.floor(Math.random()*14+0)]+"'></div>"
                        insertHtml=insertHtml+"<div class='aqi-hint"+"' style='bottom:"+ (barSizeIn[h].height+10)
                            +"px; left:"+(barSizeIn[h].left+barSizeIn[h].leftRight-60)+"px;'> 2016年第"+h+"周<br/> " +
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
        var  dataNumsArray=Object.keys(aqiSourceData.北京);//数组，存的是日期，从"01-01"至"03-31"
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
            for (var keyss in aqiSourceData){// 想要得到一个 cityBar;//用于存放各城市的各insertHtml
                // 对象，存的是：从"01-01：253"至"03-31:65"
                var keylength=Object.keys(aqiSourceData[keyss]);
                var lens=keylength.length; //91
                (function(m){
                    var ts=0;
                    var j=0;
                    var insertHtml=" ";
                    var barSizeIn=[];
                    var  heightArray=[];
                    for (var t in m){
                        heightArray.push(m[t]);//数组，存放91天的m城市的高度值
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
                    //barsize[keyss]= barSizeIn;//数组
                    for(var h=0;h<monthsArray.length;h++){
                        insertHtml=insertHtml+"<div class='"+pageState.nowGraTime+"' style='height:"+ barSizeIn[h].height
                            +"px; width:"+ barSizeIn[h].width+"px; left:"+ barSizeIn[h].left+"px; background-color:"
                            +colorArray[Math.floor(Math.random()*14+0)]+"'></div>"
                        insertHtml=insertHtml+"<div class='aqi-hint"+"' style='bottom:"+ (barSizeIn[h].height+10)
                            +"px; left:"+(barSizeIn[h].left+barSizeIn[h].leftRight-60)+"px;'>2016年第"+
                            h+"月<br/> [AQI]:"+Math.floor(barSizeIn[h].height)+"</div>"
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
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 确定是否选项发生了变化
    var city = this.value;
    var divChart=document.getElementById("aqi-chart-wrap");
    if (city !== pageState.nowSelectCity) {
        pageState.nowSelectCity = city;
        var innerHtml = renderChart()[city];
        divChart.innerHTML = innerHtml;
        // 设置对应数据
        // 调用图表渲染函数

    }
}
/**
 * 处理浏览器间的差异
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
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(inputi) {
    // 确定是否选项发生了变化
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
    // 设置对应数据
    // 调用图表渲染函数
}
/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
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
        divAqi.nextSibling.className+=" show";  //鼠标移动到哪个元素，该元素的兄弟元素加show，若此元素的class为"aqi-hint show",
        //该起作用了，给.aqi-hint .show添加效果。注意：出现了有个浮动框（遮罩层）影响了鼠标对元素的选取，我们将.day,.week,.month{
   //     z-index:1;}将柱状移动到最上边，.aqi-hint.show{ z-index:555;}即说明框移动到柱子上面再加个透明度。实现，鼠标移动到柱子的任意地方，
   // 都可以触发说明框事件。
    });
    EventUtil.addHandler(document.getElementById("aqi-chart-wrap"),'mouseout',function(event){
        var divAqi=event.target;
        divAqi.nextSibling.className=divAqi.nextSibling.className.replace(/show/,"  ");
    });
};
/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var select=document.getElementById("city-select");
    var cityArrays = Object.keys(aqiSourceData);
    var options=cityArrays.map(function(item){
            return "<option>"+item+"</option>";
        }
    );
    var insertHtml=options.join(" ");
    select.innerHTML=insertHtml;
    pageState.nowSelectCity=cityArrays[0];
    var divChart=document.getElementById("aqi-chart-wrap");//若此行和下一行不要，则在刷新页面为点击前，页面为无图
    divChart.innerHTML= renderChart()[cityArrays[0]];
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    EventUtil.addHandler(select,'change', citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
//function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
//}

/**
 * 初始化函数
 */
function init(){
    initGraTimeForm();
    initCitySelector();
   // initAqiChartData();
}

init();
