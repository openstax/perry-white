import * as React from 'react'
import {Fragment, Schema} from 'prosemirror-model'
import {EditorState, Transaction} from 'prosemirror-state'
import {TextSelection, NodeSelection} from 'prosemirror-state'
import EditorView from './ui/EditorView'

import {
    hideCursorPlaceholder,
    showCursorPlaceholder,
} from './CursorPlaceholderPlugin'
import {MATH} from './NodeNames'
import UICommand from './ui/UICommand'

function insertMath(
    tr: Transaction,
    schema: Schema,
    math: string | null | undefined,
): Transaction {
    // @ts-ignore
    const {selection} = tr
    if (!selection) {
        return tr
    }
    const {from, to} = selection
    if (from !== to) {
        return tr
    }

    const image = schema.nodes[MATH]
    if (!image) {
        return tr
    }

    const attrs = {
        math,
    }

    const node = image.create(attrs, null, null)
    const frag = Fragment.from(node)
    return tr
        .insert(from, frag)
        .setSelection(NodeSelection.create(tr.doc, from))

}

class MathEditCommand extends UICommand {

    isEnabled = (
        state: EditorState,
    ): boolean => {
        const tr = state
        const {selection} = tr
        if (selection instanceof TextSelection) {
            return selection.from === selection.to
        }
        return false
    }

    waitForUserInput = (
        state: EditorState,
        dispatch: (tr: Transaction) => void | null | undefined,
    ): Promise<any> => {
        if (dispatch) {
            dispatch(showCursorPlaceholder(state))
        }

        return Promise.resolve(' ')
    }

    executeWithUserInput = (
        state: EditorState,
        dispatch: (tr: Transaction) => void | null | undefined,
        view: EditorView | null | undefined,
        math: string | null | undefined,
    ): boolean => {
        if (dispatch) {

            const {selection, schema} = state
            let {tr} = state
            // @ts-ignore
            tr = view ? hideCursorPlaceholder(view.state) : tr
            tr = tr.setSelection(selection)
            if (math) {
                tr = insertMath(tr, schema, math)
            }
            dispatch(tr)
            view && view.focus()
            setTimeout(() => {
                const input = view.frameset.querySelector('.math-rendered.selected textarea') as HTMLTextAreaElement
                if (input) {
                    input.focus()
                }
            }, 10)

        }

        return false
    }
}

export default MathEditCommand
