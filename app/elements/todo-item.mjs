// View documentation at: https://enhance.dev/docs/learn/starter-project/elements
/**
 * @type {import('@enhance/types').EnhanceElemFn}
 */
export default function Element({ html, state }) {
  function sharedRender(state) {
    return `
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
      this.render = this.render.bind(this)
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


    expand({ force = false }={}){
      const selfExpand = this.getAttribute('self-expand')
      if (force || selfExpand!==null) {
        this.removeAttribute('self-expand')
        let attrs = {}
        if (this.hasAttributes()) {
          for (const attr of this.attributes) {
            attrs[attr.name] = attr.value
          }
        } 
        const store = {} // Todo: Connect client-side store
        const state = {attrs,store}
        const fragment = document.createElement('div')
        fragment.innerHTML = this.innerHTML
        fragment.attachShadow({mode: 'open'});
        fragment.shadowRoot.innerHTML = this.render(state) 
        const children = Array.from(fragment.childNodes)
        children.forEach(child => {
          const slot = child.assignedSlot
          if (slot) slot.parentNode.replaceChild(child,slot)
        })
        this.innerHTML = fragment.shadowRoot.innerHTML
      }
    }

    render(state) {
      // return \${sharedRender(state)}()

      // OR

    return \`
    <p>\${state.attrs?.priority || 'Normal'} Priority Todo: 
      <slot></slot>
      <slot name=test></slot>
    </p>
    \`
    }
  }

  customElements.define('todo-item', TodoItem)
</script>`
}

