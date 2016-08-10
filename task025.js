var tree = document.getElementsByClassName("tree")[0],  //最外层ul元素
    menu = document.getElementsByClassName("menu")[0],    //节点树上右键鼠标弹出功能菜单，
    search_text = document.getElementById("search_text"),//input输入框
    search_btn = document.getElementById("search_btn"); //搜索按钮

function checkInput(element) {
    return element.value.trim();
}
function search(root, text) {  //将最外层ul元素和input输入的字符串传入
    var nodes = root.getElementsByClassName("title");  //所有span元素构成的类数组
    var stack = [];
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].textContent.search(text) ===0  ) {//火狐不支持innerText属性但支持类似的textContent属性
                                                        //P302,操作元素中包含的所有文本内容，包括子文档树中的文本，返字符串。
                                                        //.indexOf()字符串p125和数组p95都有此方法。
            stack.push(nodes[i]);
        }
    }
    return stack;
}
//搜索节点
EventUtil.addHandler(search_btn, "click", function() {
    var text = checkInput(search_text);  //返input中输入的字符串
    if (text == "") return alert("查询内容不能为空");
    var stack = search(tree, text);//找到含有输入字符串（模糊搜索）的各span元素构成的数组
    for (var i = 0; i < stack.length; i++) {
        var parent = stack[i].parentNode;  //满足条件的p元素
		parent.classList.add("shows");
        //搜索结果展开其所有的父节点
        while (!parent.classList.contains("root")) { //元素都有属性classList，它有自己的属性和方法
                                    //用来作用class=“bd user hidden”这样的类。
                                //.classList.contains(）表列表中是否存在给定的值，有返true，无为false
            parent.classList.remove("hidden");   //删除一个类名hidden，class成了“bd user”
            parent = parent.parentNode;
        }
    }
});
//右键鼠标，弹出菜单
EventUtil.addHandler(tree, "contextmenu", function(event) { //p388，单击右键显示上下文菜单
    event=EventUtil.getEvent(event);
    EventUtil.preventDefault(event); //取消默认行为，以保证不显示浏览器默认的上下文菜单
    var node = event.target.parentNode;
    if (node && node.tagName == "P") {
        menu.classList.remove("hidden");
        node.appendChild(menu);  //如果传入到appendChild（）中的节点已经是文档的一部分了，那结果就是将该节点从原来的位置移到新位置
    }
});
// [树的点击事件，节点的展开与收缩]
EventUtil.addHandler(tree, "click", function(event) {
    menu.classList.add("hidden"); //将class="menu"改成class="menu hidden"
    var node = event.target.parentNode;
    if (node && node.tagName == "P") {
        var ul = node.parentNode.getElementsByTagName("UL")[0]; //不存在时返null吧
        if (ul) {
            ul.classList.toggle("hidden");
            var arrow = node.getElementsByClassName("iconfont")[0];
            //更改标题前的箭头指向
            if (ul.classList.contains("hidden")) {
                arrow.classList.remove("icon-down");
                arrow.classList.add("icon-xiangyou");
            } else {
                arrow.classList.remove("icon-xiangyou");
                arrow.classList.add("icon-down");
            }
        }
    }
});

EventUtil.addHandler(menu, "click", function(event) {
    if (event.target && event.target.tagName == "SPAN") {
        var p = event.target.parentNode.parentNode;  //p元素，因为div元素插在P元素后面
        switch (event.target.id) {
            case "add":
                //对于原先的叶子节点，需要添加指示箭头
                var iconClass = p.getElementsByTagName("I")[0].classList; //返i的class属性值的字符串表示
                if (!iconClass.contains("icon-down") && !iconClass.contains("icon-xiangyou")) {
                               //add作用的是不含下，右箭头的元素
                    var i = document.createElement("I");
                    i.className = "iconfont icon-down";
                    var title = p.getElementsByClassName("title")[0];  //span元素
                    p.insertBefore(i, title); //p为父元素，在span元素前插入一个i元素,即在i处加个箭头
                }
                var name = prompt("请输入要添加的节点名");
                var li = document.createElement("LI"),  ////add作用的是含下，右箭头的元素
                    ul = p.parentNode.getElementsByTagName("UL")[0];
                li.innerHTML = "<p><span class='title'>" + name + "</span></p>";
                if (ul) {
                    ul.appendChild(li);
                } else { //add作用的是不含下，右箭头的元素
                    var newUl = document.createElement("UL");
                    newUl.appendChild(li);
                    p.parentNode.appendChild(newUl);
                }
                break;
            case "delete":
                p.parentNode.parentNode.removeChild(p.parentNode);
                break;
            case "rename":
                var newName = prompt("请输入新的名字");    //弹出提示框，p207
                p.getElementsByClassName("title")[0].textContent = newName;
                break;
        }
        menu.classList.add("hidden");
    }
});

