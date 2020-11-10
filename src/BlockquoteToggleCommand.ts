import {EditorState, Transaction} from "prosemirror-state"
import {findParentNodeOfType} from "prosemirror-utils"
import {EditorView} from "prosemirror-view"

import {BLOCKQUOTE} from "./NodeNames"
import toggleBlockquote from "./toggleBlockquote"
import UICommand from "./ui/UICommand"

class BlockquoteToggleCommand extends UICommand {
    isActive = (state: EditorState): boolean => {
        const blockquote = state.schema.nodes[BLOCKQUOTE]
        return !!(
            blockquote && findParentNodeOfType(blockquote)(state.selection)
        )
    }

    execute = (
        state: EditorState,
        dispatch: (tr: Transaction) => void | null | undefined,
        view: EditorView | null | undefined,
    ): boolean => {
        const {schema, selection} = state
        const tr = toggleBlockquote(state.tr.setSelection(selection), schema)
        if (tr.docChanged) {
            dispatch && dispatch(tr)
            return true
        } else {
            return false
        }
    }
}

export default BlockquoteToggleCommand
