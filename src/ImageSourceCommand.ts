import {Class} from 'utility-types'

import {Fragment, Schema} from 'prosemirror-model'
import {EditorState, TextSelection, Transaction} from 'prosemirror-state'
import EditorView from './ui/EditorView'
import * as React from 'react'
import {
    hideCursorPlaceholder,
    showCursorPlaceholder,
} from './CursorPlaceholderPlugin'
import {IMAGE} from './NodeNames'
import UICommand from './ui/UICommand'
import createPopUp from './ui/createPopUp'

import {ImageLike} from './Types'

function insertImage(
    tr: Transaction,
    schema: Schema,
    src: string | null | undefined,
): Transaction {
    const {selection} = tr
    if (!selection) {
        return tr
    }
    const {from, to} = selection
    if (from !== to) {
        return tr
    }

    const image = schema.nodes[IMAGE]
    if (!image) {
        return tr
    }

    const attrs = {
        src: src || '',
        alt: '',
        title: '',
    }

    const node = image.create(attrs, null, null)
    const frag = Fragment.from(node)
    tr = tr.insert(from, frag)
    return tr
}

class ImageSourceCommand extends UICommand {
    _popUp = null

    getEditor(): Class<React.Component<any, any>> {
        throw new Error('Not implemented')
    }

    isEnabled = (
        state: EditorState,
        view: EditorView,
    ): boolean => {
        return this.__isEnabled(state, view)
    }

    waitForUserInput = (
        state: EditorState,
        dispatch: (tr: Transaction) => void | null | undefined,
        view: EditorView,
        event?: React.SyntheticEvent | null | undefined,
    ): Promise<any> => {
        if (this._popUp) {
            return Promise.resolve(undefined)
        }

        if (dispatch) {
            dispatch(showCursorPlaceholder(state))
        }

        return new Promise(resolve => {
            // @ts-ignore
            const props = {runtime: view ? view.runtime : null}
            this._popUp = createPopUp(this.getEditor(), props, {
                container: view.frameset,
                modal: true,
                onClose: val => {
                    if (this._popUp) {
                        this._popUp = null
                        resolve(val)
                    }
                },
            })
        })
    }

    executeWithUserInput = (
        state: EditorState,
        dispatch: (tr: Transaction) => void | null | undefined,
        view: EditorView,
        inputs?: ImageLike | null,
    ): boolean => {
        if (dispatch) {
            const {selection, schema} = state
            let {tr} = state
            tr = view ? hideCursorPlaceholder(view.state) : tr
            tr = tr.setSelection(selection)
            if (inputs) {
                const {src} = inputs
                tr = insertImage(tr, schema, src)
            }
            dispatch(tr)
            view && view.focus()
        }

        return false
    }

    __isEnabled = (
        state: EditorState,
        view: EditorView,
    ): boolean => {
        const tr = state
        const {selection} = tr
        if (selection instanceof TextSelection) {
            return selection.from === selection.to
        }
        return false
    }
}

export default ImageSourceCommand
