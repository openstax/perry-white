import {EditorState} from "prosemirror-state"
import { DOMSerializer } from 'prosemirror-model'

export default function convertToHTML(state: EditorState): string {

    const renderer = document.createElement('div')

    const fragment = DOMSerializer
        .fromSchema(state.schema)
        .serializeFragment(state.doc.content)

    // @ts-ignore
    renderer.appendChild( fragment.cloneNode(true) )

    return renderer.innerHTML
}
