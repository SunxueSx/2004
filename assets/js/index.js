import Utils from "./Utils.js";
import List from "./List.js";

export default class TodoList{
    arr=[];
    todoArr=[];//正在进行的数组
    doneArr=[];//完成时的数组
    constructor(){
        //
        if(localStorage.todoArr) this.todoArr=JSON.parse(localStorage.todoArr);
        if(localStorage.doneArr) this.doneArr=JSON.parse(localStorage.doneArr);
        
        this.elem=this.creatElem();

        //创建容器，两个容器，正在进行和已经完成两个容器
        this.createListCon("正在进行");
        this.createListCon("已经完成");

        //回车的时候添加侦听事件
        document.addEventListener(List.TODO_LIST_CHANGE,e=>this.todoListChange(e))
        document.addEventListener(List.TODO_LIST_REMOVE,e=>this.todoListChange(e))
        document.addEventListener("keyup",e=>this.keyHandler(e));
    }

    //创建该元素的样式
    creatElem(){
        if(this.elem) return this.elem;
        let div=Utils.ce("div",{//设置todoList的容器div
            position:"absolute",
            width:"100%",
            left:0,
            top:0,
            right:0,
            bottom:0,
            backgroundColor:"#CDCDCD"
        });
        let head=Utils.ce("div",{//设置头部div
            position:"relative",
            left:0,
            right:"0px",
            height:"50px",
            backgroundColor:"rgba(47,47,47,0.98)",
            padding:"0 321px",
        })
        let label=Utils.ce("label",{//设置头部的TodoList样式
            float: "left",
            width: "100px",
            lineHeight: "50px",
            color: "#DDD",
            fontSize: "24px",
            cursor: "pointer",
            fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
        })
        label.textContent="ToDoList";

        this.input=Utils.ce("input",{//设置头部的input输入框
            textRendering: "auto",
            color: "-internal-light-dark(black, white)",
            letterSpacing: "normal",
            wordSpacing: "normal",
            textTransform: "none",
            textShadow: "none",
            display: "inline-block",
            textAlign: "start",
            appearance: "textfield",
            backgroundColor: "-internal-light-dark(rgb(255, 255, 255), rgb(59, 59, 59))",
            cursor: "text",
            marginLeft: "100px",
            font: "400 13.3333px Arial",
            float: "left",
            width: "360px",
            height: "24px",
            marginTop: "12px",
            textIndent: "10px",
            borderRadius: "5px",
            boxShadow: "0 1px 0 rgba(255,255,255,0.24), 0 1px 6px rgba(0,0,0,0.45) inset",
            border: "none",
            padding: "1px 2px",
        })
        this.input.setAttribute("placeholder","添加ToDo");//添加指定的属性，并赋予指定的值
        head.appendChild(label);
        head.appendChild(this.input);
        div.appendChild(head);
       
        return div;
    }

    //插入到父元素
    appendTo(parent){
        if(typeof parent==="string") parent=document.querySelector(parent);
        parent.appendChild(this.elem);
    }

    //生成数据容器
    createListCon(title){
        let div=Utils.ce("div",{
            width:"600px",
            margin:"auto",

        });
        let h2=Utils.ce("h2");//添加title 正在进行和已经完成
        h2.textContent=title;

        let list=new List(title=="正在进行");//正在进行为true，已经完成为false，false为mask
        this.arr.push(list);//将刚创建的list放入数组中
        
        if(title==="正在进行")list.setData(this.todoArr);//写入缓存的数据
        else list.setData(this.doneArr);

        div.appendChild(h2);
        // div.appendChild(spanNum);
        list.appendTo(div);
        this.elem.appendChild(div);
    }

    keyHandler(e){
        if(e.keyCode!==13) return;
        if(this.input.value.trim().length===0) return;//判断输入框的内容
        this.todoArr.push(this.input.value);//将输入框的内容放入todoArr数组
        this.input.value="";//清空输入框
        this.arr[0].setData(this.todoArr);//将todoArr的数据放入arr[0],即将输入框输入的内容放入正在进行
        
        this.saveData();
    }

    todoListChange(e){    //e携带两个数据e.data 和 e.checked 
        if(e.checked){
            //点击从todoArr里删除数据，添加到doneArr
           let arr=this.todoArr.splice(e.index,1);
          if(e.type===List.TODO_LIST_CHANGE) this.doneArr.push(arr[0]);
        }else{
            //点击从doneArr里删除数据，添加到todoArr
            let arr=this.doneArr.splice(e.index,1);
            if(e.type===List.TODO_LIST_CHANGE) this.todoArr.push(arr[0]);
        }
        //重新写入数据
        this.arr[0].setData(this.todoArr);
        this.arr[1].setData(this.doneArr);
        
        this.saveData();
    }

    //添加时存储数据,存入两个数组todoArr和doneArr
    saveData(){
        localStorage.todoArr=JSON.stringify(this.todoArr);
        localStorage.doneArr=JSON.stringify(this.doneArr);
    }
}