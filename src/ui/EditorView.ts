import {EditorView} from 'prosemirror-view'
import * as React from 'react'
import {getParentFrameSet} from './EditorFrameset'
import {DirectEditorProps, EditorRuntime} from '../Types'

// https://github.com/ProseMirror/prosemirror-view/blob/master/src/index.js
class PWEditorView extends EditorView {
    disabled: boolean
    placeholder: (string | React.ReactElement<any>) | null | undefined
    readOnly: boolean
    runtime: EditorRuntime | null | undefined
    frameset: HTMLDivElement
    constructor(place: HTMLElement, props: DirectEditorProps) {
        // @ts-ignore
        super(place, props)
        this.runtime = null
        this.readOnly = true
        this.disabled = true
        this.placeholder = null
        this.frameset = getParentFrameSet(place)!
    }

    destroy() {
        super.destroy()
        // @ts-ignore
        this._props = {}
    }

}

export default PWEditorView
