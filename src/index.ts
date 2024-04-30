import {
    Plugin,
    showMessage,
    confirm,
    Dialog,
    Menu,
    openTab,
    adaptHotkey,
    getFrontend,
    getBackend,
    IModel,
    Setting,
    fetchPost,
    Protyle,
    openWindow,
    IOperation,
    Constants,
    openMobileFileById,
    lockScreen,
    ICard,
    ICardData,
    EventMenu,
    IEventBusMap,
    TEventBus, Lute
} from "siyuan";
import "./index.scss";
import * as mylib from "./libs"
import {IMenuBaseDetail} from "siyuan/types/events";
import {IProtyle} from "siyuan/types/protyle";
//配置存储位置: SiYuan工作空间\data\storage\petal\<plugin-name>
const STORAGE_NAME = "keylistConfig";
const TAB_TYPE = "custom_tab";
const DOCK_TYPE = "dock_tab";
type TypeMapString2Function = {
  [key: string]: Function;
};
const sleep1 = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default class PluginSample extends Plugin {

    private isMobile: boolean;

    onload() {
        console.log("--- onload:"+this.name)
        // console.log("属性:"+JSON.stringify(Object.keys(this.data)))
        const frontEnd = getFrontend();
        this.isMobile = frontEnd === "mobile" || frontEnd === "browser-mobile";
        // 图标的制作参见帮助文档
        // 改图标其实很简单,把svg的内部代码(多个path标签)粘贴到下面的symbol标签之间,再把symbol的viewBox修改成和svg的一样即可
        // iconClick和iconClick2 来自 https://www.iconfont.cn/collections/detail?spm=a313x.user_detail.i1.dc64b3430.52683a816Jv7Zz&cid=14428
        this.addIcons(`<symbol id="iconFace" viewBox="0 0 32 32">
<path d="M13.667 17.333c0 0.92-0.747 1.667-1.667 1.667s-1.667-0.747-1.667-1.667 0.747-1.667 1.667-1.667 1.667 0.747 1.667 1.667zM20 15.667c-0.92 0-1.667 0.747-1.667 1.667s0.747 1.667 1.667 1.667 1.667-0.747 1.667-1.667-0.747-1.667-1.667-1.667zM29.333 16c0 7.36-5.973 13.333-13.333 13.333s-13.333-5.973-13.333-13.333 5.973-13.333 13.333-13.333 13.333 5.973 13.333 13.333zM14.213 5.493c1.867 3.093 5.253 5.173 9.12 5.173 0.613 0 1.213-0.067 1.787-0.16-1.867-3.093-5.253-5.173-9.12-5.173-0.613 0-1.213 0.067-1.787 0.16zM5.893 12.627c2.28-1.293 4.040-3.4 4.88-5.92-2.28 1.293-4.040 3.4-4.88 5.92zM26.667 16c0-1.040-0.16-2.040-0.44-2.987-0.933 0.2-1.893 0.32-2.893 0.32-4.173 0-7.893-1.92-10.347-4.92-1.4 3.413-4.187 6.093-7.653 7.4 0.013 0.053 0 0.12 0 0.187 0 5.88 4.787 10.667 10.667 10.667s10.667-4.787 10.667-10.667z"></path>
</symbol>

<symbol id="iconSaving" viewBox="0 0 32 32">
<path d="M20 13.333c0-0.733 0.6-1.333 1.333-1.333s1.333 0.6 1.333 1.333c0 0.733-0.6 1.333-1.333 1.333s-1.333-0.6-1.333-1.333zM10.667 12h6.667v-2.667h-6.667v2.667zM29.333 10v9.293l-3.76 1.253-2.24 7.453h-7.333v-2.667h-2.667v2.667h-7.333c0 0-3.333-11.28-3.333-15.333s3.28-7.333 7.333-7.333h6.667c1.213-1.613 3.147-2.667 5.333-2.667 1.107 0 2 0.893 2 2 0 0.28-0.053 0.533-0.16 0.773-0.187 0.453-0.347 0.973-0.427 1.533l3.027 3.027h2.893zM26.667 12.667h-1.333l-4.667-4.667c0-0.867 0.12-1.72 0.347-2.547-1.293 0.333-2.347 1.293-2.787 2.547h-8.227c-2.573 0-4.667 2.093-4.667 4.667 0 2.507 1.627 8.867 2.68 12.667h2.653v-2.667h8v2.667h2.68l2.067-6.867 3.253-1.093v-4.707z"></path>
</symbol>

<symbol id="iconClick" viewBox="0 0 1024 1024">
<path d="M821.248 422.912h-2.048c-14.848 0-28.672 3.072-42.496 10.24-15.872-35.84-49.664-58.368-88.064-58.368-15.36 0-30.72 3.584-44.544 10.24-15.872-35.84-49.664-58.368-88.064-58.368-12.288 0-24.064 2.048-35.328 6.144V253.952c0-55.808-42.496-99.328-96.768-99.328-55.296 0-99.84 44.544-99.84 99.328v333.824l-41.984-41.472c-39.936-39.424-108.544-32.768-141.312 0-31.744 31.744-55.296 98.816-6.656 146.944l256 254.464c5.12 5.12 11.264 10.24 18.432 14.336 46.08 37.376 100.864 61.952 218.112 61.952 268.288 0 290.304-151.04 290.304-319.488V522.24c0.512-55.296-41.984-99.328-95.744-99.328zM243.712 598.528l91.648 91.136c19.968 19.968 53.76 5.632 53.76-22.528V263.68c0-19.456 15.872-34.816 35.328-34.816 18.432 0 32.256 14.848 32.256 34.816v296.96c0 17.92 14.336 32.256 32.256 32.256 16.896 0 30.208-12.8 32.256-28.672v-128c0-19.968 14.336-34.816 33.28-34.816 0.512 0 15.36 0 25.088 9.728 6.144 5.632 8.704 14.336 8.704 25.088V599.04c0 17.92 14.336 32.256 32.256 32.256 16.896 0 30.208-12.8 32.256-28.672V484.352c0-19.968 14.336-34.816 32.256-34.816 34.816 2.56 35.84 31.744 35.84 34.816v143.36c0 17.92 14.336 32.256 32.256 32.256 16.896 0 29.696-12.288 31.744-28.672v-102.912c0-19.456 14.848-34.816 33.792-34.816 0 0 14.848-0.512 24.576 9.216 6.144 5.632 9.216 14.336 9.216 26.112v176.128c0 142.848 0 255.488-225.792 255.488-93.184 0-152.064-19.456-197.632-64.512l-242.176-240.64c-8.192-8.192-12.288-17.92-11.264-28.16 0.512-9.216 5.12-18.944 12.8-26.624s18.432-11.264 28.672-11.264c10.24-1.024 19.968 2.56 26.624 9.216z" fill="#040000" p-id="2537"></path><path d="M219.648 274.944c17.408-2.56 30.208-17.92 30.208-35.84 0.512-92.672 75.776-168.448 168.96-168.448s168.448 75.264 168.96 168.448c0 17.408 12.8 33.28 30.208 35.84 22.016 3.072 40.448-13.824 40.448-34.816C658.432 107.52 550.912 0 418.816 0S179.2 107.52 179.2 239.616c0 21.504 18.432 38.4 40.448 35.328z" fill="#040000" p-id="2538"></path>
</symbol>

<symbol id="iconClick2" viewBox="0 0 1024 1024">
<path d="M821.248 422.912h-2.048c-14.848 0-28.672 3.072-42.496 10.24-15.872-35.84-49.664-58.368-88.064-58.368-15.36 0-30.72 3.584-44.544 10.24-15.872-35.84-49.664-58.368-88.064-58.368-12.288 0-24.064 2.048-35.328 6.144V253.952c0-55.808-42.496-99.328-96.768-99.328-55.296 0-99.84 44.544-99.84 99.328v333.824l-41.984-41.472c-39.936-39.424-108.544-32.768-141.312 0-31.744 31.744-55.296 98.816-6.656 146.944l256 254.464c5.12 5.12 11.264 10.24 18.432 14.336 46.08 37.376 100.864 61.952 218.112 61.952 268.288 0 290.304-151.04 290.304-319.488V522.24c0.512-55.296-41.984-99.328-95.744-99.328zM243.712 598.528l91.648 91.136c19.968 19.968 53.76 5.632 53.76-22.528V263.68c0-19.456 15.872-34.816 35.328-34.816 18.432 0 32.256 14.848 32.256 34.816v296.96c0 17.92 14.336 32.256 32.256 32.256 16.896 0 30.208-12.8 32.256-28.672v-128c0-19.968 14.336-34.816 33.28-34.816 0.512 0 15.36 0 25.088 9.728 6.144 5.632 8.704 14.336 8.704 25.088V599.04c0 17.92 14.336 32.256 32.256 32.256 16.896 0 30.208-12.8 32.256-28.672V484.352c0-19.968 14.336-34.816 32.256-34.816 34.816 2.56 35.84 31.744 35.84 34.816v143.36c0 17.92 14.336 32.256 32.256 32.256 16.896 0 29.696-12.288 31.744-28.672v-102.912c0-19.456 14.848-34.816 33.792-34.816 0 0 14.848-0.512 24.576 9.216 6.144 5.632 9.216 14.336 9.216 26.112v176.128c0 142.848 0 255.488-225.792 255.488-93.184 0-152.064-19.456-197.632-64.512l-242.176-240.64c-8.192-8.192-12.288-17.92-11.264-28.16 0.512-9.216 5.12-18.944 12.8-26.624s18.432-11.264 28.672-11.264c10.24-1.024 19.968 2.56 26.624 9.216z" fill="#1296db" p-id="1996"></path><path d="M219.648 274.944c17.408-2.56 30.208-17.92 30.208-35.84 0.512-92.672 75.776-168.448 168.96-168.448s168.448 75.264 168.96 168.448c0 17.408 12.8 33.28 30.208 35.84 22.016 3.072 40.448-13.824 40.448-34.816C658.432 107.52 550.912 0 418.816 0S179.2 107.52 179.2 239.616c0 21.504 18.432 38.4 40.448 35.328z" fill="#1296db" p-id="1997"></path>
</symbol>
`);

        this.addTopBar({
            icon:'iconClick',
            title:'添加快捷键到工具栏-配置',
            position:'right',
            callback:()=>{
                this.openSetting()
            }
        })
        // 加载配置,添加工具栏按钮
        this.loadData(STORAGE_NAME).then((keylists)=>{
            console.log(`${this.name} 加载配置:${keylists.length}个`)
            // console.log(keylists)
            // console.log(typeof keylists)
            // console.log( keylists instanceof Array)
            if(keylists instanceof Array){
                for (let i = 0; i < keylists.length; i++) {
                    let shortcutCfg = keylists[i];
                    console.log(`${i} ${shortcutCfg.enable?"启用":"禁用"} ${shortcutCfg.shortcut}`)
                    if (!shortcutCfg.enable) {
                        continue
                    }
                    this.addTopBar({
                        icon: shortcutCfg.icon,
                        title: shortcutCfg.shortcut + "\n" + shortcutCfg.title,
                        position: shortcutCfg.position,
                        callback: () => {
                            console.log("点击了:工具栏 3");
                            console.log(shortcutCfg.shortcut);
                            console.log(shortcutCfg.keyinfo);
                            let keyinfo = JSON.parse(shortcutCfg.keyinfo);
                            // document.body.dispatchEvent(new KeyboardEvent("keydown", {...keyinfo, bubbles: true}));

                            // window.dispatchEvent(new KeyboardEvent('keydown', {...keyinfo}));
                            // document.body.dispatchEvent(new KeyboardEvent('keydown', {...keyinfo}));
                            let editor = document.querySelector(".layout__center [data-type='wnd'].layout__wnd--active > .layout-tab-container > div:not(.fn__none) .protyle-wysiwyg") as HTMLElement;
                            console.log("editor:");
                            console.log(editor);
                            // cancelable:true
                            if (1) {
                                if (editor) {
                                    let esc={"ctrlKey":false,"shiftKey":false,"altKey":false,"metaKey":false,"key":"Escape","code":"Escape","keyCode":27};
                                    window.dispatchEvent(new KeyboardEvent("keydown", {...esc, bubbles: true}));
                                    // editor.dispatchEvent(new KeyboardEvent("keydown", {...keyinfo, bubbles: true}));
                                    setTimeout(()=>{
                                        editor.dispatchEvent(new KeyboardEvent("keydown", {...keyinfo, bubbles: true}));
                                    },100)
                                }else {
                                    document.body.dispatchEvent(new KeyboardEvent("keydown", {...keyinfo, bubbles: true}));
                                }
                            }
                        }
                    });
                }
            }
        })
        console.log(this.i18n.helloPlugin + this.name);
    }


    onLayoutReady() {
        console.log("----onLayoutReady:"+this.name)
        console.log(`frontend: ${getFrontend()}; backend: ${getBackend()}`);
    }

    onunload() {
        console.log(this.i18n.byePlugin);
    }

    uninstall() {
        console.log("uninstall "+this.name);
    }

    // 自定义设置
    openSetting() {
        const dialog = new Dialog({
            title: this.name,
            height:'90vh',
            content: `<div class="b3-dialog__content">
<!--<button id="testbtn">点击</button>-->
</div>
<div class="b3-dialog__action">
    <button class="b3-button b3-button--cancel">${this.i18n.cancel}</button><div class="fn__space"></div>
<!--    <button class="b3-button b3-button&#45;&#45;text">${this.i18n.save}</button>-->
</div>`,
            width: this.isMobile ? "92vw" : "820px",
        });
        const btnsElement = dialog.element.querySelectorAll(".b3-button");

        btnsElement[0].addEventListener("click", () => {
            dialog.destroy();
        });
        // btnsElement[1].addEventListener("click", () => {
        //     this.saveData(STORAGE_NAME, {readonlyText: inputElement.value});
        //     dialog.destroy();
        // });
        let dialog_content=dialog.element.querySelector('.b3-dialog__content')
        // dialog_content.querySelector('#testbtn').addEventListener('click',()=>{
        //     console.log("dialog_content:")
        //     console.log(dialog_content)
        // })

        let config=document.createElement("div")
        dialog_content.appendChild(config);
        config.className = "fn__block";

        config.innerHTML=`
<div style="padding-bottom: 10px">
<h4>配置说明</h4>
<b>新建</b>: 增加一个工具栏图标配置<br>
<b>加载图标</b>: 显示思源所有图标,然后你可以复制图标名称填入到图标输入框<br>
<b>保存配置</b>: 保存所有配置,无快捷键的配置会被忽略<br>
<b>刷新页面</b>: 刷新页面使配置生效
</div>

<button data-type="new">新建</button>
<button data-type="load-icons">加载图标</button>
<button data-type="save">保存配置</button>
<button data-type="reload">刷新页面</button>
<span data-type="msg"></span>
`
        let msg=config.querySelector('[data-type="msg"]')

        let keylist=elementFromHTML(`<div data-type="keylist" class="plugin-add-shortcut-to-topbar__block"></div>`) as HTMLElement
        config.appendChild(keylist)

        let iconlist=elementFromHTML(`<div data-type="iconlist" class="plugin-add-shortcut-to-topbar__fn_clear "></div>`) as HTMLElement
        config.appendChild(iconlist)

        //点击图标复制名称
        iconlist.addEventListener('click',e=>{
            let t=e.target as HTMLElement;
            console.log("点击图标:")
            console.log(t)
            if (t.dataset['type']=='iconName') {
                navigator.clipboard.writeText(t.textContent.trim())
                    .then(() => {
                        console.log("复制成功")
                        t.setAttribute("data-content", "已复制");
                        setTimeout(() => {
                            t.setAttribute("data-content", "点击复制");
                        }, 1500);
                    }, (err) => {
                        console.error('Async: Could not copy text: ', err)
                    })

            }
        })

        // 加载配置
        let saved_keylist=this.data[STORAGE_NAME]
        console.log("保存的配置:")
        console.log(saved_keylist)
        if (saved_keylist) {
            for (let i = 0; i < saved_keylist.length; i++) {
                let _config=saved_keylist[i]
                let one_config_ele = create_one_keyboard_config.call(this,{
                    enable: _config.enable,
                    name: _config.title,
                    keystr: _config.shortcut,
                    icon:_config.icon,
                    position:_config.position,
                    keyinfo:_config.keyinfo
                })
                keylist.appendChild(one_config_ele)
            }
        }

        // 新建
        config.querySelector('[data-type="new"]').addEventListener('click',(e)=>{
            e.preventDefault();
            e.stopPropagation()
            console.log("新建:")
            console.log(e.target)
            let aa=create_one_keyboard_config.call(this,{})
            keylist.appendChild(aa)
        })
        // 保存
        config.querySelector('[data-type="save"]').addEventListener('click',(e)=>{
            e.preventDefault();
            e.stopPropagation()
            msg.innerHTML=''
            console.log("保存:")
            console.log(e.target)
            let keylists=[]
            let i=0;
            let child;
            for (let j = 0; j <keylist.childElementCount; j++) {
                child=keylist.childNodes[j] as HTMLElement
                let cur_config = get_config_from_element(child);
                if(cur_config){
                    keylists.push(cur_config)
                }
            }
            console.log("保存配置:")
            console.log(keylists)
            this.saveData(STORAGE_NAME, keylists);

            setTimeout(()=>{
                msg.innerHTML=`已保存${keylists.length}个工具栏图标`
            },200)
        })
        // 加载图标
        config.querySelector('[data-type="load-icons"]').addEventListener('click',(e)=>{
            iconlist.innerHTML=""
            msg.innerHTML=''
            iconlist.setAttribute('hidden','')
            let allSymbols = document.querySelectorAll('symbol');
            let _symbol,_id,icon_cnt=0
            for (let i = 0; i <allSymbols.length; i++) {
                _symbol=allSymbols[i]
                _id=_symbol.getAttribute('id')
                if (_id) {
                    icon_cnt++
                    // let newHtml = `<div><svg class="plugin-add-shortcut-to-topbar__svg"><use xlink:href="#${_id}"></use></svg>${_id}</div>`;
                    let newHtml = `<div><svg class="plugin-add-shortcut-to-topbar__svg"><use xlink:href="#${_id}"></use></svg>
<div class="hover-text" data-content="点击复制" data-type="iconName">${_id}</div>
</div>`;
                    let newEle=elementFromHTML(newHtml) as HTMLElement
                    iconlist.appendChild(newEle)
                }
            }
            setTimeout(()=>{
                iconlist.removeAttribute('hidden')
                msg.innerHTML=`已加载${icon_cnt}个图标`
            },200)
        })
        //刷新页面,使修改生效
        config.querySelector('[data-type="reload"]').addEventListener('click',(e)=>{
            window.location.reload()
        })
    }

}

