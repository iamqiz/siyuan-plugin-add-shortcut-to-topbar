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
    TEventBus, Lute, IProtyleOption, fetchSyncPost,
} from "siyuan";
import "./index.scss";
import * as mylib from "./libs"
import {IMenuBaseDetail} from "siyuan/types/events";
import {IProtyle} from "siyuan/types/protyle";
//配置存储位置: SiYuan工作空间\data\storage\petal\<plugin-name>
const STORAGE_NAME = "keylistConfig";
const STORAGE_NAME2 = "keylistConfig2";
const TAB_TYPE = "custom_tab";
const DOCK_TYPE = "dock_tab";
type TypeMapString2Function = {
  [key: string]: Function;
};
// import {Sortable} from "sortablejs";
import Sortable from 'sortablejs';
// import {Sortable} = require("sortablejs")
const sleep1 = (ms: number) => new Promise((r) => setTimeout(r, ms));

let builtinEditTools:{[key:string]:string[]}= {
        "block-ref": ["iconRef","引用"],
        "a": ["iconLink","链接"],
        "text": ["iconFont","外观"],
        "strong": ["iconBold","粗体"],
        "em": ["iconItalic","斜体"],
        "u": ["iconUnderline","下划线"],
        "s": ["iconStrike","删除线"],
        "mark": ["iconMark","标记"],
        "sup": ["iconSup","上标"],
        "sub": ["iconSub","下标"],
        "clear": ["iconClear","清除行级元素"],
        "code": ["iconInlineCode","行级代码"],
        "kbd": ["iconKeymap","键盘"],
        "tag": ["iconTags","标签"],
        "inline-math": ["iconMath","行级公式"],
        "inline-memo": ["iconM","备注"],
    }
export default class PluginSample extends Plugin {

