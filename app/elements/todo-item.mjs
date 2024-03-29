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
  const ShadySlotMixin = (superclass) => class extends superclass {
    constructor() {
      super()
      this.expand = this.expand.bind(this)
    }

    connectedCallback(){
      if (super.connectedCallback) super.connectedCallback();
      this.expand() 
    }

    static get observedAttributes() {
      if (super.observedAttributes) {
        return super.observedAttributes.concat([ 'self-expand' ])
      } 
      return [ 'self-expand' ]
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (super.attributeChangedCallback) {
        super.attributeChangedCallback(name, oldValue, newValue)
      }
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
        const children = Array.from(fragment.childNodes)
        fragment.attachShadow({ mode: 'open' })
        fragment.shadowRoot.innerHTML = this.render(state)
        let unnamedSlot = {}
        let namedSlots = {}

        children.forEach(child => {
          const slot = child.assignedSlot
          if (slot) {
            if (slot.name) {
              if (!namedSlots[slot.name]) namedSlots[slot.name] = {slotNode:slot,contentToSlot:[]}
              namedSlots[slot.name].contentToSlot.push(child)
            } else {
              if (!unnamedSlot["slotNode"]) unnamedSlot = {slotNode:slot,contentToSlot:[]}
              unnamedSlot.contentToSlot.push(child.innerHTML || child.textContent || '')
            }
          }
        })

        // Named Slots
        Object.entries(namedSlots).forEach(([name, slot])=>{
          slot.slotNode.after(...namedSlots[name].contentToSlot)
          slot.slotNode.remove()
        })

        // Unnamed Slot
        unnamedSlot.slotNode.replaceWith(unnamedSlot.contentToSlot.join(''))

        // Unused slots and default content 
        const unfilledSlots = Array.from(fragment.shadowRoot.querySelectorAll('slot'))
        unfilledSlots.forEach(slot => {
          slot.after(...slot.childNodes)
          slot.remove()
        })

        this.innerHTML = fragment.shadowRoot.innerHTML
      }
    }
  }

  class TodoItem extends ShadySlotMixin(HTMLElement) {
    constructor() {
      super()
      this.render = this.render.bind(this)
    }

    render(state) {
      // return \${sharedRender.tostring()}(state)

      // OR

    return \`
    <p>\${state?.attrs?.priority || 'Normal'} Priority Todo: 
      <span><slot></slot></span>
      <span><slot name=test></slot></span>

    </p>
    \`
    }
  }

  customElements.define('todo-item', TodoItem)
</script>`
}

