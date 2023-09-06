import {loadElementPlus} from "@/plugins/element-plus";
import {App} from 'vue'
import {loadVMdEditor} from "@/plugins/md-editor";

export function setupPlugins(app:App<Element>) {
    loadElementPlus(app)
    loadVMdEditor(app)
}