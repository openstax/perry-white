import {undo} from "prosemirror-history"
import {Transaction, EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"

import UICommand from "./ui/UICommand"

class HistoryUndoCommand extends UICommand {
    execute = (
        state: EditorState,
        dispatch?: (tr: Transaction) => void | null,
        view?: EditorView | null,
    ): boolean => {
        return undo(state, dispatch)
    }
}

export default HistoryUndoCommand