function elementFromHTML(html:string, trim = true) {
  // Process the HTML string.
  html = trim ? html.trim() : html;
  if (!html) return null;

  // Then set up a new template element.
  const template = document.createElement('template');
  template.innerHTML = html;
  const result = template.content.children;

  // Then return either an HTMLElement or HTMLCollection,
  // based on whether the input HTML had one or more roots.
  if (result.length === 1) return result[0];
  return result;
}

// 创建一个配置项元素
function create_one_keyboard_config({name='',keystr='',enable=true,icon='iconGithub',position='right',keyinfo=""}){
    let a=document.createElement("div")
    a.innerHTML=`标题 <input type="text" data-type="title" value="${name}" placeholder="提示语,可选" spellcheck="false" class="plugin-add-shortcut-to-topbar__titleInput"/>
快捷键 <input type="text" data-type="shortcut" value="${keystr}" placeholder="按下快捷键,必填" spellcheck="false" class="plugin-add-shortcut-to-topbar__shortcutInput" size="15" />
图标 <input type="text" data-type="icon" value="${icon}" spellcheck="false" class="plugin-add-shortcut-to-topbar__iconInput"/>
<svg class="b3-menu__icon">
<use xlink:href="#${icon}"></use>
</svg>位置
<select data-type="position">
<option value="right">right</option>
<option value="left">left</option>
</select>
启用 <input type="checkbox" data-type="enable" ${enable?'checked':''} />
<button>删除</button>`

    a.className='fn__flex-1';

    a.querySelector('button').addEventListener('click',(e)=>{
        let t=e.target as HTMLElement
        let p=t.parentElement
        console.log("p:")
        console.log(p)
        setTimeout(()=>{
            p?.remove()
        },100)
    });
    let posEle=a.querySelector('[data-type="position"]') as HTMLSelectElement
    posEle.value=position;

    let shortcutEle=a.querySelector('[data-type="shortcut"]') as HTMLInputElement
    shortcutEle.dataset['keyinfo']=keyinfo;
    shortcutEle.addEventListener('keydown', (event:KeyboardEvent) => {
        event.stopPropagation();
        event.preventDefault();

        let t=event.target as HTMLInputElement
        const keymapStr = _getKeymapString(event);

        let {ctrlKey,shiftKey,altKey,metaKey,key,code,keyCode}=event;
        let keyinfo={ctrlKey,shiftKey,altKey,metaKey,key,code,keyCode}
        console.log("keyinfo:")
        console.log(keyinfo)
        let keyinfo_str=JSON.stringify(keyinfo)
        console.log(keyinfo_str)
        t.dataset['keyinfo']=keyinfo_str;

        setTimeout(() => {
            let v=updateHotkeyTip(keymapStr)
            t.value = v == "Backspace" ? "" : v;
        });
    })
    a.querySelector('[data-type="icon"]').addEventListener('change', (event:KeyboardEvent) => {
        event.stopPropagation();
        event.preventDefault();
        let t=event.target as HTMLInputElement
        console.log("图标id为:"+t.value)
        let use=a.querySelector('use')
        use.setAttribute('xlink:href', `#${t.value}`)
    })
    return a
}

