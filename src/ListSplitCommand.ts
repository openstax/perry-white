import {Schema} from 'prosemirror-model'
import {EditorState, Transaction} from 'prosemirror-state'
import {EditorView} from 'prosemirror-view'

import splitListItem from './splitListItem'
import UICommand from './ui/UICommand'

class ListSplitCommand extends UICommand {
    constructor() {
        super()
    }

    execute = (
        state: EditorState,
        dispatch: (tr: Transaction) => void | null | undefined,
        view: EditorView | null | undefined,
    ): boolean => {
        const {selection, schema} = state
        const tr = splitListItem(state.tr.setSelection(selection), schema)
        if (tr.docChanged) {
            dispatch && dispatch(tr)
            return true
        } else {
            return false
        }
    }
}

export default ListSplitCommand
