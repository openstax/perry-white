import {NodeSpec} from './Types'

function getAttrs(dom?: HTMLIFrameElement) {
    return { src: dom.src }
}

const EmbedNodeSpec: NodeSpec = {
    inline: false,
    attrs: {
        src: {default: ''},
    },
    group: 'block',
    draggable: true,
    parseDOM: [
        {tag: 'iframe', getAttrs},
    ],
    toDOM(node) {
        // Normally, the DOM structure of the embed node is rendered by
        // `EmbedNodeView`. This method is only called when user selects a
        // embed node and copies it, which triggers the "serialize to HTML" flow that
        // calles this method.
        const {src} = node.attrs

        const domAttrs = {
            'data-src': src,
            class: 'frame-wrapper embed-responsive embed-responsive-16by9'
        }

        return ['div', domAttrs, ['iframe', { src: src }]]
    },
}

export default EmbedNodeSpec
