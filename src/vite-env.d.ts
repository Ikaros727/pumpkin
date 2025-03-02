/// <reference types="vite/client" />
declare module  '*.vue' {
    import {DefineComponent} from 'vue'
    const component: DefineComponent<object, object, any>
    export default component
}

declare module 'sql.js'
// declare module '*.ts'
declare module '*.sql'
