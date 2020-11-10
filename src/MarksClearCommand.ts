import {EditorState, Transaction} from "prosemirror-state"
import {AllSelection, TextSelection} from "prosemirror-state"
import {EditorView} from "prosemirror-view"

import {clearMarks, clearHeading} from "./clearMarks"
import UICommand from "./ui/UICommand"

class MarksClearCommand extends UICommand {
    isActive = (state: EditorState): boolean => {
        return false
    }

    isEnabled = (state: EditorState) => {
        const {selection} = state
        return (
            !selection.empty &&
            (selection instanceof TextSelection ||
                selection instanceof AllSelection)
        )
    }

    execute = (
        state: EditorState,
        dispatch: (tr: Transaction) => void | null | undefined,
        view: EditorView | null | undefined,
    ): boolean => {
        let tr = clearMarks(
            state.tr.setSelection(state.selection),
            state.schema,
        )
        // [FS] IRAD-948 2020-05-22
        // Clear Header formatting
        tr = clearHeading(tr, state.schema)
        if (dispatch && tr.docChanged) {
            dispatch(tr)
            return true
        }
        return false
    }
}

export default MarksClearCommand
