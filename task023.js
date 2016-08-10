var interval = 300; //遍历的时间间隔
lock = false; //判断是否正在染色过程中
function Tree(node) {  //node为根结点元素，下为实例属性
    this.stack = [];
    this.root = node;
}
/*[traverseDF 深度优先遍历] */
Tree.prototype.traverseDF = function() {
    var stack = [];
    (function recurse(currentNode) {
        stack.push(currentNode);
        for (var i = 0; i < currentNode.children.length; i++) {
            recurse(currentNode.children[i]);
        }
        //回调函数，调用callback在traverseDF(callback)的调用过程中传递.
    })(this.root);  //即tree.root,存放的是.root元素，将其传给currentNode。p183匿名函数的this通常指window
    this.stack = stack;
};
/* [traverseBF 广度优先遍历]*/
Tree.prototype.traverseBF = function() {
    var queue = [],
        currentNode = this.root;
    this.stack = [];
    this.stack.push(currentNode);
    while (currentNode) {
        var length = currentNode.children.length;
        for (var i = 0; i < length; i++) {
            queue.push(currentNode.children[i]);
        }
        currentNode = queue.shift();
        this.stack.push(currentNode);
    }
};
/* [animation 染色]*/
function animation(nodes, keyword) {  //p66没有传递值的命名参数将自动被赋予undefined值。
    lock = true;
    var keyword = keyword || null;  //p46如果第一个操作数为对象，则返回第一个操作数        
	// undefined||null为null如果第一个操作数的求值结果为false，则返第二个操作数
    (function show() {
        var next = nodes.shift();
        if (next) {
            next.style.backgroundColor ="#F5C4CB";
            setTimeout(function() {
                if (!(next.firstChild.nodeValue.trim() == keyword)) {  // 元素节点的nodeValue值为null
                     //firstChild指的是childNodes的第一个节点，此处应该是文本节点，文本节点的nodeValue值为节点所包含的文本
				   next.style.backgroundColor = "#fff";
                }
                show();
            }, interval);//指定interval时间后执行代码p203
        } else {
            lock = false;
        }
    })();  //必须用(function show(){...})();这样才是执行函数show，不然就是函数定义了吧
};

/*[clearColor 清除已有颜色]*/
function clearColor(tree) {
    tree.traverseDF();
    tree.stack.forEach(function(ele) { 
        ele.style.backgroundColor = "#fff";
    });
}

function checkInput(ele) {
    return ele.value.trim();
}
function delNode(className) {
    var nodes = document.getElementsByClassName(className);
    if (nodes.length == 0) return false;
    var length = nodes.length;
    //删除节点的时候nodes数组本身会改变，还不知道改变的原因   
    for (var i = 0; i < length; i++) {
        nodes[i].parentNode.removeChild(nodes[i]);
    }
    return true;
}
//添加子结点
function addSubNode(className, text) {
    var parents = document.getElementsByClassName(className);  //所有被单击过的元素
    for (var i = 0; i < parents.length; i++) {
        add(parents[i], text);
        //添加子节点后，由于清楚颜色，原先被选中的父元素颜色会变成#fff,这里将其改回
        parents[i].style.backgroundColor = "#FEF9D1";
    }
    function add(parent, text) {
        var node = document.createElement("Div");
        node.innerHTML = text;
        parent.appendChild(node);
    }
}

function init() {
    var root = document.getElementsByClassName("root")[0],
        search = document.getElementById("search"),
        add = document.getElementById("add"),
        operator = document.getElementsByClassName("operator")[0];
	var tree = new Tree(root);
		//点击一次变色提示，二次取消提示
	EventUtil.addHandler(root, "click", function(event) {//事件委托
		var event=EventUtil.getEvent(event);
        var div = event.target;
        if (div && div.nodeName == "DIV") { //元素标签名nodeName和tagName返大写
            var oriClass = div.className;//返字符串 ，没有class时返空字符串 ""
            if (oriClass.search("active") == -1) {  //p127,search(正则or字符串)方法返回字符串中第一个匹配项，如果没找到匹配项，返回-1.
                div.style.backgroundColor = "#FDDEBE";
                div.className = "active " + oriClass;
            } else {
                div.style.backgroundColor = "#fff";
                div.className = oriClass.replace("active ", "");
            }
        }
    });
	//添加事件委托
    EventUtil.addHandler(operator, "click", function(event) { //事件委托
	    var event=EventUtil.getEvent(event);
        var btn = event.target;
        if (btn && btn.nodeName === "BUTTON") {//单击了button键时
            if (lock) {
                alert("正在遍历中...");
                return;
            }
            clearColor(tree); //清除已有的颜色
            switch (btn.id) {
                case "traverseDF":
                case "traverseBF":
                    tree[btn.id]();   //tree为一个实例对象，如person1["name1"]表person1.name1属性。。即调用tree.traverseDF()
                    animation(tree.stack);
                    break;
                case "DFSearch":
                case "BFSearch":
                    tree["traverse" + btn.id.substring(0, 2)]();//substring()返子字符串p124。为tree.traverseDF()或tree.traverseBF()
                    animation(tree.stack, checkInput(search));  //search为input元素，checkInput(search)为input输入的字符串
                    break;
                case "addNode":
                    var text = checkInput(add); //添加元素的input框中输入的字符串
                    if (text == "") alert("节点内容不能为空");
                    addSubNode("active", text);  //单击某元素，该元素就加入一个class=“active”特性
                    break;
                case "delNode":  //将单击中的元素全部删除
                    if (delNode("active")) alert("删除成功");
                    break;
            }
        }
    });
	} 
window.onload=function(){
    return init();
};