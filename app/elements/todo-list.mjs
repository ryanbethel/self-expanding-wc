export default function Element({ html }) {

  return html`
  <ul class=todo_list>
   <slot></slot>
  </ul>
  <label>Description: <input style="border:solid black" type=text /> </label>
  <button style="border:solid black" class="add_todo" type=button>Add Todo</button>

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
      // Option 1: Mark with attribute 'self-expand' to trigger self expansion  
      // vvvvvvvv
      this.list.insertAdjacentHTML('beforeend','<todo-item priority="High" self-expand>'+text+'</todo-item>')
      //
      // OR Option 2: Call expand method from parent
      // vvvvvvvv
      // const item = document.createElement('todo-item')
      // item.innerText = text
      // this.list.appendChild(item)
      // item.expand({force:true})
    }
  }
  customElements.define('todo-list', TodoList) 
</script>
`
}

