import {NodeSpec} from './Types'

function getAttrs(dom: HTMLElement) {
    let align = dom.getAttribute('data-align') || dom.getAttribute('align')
    if (align) {
        align = /(left|right|center)/.test(align) ? align : null
    }

    return {
        align,
        math: dom.getAttribute('data-math') || null,
    }
}

const MathNodeSpec: NodeSpec = {
    inline: true,
    attrs: {
        align: {default: null},
        math: {default: ''},
    },
    group: 'inline',
    draggable: true,
    parseDOM: [
        {tag: 'div[data-math]', getAttrs},
        {tag: 'span[data-math]', getAttrs},
    ],
    toDOM(node) {
        // Normally, the DOM structure of the math node is rendered by
        // `MathNodeView`. This method is only called when user selects a
        // math node and copies it, which triggers the "serialize to HTML" flow that
        // calles this method.
        const {align, math} = node.attrs
        const domAttrs: any = {}
        if (align) {
            domAttrs.align = align
        }
        if (math) {
            domAttrs['data-math'] = math
        }
        return [(align == 'center' ? 'div' : 'span'), domAttrs]
    },
}

export default MathNodeSpec
