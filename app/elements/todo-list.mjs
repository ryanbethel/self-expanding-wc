export default function Element ({ html, state }) {

  return html`
  <ul class=todo_list>
   <slot></slot>
  </ul>
    <input style="border:solid black" type=text/>
  <button style="border:solid black" class="add_todo" type=button>Add</button>

<script>
  class TodoList extends HTMLElement {
    constructor() {
      super()
      this.button = this.querySelector('button.add_todo')
      this.addTodo = this.addTodo.bind(this)
      this.button.addEventListener('click', this.addTodo)
      this.list = this.querySelector('ul.todo_list')
      this.input = this.querySelector('input')
    }


    addTodo (){
      const item = document.createElement('todo-item')
      item.innerText = this.input.value
      item.setAttribute('priority','High')
      item.setAttribute('self-expand','')
      this.list.appendChild(item)
    }
  }
  customElements.define('todo-list', TodoList) 
</script>
`
}

