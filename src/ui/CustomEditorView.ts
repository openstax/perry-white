import {EditorView} from 'prosemirror-view'
import * as React from 'react'

import {DirectEditorProps, EditorRuntime} from '../Types'

// https://github.com/ProseMirror/prosemirror-view/blob/master/src/index.js
class CustomEditorView extends EditorView {
    disabled: boolean
    placeholder: (string | React.ReactElement<any>) | null | undefined
    readOnly: boolean
    runtime: EditorRuntime | null | undefined
    constructor(place: HTMLElement, props: DirectEditorProps) {
        // @ts-ignore
        super(place, props)
        this.runtime = null
        this.readOnly = true
        this.disabled = true
        this.placeholder = null
    }

    destroy() {
        super.destroy()
        // @ts-ignore
        this._props = {}
    }

}

// export function isCustomEditorView(v: any): pet is Fish {
//   return (pet as Fish).swim !== undefined;
// }

export default CustomEditorView
