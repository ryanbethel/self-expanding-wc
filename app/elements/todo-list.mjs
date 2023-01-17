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
      const text = this.input.value
      // Mark with attribute 'self-expand' to trigger self expansion
      this.list.insertAdjacentHTML('beforeend','<todo-item priority="High" self-expand>'+text+'</todo-item>')
      // OR call expansion directly from parent
      // const item = document.createElement('todo-item')
      // item.innerText = this.input.value
      // this.list.appendChild(item)
      // item.expand('force')
    }
  }
  customElements.define('todo-list', TodoList) 
</script>
`
}

