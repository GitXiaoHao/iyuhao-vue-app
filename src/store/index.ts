import type { App } from 'vue';
import {createPinia} from "pinia";
import piniaPersist from "pinia-plugin-persist"


export function setupStore(app: App<Element>) {
    const store = createPinia()
    store.use(piniaPersist)
    app.use(store)
}