function get_config_from_element(element:Element):any {
    let config:{[key:string]:any}={}
    let shortcutInput=element.querySelector('[data-type="shortcut"]') as HTMLInputElement
    if(!shortcutInput.value){
        return null
    }
    config.shortcut=shortcutInput.value
    config.keyinfo=shortcutInput.dataset['keyinfo'] || ""
    let titleInput=element.querySelector('[data-type="title"]') as HTMLInputElement
    config.title=titleInput.value
    let iconInput=element.querySelector('[data-type="icon"]') as HTMLInputElement
    config.icon=iconInput.value
    let posSelect=element.querySelector('[data-type="position"]') as HTMLSelectElement
    config.position=posSelect.value
    let enableInput=element.querySelector('[data-type="enable"]') as HTMLInputElement
    config.enable=enableInput.checked
    return config
}


/**
 * copy from siyuan
 */
const isMac = () => {
    return navigator.platform.toUpperCase().indexOf("MAC") > -1;
};
function _getKeymapString(event: KeyboardEvent) {
    let keymapStr = "";
    if (event.ctrlKey && isMac()) {
        keymapStr += "⌃";
    }
    if (event.altKey) {
        keymapStr += "⌥";
    }
    if (event.shiftKey) {
        keymapStr += "⇧";
    }
    if (event.metaKey || (!isMac() && event.ctrlKey)) {
        keymapStr += "⌘";
    }
    if (event.key !== "Shift" && event.key !== "Alt" && event.key !== "Meta" && event.key !== "Control" && event.key !== "Unidentified") {
        if (event.keyCode === 229) {
            // windows 中文输入法下 shift + - 等
            if (event.code === "Minus") {
                keymapStr += "-";
            } else if (event.code === "Semicolon") {
                keymapStr += ";";
            } else if (event.code === "Quote") {
                keymapStr += "'";
            } else if (event.code === "Comma") {
                keymapStr += ",";
            } else if (event.code === "Period") {
                keymapStr += ".";
            } else if (event.code === "Slash") {
                keymapStr += "/";
            }
        } else {
            keymapStr += Constants.KEYCODELIST[event.keyCode] || (event.key.length > 1 ? event.key : event.key.toUpperCase());
        }
    }
    return keymapStr;
}

const updateHotkeyTip = (hotkey: string) => {
    if (isMac()) {
        return hotkey;
    }

    const KEY_MAP = new Map(Object.entries({
        "⌘": "Ctrl",
        "⌃": "Ctrl",
        "⇧": "Shift",
        "⌥": "Alt",
        "⇥": "Tab",
        "⌫": "Backspace",
        "⌦": "Delete",
        "↩": "Enter",
    }));

    const keys = [];

    if ((hotkey.indexOf("⌘") > -1 || hotkey.indexOf("⌃") > -1)) keys.push(KEY_MAP.get("⌘"));
    if (hotkey.indexOf("⇧") > -1) keys.push(KEY_MAP.get("⇧"));
    if (hotkey.indexOf("⌥") > -1) keys.push(KEY_MAP.get("⌥"));

    // 不能去最后一个，需匹配 F2
    const lastKey = hotkey.replace(/⌘|⇧|⌥|⌃/g, "");
    if (lastKey) {
        keys.push(KEY_MAP.get(lastKey) || lastKey);
    }

    return keys.join("+");
};


