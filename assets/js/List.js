import Utils from "./Utils.js";

export default class List{
    mask;//布尔值 遮罩阴影
    static TODO_LIST_CHANGE="todo_list_change";
    static TODO_LIST_REMOVE="todo_list_remove";
    constructor(_mask=false){//参数是否有遮罩
        this.mask=_mask;
        this.elem=this.createElem();

        this.elem.addEventListener("click",e=>this.clickHandler(e));//给ul添加点击侦听
    }
    createElem(){//创建元素
        if(this.elem) return this.elem;
        return Utils.ce("ul",{//创建 ul
            listStyle:"none",
            margin:"0px",
            padding:0,
            width:"600px",
        });  
    }

    //添加到父元素
    appendTo(parent){
        if(typeof parent==="string") parent=document.querySelector(parent);
        parent.appendChild(this.elem);
    }

    //写入数据,给入数组list  
    setData(list){
        //list是根据写入的数据存入的列表
        this.elem.innerHTML="";
        //生成li，li里边放入input，span，a
        for(var i=0;i<list.length;i++){
            let li=Utils.ce("li",{
                display: "list-item",
                textAlign: "-webkit-match-parent",
                userDrag: "element",
                userSelect: "none",
                height: "32px",
                lineHeight: "32px",
                background: "#fff",
                position: "relative",
                marginBottom: "10px",
                padding: "0 45px",
                borderRadius: "3px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.07)",
                borderLeft:!this.mask ? "5px solid #999" :"5px solid #629A9C",
                opacity:!this.mask ? "0.5"  :  "1",//设置li的不透明级别
            });
            //点击选择框
            let ck=Utils.ce("input",{//创建input
                position:'absolute',
                top:'2px',
                left:'10px',
                width:'22px',
                height:'22px',
                cursor:'pointer',
                backgroundColor:'initial',
                cursor:'default',
                appearance:'checkbox',
                boxSizing:'border-box',
                margin:'3px 3px 3px 4px',
                padding:'initial',
                border:'initial',
                WebkitWritingMode:'horizontal-tb !important',
                textRendering:'auto',
                color:'-internal-light-dark(black, white)',
                letterSpacing:'normal',
                wordSpacing:'normal',
                textTransform:'none',
                textIndent:'0px',
                textShadow:'none',
                display:'inline-block',
                textAlign:'start',
                font:'400 13.3333px Arial',
            });
            //ck是否选中靠this.mask判定
            ck.type="checkbox";
            ck.index=i;//绑定点击数据，index点击的li的下标
            ck.checked=!this.mask//根据this.mask产生不同样式
            li.appendChild(ck);
            let span=Utils.ce("span",{//创建span
                display:"inline-block",
                width:"500px",
                overflow:"hidden"
            });
            span.textContent=list[i];//写入输入内容
            li.appendChild(span);
            let a=Utils.ce("a",{
                position: "absolute",
                top: "2px",
                right: "5px",
                display: "inline-block",
                width: "14px",
                height: "12px",
                borderRadius: "14px",
                border: "6px double #FFF",
                background: "#CCC",
                lineHeight: "14px",
                textAlign: "center",
                color: "#FFF",
                fontWeight: "bold",
                fontSize: "14px",
                cursor: "pointer",
                textDecoration: "underline",
            });
            a.textContent="-";//删除图标设置
            a.index=i;//点击删除 存储点击的li下标
            a.checked=this.mask;//checked为true和false
            li.appendChild(a);
            this.elem.appendChild(li);
        }
    }

    clickHandler(e){
        //判断点击的如果不是li和a就跳出
        if(e.target.constructor!==HTMLInputElement && e.target.constructor!==HTMLAnchorElement) return;
        //点击input进行相应操作
        if(e.target.constructor===HTMLInputElement){//e.target是checkBox
            var evt=new Event(List.TODO_LIST_CHANGE);
            evt.index=e.target.index;
            evt.checked=e.target.checked;
            document.dispatchEvent(evt);
            //抛发事件，事件绑定内容
            //回到ToDoList添加document侦听事件
            return;
        }
        //抛发删除事件
        var evt=new Event(List.TODO_LIST_REMOVE);
            evt.index=e.target.index;
            evt.checked=e.target.checked;
            document.dispatchEvent(evt);
            
    }

}