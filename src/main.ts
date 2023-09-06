import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import {setupRouter} from "@/router/Index.js"
import 'element-plus/dist/index.css';
import {setupStore} from "@/store";
import {setupPlugins} from "@/plugins";
import 'animate.css';


// import "bootstrap";
// 引入bootstrap样式
import "bootstrap/dist/css/bootstrap.min.css";



async function setup(){
    const app = createApp(App);
    // 加载pinia
    setupStore(app);
    // 加载路由
    setupRouter(app);
    /** 加载插件 */
    setupPlugins(app)

    app.mount('#app')
}
setup().then(r => {});
