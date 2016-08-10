var tree = document.getElementsByClassName("tree")[0],  //�����ulԪ��
    menu = document.getElementsByClassName("menu")[0],    //�ڵ������Ҽ���굯�����ܲ˵���
    search_text = document.getElementById("search_text"),//input�����
    search_btn = document.getElementById("search_btn"); //������ť

function checkInput(element) {
    return element.value.trim();
}
function search(root, text) {  //�������ulԪ�غ�input������ַ�������
    var nodes = root.getElementsByClassName("title");  //����spanԪ�ع��ɵ�������
    var stack = [];
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].textContent.search(text) ===0  ) {//�����֧��innerText���Ե�֧�����Ƶ�textContent����
                                                        //P302,����Ԫ���а����������ı����ݣ��������ĵ����е��ı������ַ�����
                                                        //.indexOf()�ַ���p125������p95���д˷�����
            stack.push(nodes[i]);
        }
    }
    return stack;
}
//�����ڵ�
EventUtil.addHandler(search_btn, "click", function() {
    var text = checkInput(search_text);  //��input��������ַ���
    if (text == "") return alert("��ѯ���ݲ���Ϊ��");
    var stack = search(tree, text);//�ҵ����������ַ�����ģ���������ĸ�spanԪ�ع��ɵ�����
    for (var i = 0; i < stack.length; i++) {
        var parent = stack[i].parentNode;  //����������pԪ��
		parent.classList.add("shows");
        //�������չ�������еĸ��ڵ�
        while (!parent.classList.contains("root")) { //Ԫ�ض�������classList�������Լ������Ժͷ���
                                    //��������class=��bd user hidden���������ࡣ
                                //.classList.contains(�����б����Ƿ���ڸ�����ֵ���з�true����Ϊfalse
            parent.classList.remove("hidden");   //ɾ��һ������hidden��class���ˡ�bd user��
            parent = parent.parentNode;
        }
    }
});
//�Ҽ���꣬�����˵�
EventUtil.addHandler(tree, "contextmenu", function(event) { //p388�������Ҽ���ʾ�����Ĳ˵�
    event=EventUtil.getEvent(event);
    EventUtil.preventDefault(event); //ȡ��Ĭ����Ϊ���Ա�֤����ʾ�����Ĭ�ϵ������Ĳ˵�
    var node = event.target.parentNode;
    if (node && node.tagName == "P") {
        menu.classList.remove("hidden");
        node.appendChild(menu);  //������뵽appendChild�����еĽڵ��Ѿ����ĵ���һ�����ˣ��ǽ�����ǽ��ýڵ��ԭ����λ���Ƶ���λ��
    }
});
// [���ĵ���¼����ڵ��չ��������]
EventUtil.addHandler(tree, "click", function(event) {
    menu.classList.add("hidden"); //��class="menu"�ĳ�class="menu hidden"
    var node = event.target.parentNode;
    if (node && node.tagName == "P") {
        var ul = node.parentNode.getElementsByTagName("UL")[0]; //������ʱ��null��
        if (ul) {
            ul.classList.toggle("hidden");
            var arrow = node.getElementsByClassName("iconfont")[0];
            //���ı���ǰ�ļ�ͷָ��
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
        var p = event.target.parentNode.parentNode;  //pԪ�أ���ΪdivԪ�ز���PԪ�غ���
        switch (event.target.id) {
            case "add":
                //����ԭ�ȵ�Ҷ�ӽڵ㣬��Ҫ���ָʾ��ͷ
                var iconClass = p.getElementsByTagName("I")[0].classList; //��i��class����ֵ���ַ�����ʾ
                if (!iconClass.contains("icon-down") && !iconClass.contains("icon-xiangyou")) {
                               //add���õ��ǲ����£��Ҽ�ͷ��Ԫ��
                    var i = document.createElement("I");
                    i.className = "iconfont icon-down";
                    var title = p.getElementsByClassName("title")[0];  //spanԪ��
                    p.insertBefore(i, title); //pΪ��Ԫ�أ���spanԪ��ǰ����һ��iԪ��,����i���Ӹ���ͷ
                }
                var name = prompt("������Ҫ��ӵĽڵ���");
                var li = document.createElement("LI"),  ////add���õ��Ǻ��£��Ҽ�ͷ��Ԫ��
                    ul = p.parentNode.getElementsByTagName("UL")[0];
                li.innerHTML = "<p><span class='title'>" + name + "</span></p>";
                if (ul) {
                    ul.appendChild(li);
                } else { //add���õ��ǲ����£��Ҽ�ͷ��Ԫ��
                    var newUl = document.createElement("UL");
                    newUl.appendChild(li);
                    p.parentNode.appendChild(newUl);
                }
                break;
            case "delete":
                p.parentNode.parentNode.removeChild(p.parentNode);
                break;
            case "rename":
                var newName = prompt("�������µ�����");    //������ʾ��p207
                p.getElementsByClassName("title")[0].textContent = newName;
                break;
        }
        menu.classList.add("hidden");
    }
});