    private isMobile: boolean;
    private isToolbarReorder: boolean;
    private installedPlugins: string[]

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

<symbol id="iconDrag24-05-16" viewBox="0 0 1024 1024">
<path d="M1015.254 493.724l-0.007-0.007-153.378-153.378c-11.66-11.66-30.741-11.66-42.401 0l-0.007 0.007c-11.661 11.661-11.661 30.742 0 42.403l101.124 101.124H536.728V101.606L639.661 204.54c11.66 11.66 30.741 11.66 42.401 0l0.007-0.007c11.661-11.661 11.661-30.742 0-42.403L528.684 8.745c-11.66-11.66-30.741-11.66-42.401 0l-0.007 0.007-0.001 0.001L332.898 162.13c-11.661 11.661-11.661 30.742 0 42.403l0.007 0.007c11.66 11.66 30.741 11.66 42.401 0l99.316-99.316v378.649H103.414l101.124-101.124c11.661-11.661 11.661-30.742 0-42.403l-0.007-0.007c-11.66-11.66-30.741-11.66-42.401 0L8.752 493.717l-0.007 0.007c-11.661 11.661-11.661 30.742 0 42.403l0.007 0.007L162.13 689.512c11.66 11.66 30.741 11.66 42.401 0l0.007-0.007c11.661-11.661 11.661-30.742 0-42.403L103.414 545.978h371.208v372.798l-99.316-99.316c-11.66-11.66-30.741-11.66-42.401 0l-0.007 0.007c-11.661 11.661-11.661 30.742 0 42.403l153.385 153.385c11.66 11.66 30.741 11.66 42.401 0L682.069 861.87c11.661-11.661 11.661-30.742 0-42.403l-0.007-0.007c-11.66-11.66-30.741-11.66-42.401 0L536.728 922.394V545.978h383.858L819.462 647.102c-11.661 11.661-11.661 30.742 0 42.403l0.007 0.007c11.66 11.66 30.741 11.66 42.401 0l153.378-153.378 0.007-0.007c11.66-11.661 11.66-30.742-0.001-42.403z" fill="#141414" p-id="3264"></path>
</symbol>

<symbol id="iconSeparator240530" viewBox="0 0 1024 1024">
<path d="M469.333333 0h20.333334v1024H469.333333z" fill="#2c2c2c" p-id="4924" data-spm-anchor-id="a313x.search_index.0.i4.59913a81A9fOEr" class=""></path>
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
            console.log(`${this.name} 加载top bar配置:`)
            console.log(keylists)
            console.log(`length:${keylists.length}个`)
            // console.log(typeof keylists)
            // console.log( keylists instanceof Array)
            if(keylists instanceof Array){
                for (let i = 0; i < keylists.length; i++) {
                    let shortcutCfg = keylists[i];
                    console.log(`${i} ${shortcutCfg.enable?"启用":"禁用"} ${shortcutCfg.shortcut}`)
                    if (!shortcutCfg.enable) {
                        continue
                    }
                    console.log("shortcutCfg:")
                    console.log(shortcutCfg)
                    //只添加没有id的 (即用户自定义的)
                    if (shortcutCfg.id) {
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
        // 编辑器工具栏配置加载
        this.loadData(STORAGE_NAME2).then((keylists)=>{
            console.log(`${this.name} 加载editor bar配置:`)
            console.log(keylists)
            console.log(`length:${keylists.length}个`)
            // console.log(typeof keylists)
            // console.log( keylists instanceof Array)
            // 通过css的display=none 来禁用(隐藏)默认的toolbar工具
            let css=''
            if(keylists instanceof Array){
                let _protyleOptions:IProtyleOption={toolbar:[]}
                for (let i = 0; i < keylists.length; i++) {
                    let shortcutCfg = keylists[i];
                    console.log(`${i} ${shortcutCfg.enable?"启用":"禁用"} ${shortcutCfg.shortcut}`)

                    if (shortcutCfg.id) {
                        _protyleOptions.toolbar.push(shortcutCfg.id);
                        if (!shortcutCfg.enable) {
                            css+= ` .protyle-toolbar>button[data-type="${shortcutCfg.id}"] { display:none; }\n`
                        }
                    }else {
                        if (shortcutCfg.type=="separator") {
                            // _protyleOptions.toolbar.push({
                            //     name: this.name + "_toolbar_" + i,
                            //     icon: "iconSeparator240530",
                            //     hotkey: "",
                            //     tipPosition: "n",
                            //     tip: '分割线',
                            //     click(protyle: Protyle) {}
                            // })
                            _protyleOptions.toolbar.push("|");
                            continue
                        }
                        if (!shortcutCfg.enable) {
                            continue;
                        }
                        _protyleOptions.toolbar.push({
                            name: this.name+"_toolbar_"+i,
                            icon: shortcutCfg.icon,
                            hotkey: "",
                            tipPosition: "n",
                            tip: `${shortcutCfg.title} (执行${shortcutCfg.shortcut})`,
                            click(protyle: Protyle) {
                                // ⇧⌘I
                                // protyle.insert("😊");
                                console.log("protyle:");
                                console.log(protyle);
                                console.log(protyle.protyle.options);
                                // let p = protyle.getInstance() as Protyle;
                                let range = protyle.getRange(protyle.protyle.wysiwyg.element);
                                // console.log("版本:"+protyle.version)
                                const selectText = range.toString();
                                console.log("选中文本:" + selectText);
                                // protyle.insert("("+selectText+")");
                                let keyinfo = JSON.parse(shortcutCfg.keyinfo);
                                let editor = document.querySelector(".layout__center [data-type='wnd'].layout__wnd--active > .layout-tab-container > div:not(.fn__none) .protyle-wysiwyg") as HTMLElement;
                                console.log("editor:");
                                console.log(editor);
                                if (editor) {
                                    setTimeout(() => {
                                        editor.dispatchEvent(new KeyboardEvent("keydown", {...keyinfo, bubbles: true}));
                                    }, 100);
                                }else {
                                    console.log(`找不到editor`)
                                }
                            }
                        });
                    }
                }
                this.protyleOptions=_protyleOptions
            }
            const pluginsStyle = document.getElementById("pluginsStyleQAZ");
            if (pluginsStyle) {
                pluginsStyle.innerHTML = css;
            } else {
                document.head.insertAdjacentHTML("beforeend", `<style id="pluginsStyleQAZ">${css}</style>`);
            }
        })
        console.log(this.i18n.helloPlugin + this.name);
        console.log("this.topBarIcons:");
        // console.log(this.topBarIcons);
        // ws-main 触发频繁
        // this.eventBus.on("ws-main",()=>{
        //     console.log("触发:ws-main事件")
        // })
        // this.eventBus.on("loaded-protyle-static",()=>{
        //     console.log("触发: [loaded-protyle-static] 事件")
        // })
        this.eventBus.on("loaded-protyle-static",this.onEvent_loaded_protyle_static.bind(this))
    }


    onLayoutReady() {
        console.log("----onLayoutReady:"+this.name)
        console.log(`frontend: ${getFrontend()}; backend: ${getBackend()}`);
        if (1) {
            // document.querySelector('')
        }
    }

    onEvent_loaded_protyle_static({detail}: any){
        console.log("触发: [loaded-protyle-static] 事件")
        // console.log(detail)
        // console.log(this.name)
        // console.log(this.displayName)
        if (1) {
            if (this.isToolbarReorder) {
                console.log("已经初始化顶栏")
                return
            }
            console.log("初始化顶栏...")
            let pluginTopIconsUnpin=window.siyuan.storage[Constants.LOCAL_PLUGINTOPUNPIN]
            console.log("pluginTopIconsUnpin:")
            console.log(pluginTopIconsUnpin)
            let toolbarEle = document.querySelector("#toolbar");
            if (toolbarEle) {
                let aa:string[]=[]
                // toolbarEle.childNodes
                // toolbarEle.children
                Array.from(toolbarEle.children).forEach((e)=>{
                    let a=e as HTMLElement;
                    console.log(a)
                    aa.push(a.id)
                })
                console.log("初始工具栏ids:")
                console.log(aa)
            }
            // 思源主菜单
            let barWorkspaceEle = document.querySelector("#barWorkspace");
            // 最小化/最大化/关闭
            let windowControlsEle = document.querySelector("#windowControls");
            let left_tools=[]
            let right_tools=[]
            let saved_keylist=this.data[STORAGE_NAME]
            // return;
            if (saved_keylist instanceof Array) {
                console.log("顶栏配置:")
                console.log(saved_keylist)
                let current_plugin_id_prefix=`plugin_${this.name}_`
                let toolbar_ele
                let idx=1
                let toolid
                for (let i = 0; i < saved_keylist.length; i++) {
                    let _config = saved_keylist[i];
                    if (_config.id) {
                        toolid = _config.id;
                        // toolbar_ele = toolbarEle.querySelector(`#${_config.id}`);
                        // toolbar_ele = toolbarEle.querySelector(`#${toolid}`);
                    } else {
                        if (!_config.enable) {
                            continue
                        }
                        toolid = current_plugin_id_prefix + idx;
                        console.log("自定义配置:" + toolid);
                        console.log(_config);
                        // toolbar_ele=toolbarEle.querySelector(`#${current_plugin_id_prefix+idx}`)
                        idx++;
                    }
                    toolbar_ele = toolbarEle.querySelector(`#${toolid}`);
                    if (!toolbar_ele) {
                        // 配置里有,但是实际不存在的图标,跳过
                        console.log("不存在:" + toolid);
                        console.log(_config);
                        continue;
                    }
                    // 如果已被unpin,则不考虑自定义配置,思源会将其隐藏
                    if (_config.id && pluginTopIconsUnpin.includes(_config.id)) {

                    }else {
                        if (_config.enable) {
                            toolbar_ele.classList.remove("fn__none");
                        } else {
                            toolbar_ele.classList.add("fn__none");
                        }
                    }
                    if (_config.position == "left") {
                        left_tools.push(toolbar_ele);
                    } else {
                        right_tools.push(toolbar_ele);
                    }
                }
                if (left_tools.length>0) {
                    //已配置的左边工具放在左端
                    barWorkspaceEle.after(...left_tools)
                }
                if (right_tools.length>0) {
                    //已配置的右边工具放在右端
                    windowControlsEle.before(...right_tools)
                }
            }else {
                console.log("顶栏配置不存在")
            }
            this.isToolbarReorder=true
        }
    }

    onunload() {
        console.log(this.i18n.byePlugin);
    }

    uninstall() {
        console.log("uninstall "+this.name);
    }

    // 自定义设置
    openSetting() {
        getInstalledPluginsSync().then(r => {
            console.log("异步返回已安装插件:")
            console.log(r)
            this.installedPlugins=r || []
            this.openSetting1()
        })
    }

    openSetting1() {
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
        let readmeElement = this.createReadmeElement();
        dialog_content.appendChild(readmeElement);
        let topbar_tip_ele=elementFromHTML(`<div style="padding-bottom: 5px"><b>配置顶部工具栏</b></div>`) as HTMLElement
        dialog_content.appendChild(topbar_tip_ele);
        // 图标列表
        let iconListElement=this.createIconListElement();
        let topbarCofigElement = this.createConfigElement('topbar',iconListElement);
        dialog_content.appendChild(topbarCofigElement);
        // protyle toolbar
        let protyleToolbarDetail = elementFromHTML(
`<details style="border-top: 1px black solid; margin: 10px 0px;">
<summary style="height: 25px"><b>点击配置笔记工具栏</b></summary>
</details>`) as HTMLElement;
        let protyleToolbar = this.createConfigElement('editorbar',iconListElement);
        protyleToolbarDetail.appendChild(protyleToolbar);
        dialog_content.appendChild(protyleToolbarDetail)

        let icon_tip_ele=elementFromHTML(`<div style="border-top: 1px black solid;padding-bottom: 5px;"><b>图标列表</b>(点击<b>加载图标</b>按钮可显示)</div>`) as HTMLElement
        dialog_content.appendChild(icon_tip_ele);
        dialog_content.appendChild(iconListElement);
        if (1) {
            // getInstalledPlugins()
            // getInstalledPluginsSync()
        }

    }
    createReadmeElement(){
        let html
        let html1=`<div style="padding-bottom: 10px">
<h4>配置说明</h4>
<b>新建</b>: 增加一个工具栏图标配置<br>
<b>加载图标</b>: 显示思源所有图标,然后你可以复制图标名称填入到图标输入框<br>
<b>保存配置</b>: 保存所有配置,无快捷键的配置会被忽略<br>
<b>刷新页面</b>: 刷新页面使配置生效
<details>
<summary style="height: 25px">更多</summary>
拖动十字可以自定义排序
<textarea class="fn__block">
范德萨发的十多个
</textarea>
</details>
</div>`
        html=`
<div style="margin-bottom: 10px;border-bottom: 1px black solid;">
<h4>配置说明</h4>
<br>
拖动十字图标可以自定义排序<br>
<p>结尾带New的项表示对应的图标不在配置中,因此图标最终的位置不固定,你可在调整顺序后点击<b>保存配置</b>来固定其顺序</p>
<details>
<summary style="height: 25px">更多</summary>
<p>
各个按钮的功能如下:
</p>
<b>新建</b>: 增加一个工具栏图标配置<br>
<b>加载图标</b>: 显示思源所有图标,然后你可以复制图标名称填入到图标输入框<br>
<b>保存配置</b>: 保存所有配置,无快捷键的配置会被忽略<br>
<b>刷新页面</b>: 刷新页面使配置生效<br>
<p></p>
</details>
</div>
`
        let ele=elementFromHTML(html) as HTMLElement

        return ele
    }
    createConfigElement(type:string, iconlist :HTMLElement){
        let config=document.createElement("div")
        config.className = "fn__block";
        config.dataset['type'] = type+"Config";

// ${type!=="topbar"?`<button data-type="reset">恢复默认</button>`:""}

        config.innerHTML=`
<button data-type="new">新建</button>
<button data-type="load-icons">加载图标</button>
<button data-type="save">保存配置</button>
<button data-type="reload">刷新页面</button>
<button data-type="delete-storage">重置配置</button>
${type!=="topbar"?`<button data-type="separator">插入分割线</button>`:""}
${type=="topbar"?`<button data-type="test">测试</button>`:""}
<span data-type="msg"></span>
`
        let msg=config.querySelector('[data-type="msg"]')

        let keylist=elementFromHTML(`<div data-type="keylist" class="plugin-add-shortcut-to-topbar__block"></div>`) as HTMLElement
        config.appendChild(keylist)

        // new Sortable(keylist, {
        //     animation: 150,
        //     ghostClass: "blue-background-class"
        // });
        // https://github.com/SortableJS/Sortable
        // https://sortablejs.github.io/Sortable/
        Sortable.create(keylist, {
            // filter: 'input',
            handle:'[data-draggable]'
        });

        // 加载配置
        let saved_keylist
        if (type=='topbar') {
            saved_keylist=this.data[STORAGE_NAME];
        }else {
            saved_keylist=this.data[STORAGE_NAME2];
        }
        console.log(`保存的 ${type} 配置:`)
        console.log(saved_keylist)

        let one_config_ele;
        if (type ==='topbar') {
            let sep_line
            if (!_isMobile() && !_isWindow()) {
                sep_line=elementFromHTML(`<div data-type="left-right-line" data-draggable style="margin-left: 20%;">- - - - - - 左 右 分 界 线- - - - - - -</div>`) as HTMLElement
                keylist.appendChild(sep_line);
            }
            if (saved_keylist) {
                // let installedPlugins = getInstalledPlugins();
                // let installedPlugins = getInstalledPluginsSync();
                let installedPlugins = this.installedPlugins || [];
                console.log("已安装插件:")
                console.log(installedPlugins)
                console.log(installedPlugins.length)
                for (let i = 0; i < saved_keylist.length; i++) {
                    let _config = saved_keylist[i];
                    // 如果配置对应的插件已经被卸载,则隐藏该配置(设置 hidden 属性)
                    let needHidden=false
                    let _id=_config.id||""
                    if (_id.startsWith('plugin_') && _id.search(/_\d+$/)>-1) {
                        let plugin_dir_name = _id.substring("plugin_".length, _id.search(/_\d+$/));
                        console.log("顶栏配置,对应插件:"+plugin_dir_name)
                        console.log(_config)
                        // 图标对应的插件已卸载,则在设置中隐藏
                        if (!installedPlugins.includes(plugin_dir_name)) {
                            needHidden=true
                            console.log("已卸载的插件:"+plugin_dir_name)
                        }
                    }
                    // 如果对应的图标被unpin了,那么 enable状态变成false
                    let isUnpined=false
                    let pluginTopIconsUnpin=window.siyuan.storage[Constants.LOCAL_PLUGINTOPUNPIN] || []
                    if (_config.id && pluginTopIconsUnpin.includes(_config.id) ) {
                        isUnpined=true
                    }
                    one_config_ele = createTopbarConfigElement.call(this, type, {
                        enable: isUnpined ? false:_config.enable,
                        name: _config.title,
                        keystr: _config.shortcut,
                        icon: _config.icon,
                        position: _config.position,
                        keyinfo: _config.keyinfo,
                        id: _config.id,
                        hidden:needHidden,
                        isUnpined:isUnpined
                    });
                    // keylist.appendChild(one_config_ele);
                    if (_config.position=='left') {
                        sep_line.before(one_config_ele)
                    }else {
                        keylist.appendChild(one_config_ele);
                    }
                }
                // 增加不在配置里的新图标
                this.initBuiltinTopbarTools(keylist);
            } else {
                // 无配置情况
                this.initBuiltinTopbarTools(keylist);
            }
        }else if (type!=='topbar'){
            if (saved_keylist) {
                for (let i = 0; i < saved_keylist.length; i++) {
                    let _config = saved_keylist[i];
                    if (_config.type=="separator") {
                        one_config_ele=createEditbarSeparatorElement()
                        keylist.appendChild(one_config_ele);
                        continue
                    }
                    one_config_ele = createEditbarConfigElement.call(this, type, {
                        enable: _config.enable,
                        name: _config.title,
                        keystr: _config.shortcut,
                        icon: _config.icon,
                        keyinfo: _config.keyinfo,
                        keyinfo2: _config.keyinfo2,
                        id: _config.id
                    });
                    keylist.appendChild(one_config_ele);
                }
            } else {
                initBuiltinEditorTools(keylist)
            }
        }else if (1){
        }

        // 新建
        let _aa
        config.querySelector('[data-type="new"]').addEventListener('click',(e)=>{
            e.preventDefault();
            e.stopPropagation()
            console.log("新建:")
            console.log(e.target)
            _aa= type == "topbar" ? createTopbarConfigElement.call(this, type, {}) : createEditbarConfigElement.call(this, type, {})
            keylist.appendChild(_aa)
        })
        config.querySelector('[data-type="separator"]')?.addEventListener('click',(e)=>{
            e.preventDefault();
            e.stopPropagation()
            console.log("新建分割线")
            let _bb
            _bb=createEditbarSeparatorElement()
            keylist.appendChild(_bb)
        })
        //测试
        config.querySelector('[data-type="test"]')?.addEventListener('click',(e)=>{
            e.preventDefault();
            e.stopPropagation()
            console.log("测试:")
            console.log(e.target)
            // console.log(this.topBarIcons);
            // _aa= type == "topbar" ? createTopbarConfigElement.call(this, type, {}) : createEditbarConfigElement.call(this, type, {})
            // keylist.appendChild(_aa)
        })
        config.querySelector('[data-type="delete-storage"]')?.addEventListener('click',(e)=>{
            e.preventDefault();
            e.stopPropagation()
            // console.log("测试:")
            // console.log(e.target)
            // console.log(this.topBarIcons);
            let text = "重置" + (type === "topbar" ? "顶栏" : "编辑器") + "本地配置?";
            confirm("",text,(dialog)=>{
                console.log(`点击了确定`)
                // console.log("插件:"+this.name)
                let storage_name = type === "topbar" ? STORAGE_NAME : STORAGE_NAME2;
                this.removeData(storage_name).then((response)=>{
                    console.log("removeData callback:")
                    console.log(response)
                    if (response.code==0) {
                        confirm("", "已完成,是否刷新页面?", (dialog2) => {
                            console.log(`点击了确定22`);
                            window.location.reload()
                        });
                    }
                })
            })
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
            let cur_config
            let toolbar_pos='left'
            let pluginTopIconsUnpin = window.siyuan.storage[Constants.LOCAL_PLUGINTOPUNPIN] || [];
            for (let j = 0; j <keylist.childElementCount; j++) {
                child=keylist.childNodes[j] as HTMLElement
                if (type=='topbar') {
                    if (child.dataset['type']=='left-right-line') {
                        toolbar_pos='right'
                        continue
                    }
                    cur_config = get_topbarConfig_from_element(child);
                    if (cur_config) {
                        // cur_config.pos2=toolbar_pos;
                        cur_config.position=toolbar_pos;
                        // 如果现在是启用状态且之前被unpin,则移除unpin
                        if (cur_config.enable && cur_config.id && pluginTopIconsUnpin.includes(cur_config.id)) {
                            // 删除
                            window.siyuan.storage[Constants.LOCAL_PLUGINTOPUNPIN].splice(window.siyuan.storage[Constants.LOCAL_PLUGINTOPUNPIN].indexOf(cur_config.id), 1);
                        }
                    }
                }else{
                    if (child.dataset['type']=='separator') {
                        cur_config = {type: "separator"};
                    } else {
                        cur_config = get_editbarConfig_from_element(child);
                    }
                }
                if(cur_config){
                    keylists.push(cur_config)
                }
            }
            // 将unpin状态保存到本地
            // 参考: siyuan项目 app/src/layout/topBar.ts:333 openPlugin()
            // setStorageVal(Constants.LOCAL_PLUGINTOPUNPIN, window.siyuan.storage[Constants.LOCAL_PLUGINTOPUNPIN]);
            if (1 && type=='topbar') {
                let _key=Constants.LOCAL_PLUGINTOPUNPIN
                let _val=window.siyuan.storage[Constants.LOCAL_PLUGINTOPUNPIN]
                fetchPost("/api/storage/setLocalStorageVal", {
                    app: Constants.SIYUAN_APPID,
                    key:_key,
                    val:_val,
                },(response)=>{
                    console.log("unpin状态保存到本地,response:")
                    console.log(response)
                });
            }
            console.log("保存配置:");
            console.log(keylists)
            if (type=='topbar') {
                this.saveData(STORAGE_NAME, keylists);
            }else {
                this.saveData(STORAGE_NAME2, keylists);
            }

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
        //重置
        config.querySelector('[data-type="reset"]')?.addEventListener('click',(e)=>{
            e.preventDefault();
            e.stopPropagation()
            console.log("重置:")
            // console.log(e.target)
            // _aa= type == "topbar" ? createTopbarConfigElement.call(this, type, {}) : createEditbarConfigElement.call(this, type, {})
            // keylist.appendChild(_aa)
            keylist.innerHTML=''
            initBuiltinEditorTools(keylist)
        })
        return config
    }
    createIconListElement(){
        let iconlist=elementFromHTML(`<div data-type="iconlist" class="plugin-add-shortcut-to-topbar__fn_clear "></div>`) as HTMLElement
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
        return iconlist
    }
    initBuiltinTopbarTools0(keylist:HTMLElement){
    let one_config_ele
    _isMobile()
    _isWindow()
    let lr_separator = keylist.querySelector(`[data-type="left-right-line"]`);
    if (1) {
        let baseEle
        let tmpEle
        if (_isMobile()) {
            // document.querySelector("#menuAbout").after(element);
            baseEle = document.querySelector("#menuAbout");
            let nextEle=baseEle.nextElementSibling
            // while (nextEle){
            // }
        }else if(!_isWindow()){
            let right_baseEle=document.querySelector("#barPlugins")
            let left_baseEle=document.querySelector("#drag")
            let baseEle=document.querySelector("#drag")
            // baseEle=document.querySelector("#" + (element.getAttribute("data-position") === "right" ? "barPlugins" : "drag"))
            tmpEle=baseEle.previousElementSibling as HTMLElement
            let pos="right"
            let left_topbar_tools:any[]=[]
            let topbar_tools:{title:string,id:string,icon:string,position:string,enable:boolean}[]=[]
            while(tmpEle){
                let toolinfo={
                    title:tmpEle.getAttribute('aria-label')||'',
                    id:tmpEle.getAttribute('id')||'',
                    icon:tmpEle.querySelector('svg use')?.getAttribute('xlink:href')?.substring(1)||'',
                    position:'left',
                    enable:!tmpEle.classList.contains('fn__none')
                }
                left_topbar_tools.splice(0, 0, toolinfo)
                topbar_tools.splice(0, 0, toolinfo)
                tmpEle=tmpEle.previousElementSibling
            }
            let right_topbar_tools=[]
            tmpEle=baseEle.nextElementSibling as HTMLElement
            while(tmpEle){
                let toolinfo={
                    title:tmpEle.getAttribute('aria-label')||'',
                    id:tmpEle.getAttribute('id')||'',
                    icon:tmpEle.querySelector('svg use')?.getAttribute('xlink:href')?.substring(1)||'',
                    position:'right',
                    enable:!tmpEle.classList.contains('fn__none')
                }

                right_topbar_tools.push(toolinfo)
                topbar_tools.push(toolinfo)
                tmpEle=tmpEle.nextElementSibling
            }
            console.log("顶栏 左 工具:")
            console.log(left_topbar_tools)
            console.log("顶栏 右 工具:")
            console.log(right_topbar_tools)
            console.log("顶栏 所有 工具:")
            console.log(topbar_tools)
            let current_plugin_id_prefix=`plugin_${this.name}_`
            for (let toolinfo of topbar_tools){
                console.log("toolinfo:")
                console.log(toolinfo)
                let isBuiltin=true
                if (toolinfo.id?.startsWith(current_plugin_id_prefix)) {
                    console.log("当前插件的<<")
                    isBuiltin=false
                    // continue
                }
                let tmp_id=toolinfo.id
                if (toolinfo.id.startsWith(current_plugin_id_prefix) && !toolinfo.id.startsWith(current_plugin_id_prefix+"0")) {
                    tmp_id=""
                }
                if (['barWorkspace','windowControls'].includes(toolinfo.id)) {
                    continue;
                }
                one_config_ele = createTopbarConfigElement.call(this, "topbar", {
                    name: toolinfo.title,
                    icon: toolinfo.icon,
                    id: tmp_id,
                    position: toolinfo.position,
                    enable: toolinfo.enable,
                },isBuiltin);
                if (toolinfo.position=='left') {
                    lr_separator.before(one_config_ele)
                }else {
                    keylist.appendChild(one_config_ele);
                }
            }
        }

    }
}
    initBuiltinTopbarTools(keylist:HTMLElement){
    let one_config_ele
    _isMobile()
    _isWindow()
    let lr_separator = keylist.querySelector(`[data-type="left-right-line"]`);
    if (1) {
        let baseEle
        let tmpEle
        if (_isMobile()) {
            // document.querySelector("#menuAbout").after(element);
            baseEle = document.querySelector("#menuAbout");
            let nextEle=baseEle.nextElementSibling
            // while (nextEle){
            // }
        }else if(!_isWindow()){
            let topbar_root=document.querySelector("#toolbar")
            if (!topbar_root) {
                return
            }
            //  let barWorkspaceEle = document.querySelector("#barWorkspace");
            //  let windowControlsEle = document.querySelector("#windowControls");
            let current_plugin_id_prefix=`plugin_${this.name}_`

            let _position='left'
            let _id
            let new_left_tool_elements=[]
            let new_right_tool_elements=[]
            tmpEle=topbar_root.firstElementChild
            while (tmpEle){
                _id=tmpEle.getAttribute('id')||""
                if (_id=='drag') {
                    //左右分界线
                    _position='right'
                }else if (['barWorkspace','windowControls'].includes(_id)) {
                    //跳过
                }else if (_id.startsWith(current_plugin_id_prefix+"") && !_id.startsWith(current_plugin_id_prefix+"0")) {
                    //跳过插件由用户自定义添加的,即id形如 current_plugin_id_prefix+1/2/3/4/..
                    //id为 current_plugin_id_prefix+"0"的图标为本插件自带
                }else {
                    // 一般的图标
                    let toolinfo = {
                        title: tmpEle.getAttribute("aria-label") || "",
                        id: tmpEle.getAttribute("id") || "",
                        icon: tmpEle.querySelector("svg use")?.getAttribute("xlink:href")?.substring(1) || "",
                        position: _position,
                        enable: !tmpEle.classList.contains("fn__none")
                    };
                    let _ele = keylist.querySelector(`input[data-id="${_id}"]`);
                    if (_ele) {
                        //如果存在,则更新信息
                    }else {
                        //如果不存在,则新建
                        let tmp_id = toolinfo.id;
                        //是本插件的图标,但不是first
                        if (toolinfo.id.startsWith(current_plugin_id_prefix) && !toolinfo.id.startsWith(current_plugin_id_prefix + "0")) {
                            tmp_id = "";
                        }
                        one_config_ele = createTopbarConfigElement.call(this, "topbar", {
                            name: toolinfo.title,
                            icon: toolinfo.icon,
                            id: tmp_id,
                            position: toolinfo.position,
                            enable: toolinfo.enable,
                        },{isNew:true});
                        if (_position=='left') {
                            new_left_tool_elements.push(one_config_ele)
                        }else {
                            new_right_tool_elements.push(one_config_ele)
                        }
                    }
                }
                tmpEle=tmpEle.nextElementSibling;
            }
            //新增的图标放在分界元素的两边,紧贴分界
            if (new_left_tool_elements.length>0) {
                lr_separator.before(...new_left_tool_elements)
            }
            if (new_right_tool_elements.length>0) {
                lr_separator.after(...new_right_tool_elements)
            }
            return;
        }
    }
}

}

async function getInstalledPluginsSync(){
    let installedPlugins: string[] = [];
    let url = "/api/bazaar/getInstalledPlugin";

    let response = await fetchSyncPost(url,{
        frontend: getFrontend(),
    });
    console.log("同步返回结果:")
    console.log(response)
    if (response.code == 0) {
        let packages: { [key: string]: string }[] = response.data.packages;
        // console.log(packages);
        packages.forEach((v, idx) => {
            // console.log("idx:"+idx)
            // console.log("idx:" + idx, v.author);
            // console.log("name:" + v.name);
            // console.log("iconURL:" + v.iconURL);
            let ps = v.iconURL ? v.iconURL.split("/") : [];
            // console.log("dirname:"+path.dirname())
            let dirname = ps.length > 1 ? ps[ps.length - 2] : "";
            dirname ? installedPlugins.push(dirname) : [];
        });
        console.log("同步installedPlugins:");
        console.log(installedPlugins);
    }
    return installedPlugins
}
function getInstalledPlugins(){
    let installedPlugins: string[] = [];
    let url = "/api/bazaar/getInstalledPlugin";
    fetchPost(url, {
        frontend: getFrontend(),
    }, (response) => {
        console.log("api结果:");
        // console.log(response);
        // console.log(response.data)
        if (1) {
            if (response.code == 0) {
                let packages: { [key: string]: string }[] = response.data.packages;
                console.log(packages);
                packages.forEach((v, idx) => {
                    // console.log("idx:"+idx)
                    console.log("idx:" + idx, v.author);
                    console.log("name:" + v.name);
                    console.log("iconURL:" + v.iconURL);
                    let ps = v.iconURL ? v.iconURL.split("/") : [];
                    // console.log("dirname:"+path.dirname())
                    let dirname = ps.length > 1 ? ps[ps.length - 2] : "";
                    dirname ? installedPlugins.push(dirname) : [];
                });
                console.log("installedPlugins:");
                console.log(installedPlugins);
            }
        }
    });
    return installedPlugins
}

const _isMobile = () => {
    return document.getElementById("sidebar") ? true : false;
};

const _isWindow = () => {
    return document.getElementById("toolbar") ? false : true;
};

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
//out="";$0.childNodes.forEach(a=>{
//     ty=a.dataset["type"]
//     icon=a.querySelector('svg use')?.getAttribute('xlink:href').substring(1)
//     if(ty && icon){
//         out+=`"${ty}":"${icon}",\n`
//     }
// })
// console.log(out)
function initBuiltinEditorTools(keylist:HTMLElement){
    let one_config_ele
    for (const _id of Object.keys(builtinEditTools)){
        let _config=builtinEditTools[_id]
        one_config_ele = createEditbarConfigElement.call(this,'type',{
                name: _config[1],
                icon:_config[0],
                id:_id,
            });
        keylist.appendChild(one_config_ele)
    }
}
// 创建一个配置项元素
function createTopbarConfigElement(type:string,{name='',keystr='',enable=true,icon='iconGithub',position='right',keyinfo="",id="",hidden=false,isUnpined=false}, {isNew = false}={}){
    let a=document.createElement("div")
    // a.setAttribute("draggable","true")
    // 如果对应的插件已被卸载,则隐藏配置元素
    if (hidden) {
        a.setAttribute('hidden','')
    }
    // let isBuiltInTopbarTool= isBuiltin
    let isBuiltInTopbarTool= id !=="";
    let html
    html=`标题 <input type="text" data-type="title" value="${name}" data-id="${id}" placeholder="提示语,可选" spellcheck="false" class="plugin-add-shortcut-to-topbar__titleInput"/>
快捷键 <input type="text" data-type="shortcut" value="${keystr}" placeholder="按下快捷键,必填" spellcheck="false" class="plugin-add-shortcut-to-topbar__shortcutInput" size="15" />
图标 <input type="text" data-type="icon" value="${icon}" spellcheck="false" class="plugin-add-shortcut-to-topbar__iconInput"/>
<svg class="b3-menu__icon" data-type="tool-icon">
<use xlink:href="#${icon}"></use>
</svg>
<div data-draggable style="display: inline-block">
排序
<svg class="b3-menu__icon" >
<use xlink:href="#iconDrag24-05-16"></use>
</svg>
</div>
<select data-type="position" hidden="">
<option value="right">right</option>
<option value="left">left</option>
</select>
启用 <input type="checkbox" data-type="enable" ${enable?'checked':''} />
<button data-type="delete"  style="margin-left: 10px">删除</button>
<button data-type="editToolId" hidden>${id}</button>
${isNew? "<span>New</span>":""}
${isUnpined? "<span>未钉住</span>":""}
`
    // <button data-type="moveUp">∧</button>
    // <button data-type="moveDown">∨</button>
    // 🔼 🔽  △ ▽ ﹀ ︿
    // ∧∨
    a.innerHTML=html;
    a.className='fn__flex-1';

    a.querySelector('[data-type="delete"]').addEventListener('click',(e)=>{
        let t=e.target as HTMLElement
        let p=t.parentElement
        console.log("p:")
        console.log(p)
        setTimeout(()=>{
            p?.remove()
        },100)
    });
    let builtin_editbar_icons1= [
        "block-ref","a", "text", "strong", "em","u","s","mark","sup","sub","clear","code","kbd","tag","inline-math","inline-memo",
    ]
    // 如果是系统自带的
    if (isBuiltInTopbarTool) {
        a.querySelector('[data-type="delete"]').remove()
        // let sc = a.querySelector('[data-type="shortcut"]') as HTMLInputElement;
        // sc.placeholder="系统自带"
        let titleE = a.querySelector('[data-type="title"]') as HTMLInputElement;
        titleE.setAttribute("disabled","")
    }
    // a.querySelector('[data-type="moveUp"]').addEventListener('click',(e)=>{
    //     let t=e.target as HTMLElement
    //     let p=t.parentElement
    //     if (p.previousElementSibling) {
    //         p.previousElementSibling.before(p)
    //     }
    // });
    // a.querySelector('[data-type="moveDown"]').addEventListener('click',(e)=>{
    //     let t=e.target as HTMLElement
    //     let p=t.parentElement
    //     if (p.nextElementSibling) {
    //         p.nextElementSibling.after(p)
    //     }
    // });
    let posEle=a.querySelector('[data-type="position"]') as HTMLSelectElement
    if (posEle) {
        posEle.value=position;
    }

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
        t.dataset['keyinfo']=keyinfo_str;

        setTimeout(() => {
            let v=updateHotkeyTip(keymapStr)
        console.log(keyinfo_str)
            t.value = v == "Backspace" ? "" : v;
        });
    })
    if (isBuiltInTopbarTool) {
        shortcutEle.placeholder="跟随设置"
        shortcutEle.setAttribute("disabled","")
    }

    let iconInputEle=a.querySelector('[data-type="icon"]') as HTMLInputElement
    iconInputEle.addEventListener('change', (event:KeyboardEvent) => {
        event.stopPropagation();
        event.preventDefault();
        let t=event.target as HTMLInputElement
        console.log("图标id为:"+t.value)
        let use=a.querySelector('[data-type="tool-icon"] use')
        use.setAttribute('xlink:href', `#${t.value}`)
    });
    if (isBuiltInTopbarTool) {
        iconInputEle.setAttribute("disabled","")
    }
    return a
}

function createEditbarSeparatorElement(){
    let a
    let html
    // a=document.createElement("div")
    // sep_line=elementFromHTML(`<div data-type="left-right-line" data-draggable style="margin-left: 20%;">- - - - - - 左 右 分 界 线- - - - - - -</div>`) as HTMLElement
    // data-type="separator" style="margin-left: 10px"
    html=`<div data-draggable style="padding-left: 20%;">垂 直 分 割 线
<svg class="b3-menu__icon" data-type="tool-icon">
<use xlink:href="#iconSeparator240530"></use>
</svg>
<button data-type="delete" >删除</button>
</div>
`
    // a.innerHTML=html;
    a=elementFromHTML(html) as HTMLElement
    a.dataset['type']='separator'
    a.className='fn__flex-1';

    let deleteEle=a.querySelector('[data-type="delete"]') as HTMLButtonElement
    deleteEle.addEventListener('click',(e)=>{
        let t=e.target as HTMLElement
        let p=t.parentElement
        setTimeout(()=>{
            p?.remove()
        },100)
    });

    return a
}

function createEditbarConfigElement(type:string,{name='',keystr='',enable=true,icon='iconGithub',position='right',keyinfo="",keyinfo2="",id=""}){
    let a=document.createElement("div")
    // a.setAttribute("draggable","true")
    let isBuiltInEditTool=type!=='topbar' && builtinEditTools.hasOwnProperty(id)
    let html
    html=`标题 <input type="text" data-type="title" value="${name}" data-id="${id}" placeholder="提示语,可选" spellcheck="false" class="plugin-add-shortcut-to-topbar__titleInput"/>
快捷键 <input type="text" data-type="shortcut" value="${keystr}" placeholder="按下快捷键,必填" spellcheck="false" class="plugin-add-shortcut-to-topbar__shortcutInput" size="15" />
图标 <input type="text" data-type="icon" value="${icon}" spellcheck="false" class="plugin-add-shortcut-to-topbar__iconInput"/>
<svg class="b3-menu__icon" data-type="tool-icon">
<use xlink:href="#${icon}"></use>
</svg>
<div data-draggable style="display: inline-block">
排序
<svg class="b3-menu__icon" >
<use xlink:href="#iconDrag24-05-16"></use>
</svg>
</div>
启用 <input type="checkbox" data-type="enable" ${enable?'checked':''} />
<button data-type="delete" style="margin-left: 10px">删除</button>
<button data-type="editToolId" hidden>${id}</button>
`
    // <button data-type="moveUp">∧</button>
    // <button data-type="moveDown">∨</button>
    // 🔼 🔽  △ ▽ ﹀ ︿
    // ∧∨
    a.innerHTML=html;
    a.className='fn__flex-1';
    let builtin_editbar_icons1= [
        "block-ref","a", "text", "strong", "em","u","s","mark","sup","sub","clear","code","kbd","tag","inline-math","inline-memo",
    ]
    let deleteEle=a.querySelector('[data-type="delete"]') as HTMLButtonElement
    deleteEle.addEventListener('click',(e)=>{
        let t=e.target as HTMLElement
        let p=t.parentElement
        console.log("p:")
        console.log(p)
        setTimeout(()=>{
            p?.remove()
        },100)
    });

    //
    if (isBuiltInEditTool) {
        deleteEle.remove()
        // let sc = a.querySelector('[data-type="shortcut"]') as HTMLInputElement;
        // sc.placeholder="系统自带"
        let titleE = a.querySelector('[data-type="title"]') as HTMLInputElement;
        titleE.setAttribute("disabled","")
    }

    let posEle=a.querySelector('[data-type="position"]') as HTMLSelectElement
    if (posEle) {
        posEle.value=position;
    }

    let shortcutEle=a.querySelector('[data-type="shortcut"]') as HTMLInputElement
    shortcutEle.dataset['keyinfo']=keyinfo;
    shortcutEle.dataset['keyinfo2']=keyinfo2;
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
        t.dataset['keyinfo2']=keymapStr;

        setTimeout(() => {
            let v=updateHotkeyTip(keymapStr)
            // let v=keymapStr
            t.value = v == "Backspace" ? "" : v;
        });
    })
    if (isBuiltInEditTool) {
        shortcutEle.placeholder="跟随设置"
        shortcutEle.setAttribute("disabled","")
    }

