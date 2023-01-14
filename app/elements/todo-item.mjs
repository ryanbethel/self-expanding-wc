// View documentation at: https://enhance.dev/docs/learn/starter-project/elements
/**
 * @type {import('@enhance/types').EnhanceElemFn}
 */
export default function Element ({ html, state }) {
  const {attrs} = state
  function sharedRender (state) { return `
    <p>${state?.attrs?.priority || 'Normal'} Priority Todo: 
      <slot></slot>
    </p>
`}
  return html`
${sharedRender(state)}

<script type="module">
  class TodoItem extends HTMLElement {
    constructor() {
      super()
      this.expand = this.expand.bind(this)
    }

    connectedCallback(){
      this.expand() 
    }

    static get observedAttributes() {
      return [ 'self-expand' ]
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        if (name === 'self-expand') {
          this.expand()
        }
      }
    }


    expand(){
      const selfExpand = this.getAttribute('self-expand')
      if (selfExpand!==null) {
        this.removeAttribute('self-expand')
        ${sharedRender.toString()}
        // Todo: Map attributes into object
        const attrs = {priority:this?.attributes?.priority?.value}
        const slotContent = this.innerHTML
        const fragment = document.createElement('template')
        fragment.innerHTML = sharedRender({attrs})
        // Todo: More complete slot replacement
        const slot = fragment.content.querySelector('slot')
        slot.replaceWith(slotContent)
        this.replaceChildren(fragment.content)
      }
    }
  }

  customElements.define('todo-item', TodoItem)
</script>`
}

