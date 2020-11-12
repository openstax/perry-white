import {EditorState, Transaction} from 'prosemirror-state'
import {EditorView} from 'prosemirror-view'

import UICommand from './ui/UICommand'
import updateIndentLevel from './updateIndentLevel'

class IndentCommand extends UICommand {
    _delta: number

    constructor(delta: number) {
        super()
        this._delta = delta
    }

    isActive = (state: EditorState): boolean => {
        return false
    }

    execute = (
        state: EditorState,
        dispatch: (tr: Transaction) => void | null | undefined,
        view: EditorView | null | undefined,
    ): boolean => {
        const {selection, schema} = state
        let {tr} = state
        tr = tr.setSelection(selection)
        // @ts-ignore
        tr = updateIndentLevel(tr, schema, this._delta)
        if (tr.docChanged) {
            dispatch && dispatch(tr)
            return true
        } else {
            return false
        }
    }
}

export default IndentCommand
