import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import hljs from 'highlight.js';
import {App} from "vue";

import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index.js';
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';

import createTipPlugin from '@kangc/v-md-editor/lib/plugins/tip/index.js';
import '@kangc/v-md-editor/lib/plugins/tip/tip.css';

import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index.js';


import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index.js';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';

export function loadVMdEditor(app: App<Element>) {
    VMdEditor.use(githubTheme, {
        Hljs: hljs,
        codeHighlightExtensionMap: {
            vue: 'xml',
        },
        config: {
            toc: {
                includeLevel: [1, 2, 3, 4, 5, 6],
            },
        },
    });
    //表情
    VMdEditor.use(createEmojiPlugin());
    //提示
    VMdEditor.use(createTipPlugin());
    //代码行号
    VMdEditor.use(createLineNumbertPlugin());
    //快捷复制代码
    VMdEditor.use(createCopyCodePlugin());
    app.use(VMdEditor);
}
