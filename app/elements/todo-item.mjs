// View documentation at: https://enhance.dev/docs/learn/starter-project/elements
/**
 * @type {import('@enhance/types').EnhanceElemFn}
 */
export default function Element ({ html, state }) {
  function sharedRender (state) { return `
    <p>${state.attrs?.priority || 'Normal'} Priority Todo: 
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

    expand(force){
      const selfExpand = this.getAttribute('self-expand')
      if (force==='force' || selfExpand!==null) {
        this.removeAttribute('self-expand')
        let attrs = {}
        if (this.hasAttributes()) {
          for (const attr of this.attributes) {
            attrs[attr.name] = attr.value
          }
        } 
        console.log({attrs})
        const store = {} // Todo: Connect client-side store
        const state = {attrs,store}
        const slotContent = this.innerHTML
        const fragment = document.createElement('template')
        ${sharedRender.toString()} 
        fragment.innerHTML = sharedRender(state)
        // Todo: More robust slot algorithm needed
        const slot = fragment.content.querySelector('slot')
        slot.replaceWith(slotContent)
        this.replaceChildren(fragment.content)
      }
    }
  }

  customElements.define('todo-item', TodoItem)
</script>`
}