    let iconInputEle=a.querySelector('[data-type="icon"]') as HTMLInputElement
    iconInputEle.addEventListener('change', (event:KeyboardEvent) => {
        event.stopPropagation();
        event.preventDefault();
        let t=event.target as HTMLInputElement
        console.log("图标id为:"+t.value)
        let use=a.querySelector('[data-type="tool-icon"] use')
        use.setAttribute('xlink:href', `#${t.value}`)
    });
    if (isBuiltInEditTool) {
        iconInputEle.setAttribute("disabled","")
    }
    return a
}


function get_topbarConfig_from_element(element:HTMLElement):any {
    if (element.dataset['type']) {
        console.log('分割线')
        console.log(element)
    }else {
        console.log("普通配置:")
        console.log(element)
    }
    let config:{[key:string]:any;}={};
    let shortcutInput=element.querySelector('[data-type="shortcut"]') as HTMLInputElement
    let titleInput=element.querySelector('[data-type="title"]') as HTMLInputElement
    if(!shortcutInput.value && !titleInput.dataset['id']){
        return null
    }
    config.shortcut=shortcutInput.value
    config.keyinfo=shortcutInput.dataset['keyinfo'] || ""
    config.title=titleInput.value
    config.id=titleInput.dataset['id']
    let iconInput=element.querySelector('[data-type="icon"]') as HTMLInputElement
    config.icon=iconInput.value
    let posSelect=element.querySelector('[data-type="position"]') as HTMLSelectElement
    config.position=posSelect.value
    let enableInput=element.querySelector('[data-type="enable"]') as HTMLInputElement
    config.enable=enableInput.checked
    return config
}
function get_editbarConfig_from_element(element:Element):any {
    let config:{[key:string]:any}={}
    let shortcutInput=element.querySelector('[data-type="shortcut"]') as HTMLInputElement
    let titleInput=element.querySelector('[data-type="title"]') as HTMLInputElement
    if(!shortcutInput.value && !titleInput.dataset['id']){
        return null
    }
    config.shortcut=shortcutInput.value
    config.keyinfo=shortcutInput.dataset['keyinfo'] || ""
    config.keyinfo2=shortcutInput.dataset['keyinfo2'] || ""
    config.title=titleInput.value
    config.id=titleInput.dataset['id']
    let iconInput=element.querySelector('[data-type="icon"]') as HTMLInputElement
    config.icon=iconInput.value
    // let posSelect=element.querySelector('[data-type="position"]') as HTMLSelectElement
    // config.position=posSelect.value
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


