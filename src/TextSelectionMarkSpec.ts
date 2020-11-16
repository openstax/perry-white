import {Node} from 'prosemirror-model'
import {prefixed} from './util'
import {MarkSpec} from './Types'

const TextSelectionMarkSpec: MarkSpec = {
    attrs: {
        id: '',
    },
    inline: true,
    group: 'inline',
    parseDOM: [
        {
            tag: prefixed('text-selection'),
        },
    ],

    toDOM(node: Node) {
        return [prefixed('text-selection'), {class: prefixed('text-selection')}, 0]
    },
}

export default TextSelectionMarkSpec
