import { mount } from 'svelte'
import './app.scss'
import App from './App.svelte'

console.log(`App type is ${typeof App}`)
console.log(`The content of App: ${App}`)

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
