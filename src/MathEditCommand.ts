import {Fragment, Schema} from "prosemirror-model"
import {EditorState, Transaction} from "prosemirror-state"
import {TextSelection} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
// eslint-disable-next-line no-unused-vars
import * as React from "react"

import {
    hideCursorPlaceholder,
    showCursorPlaceholder,
} from "./CursorPlaceholderPlugin"
import {MATH} from "./NodeNames"
import MathEditor from "./ui/MathEditor"
import UICommand from "./ui/UICommand"
import createPopUp from "./ui/createPopUp"

function insertMath(
    tr: Transaction,
    schema: Schema,
    latex: string | null | undefined,
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
        latex,
    }

    const node = image.create(attrs, null, null)
    const frag = Fragment.from(node)
    tr = tr.insert(from, frag)
    return tr
}

class MathEditCommand extends UICommand {
    _popUp = null

    isEnabled = (
        state: EditorState,
        view: EditorView | null | undefined,
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
        view: EditorView | null | undefined,
        event: React.SyntheticEvent | null | undefined,
    ): Promise<any> => {
        if (this._popUp) {
            return Promise.resolve(undefined)
        }

        if (dispatch) {
            dispatch(showCursorPlaceholder(state))
        }

        return new Promise(resolve => {
            const props = {
                // @ts-ignore
                runtime: view ? view.runtime : null,
                initialValue: null,
            }
            this._popUp = createPopUp(MathEditor, props, {
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
        view: EditorView | null | undefined,
        latex: string | null | undefined,
    ): boolean => {
        if (dispatch) {
            const {selection, schema} = state
            let {tr} = state
            // @ts-ignore
            tr = view ? hideCursorPlaceholder(view.state) : tr
            tr = tr.setSelection(selection)
            if (latex) {
                // @ts-ignore
                tr = insertMath(tr, schema, latex)
            }
            dispatch(tr)
            view && view.focus()
        }

        return false
    }
}

export default MathEditCommand
