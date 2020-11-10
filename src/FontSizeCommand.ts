import UICommand from "./ui/UICommand"
import applyMark from "./applyMark"
import isTextStyleMarkCommandEnabled from "./isTextStyleMarkCommandEnabled"
import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {MARK_FONT_SIZE} from "./MarkNames"
import {Schema} from "prosemirror-model"
import {Transaction} from "prosemirror-state"

function setFontSize(tr: Transaction, schema: Schema, pt: number): Transaction {
    const markType = schema.marks[MARK_FONT_SIZE]
    if (!markType) {
        return tr
    }
    const attrs = pt ? {pt} : null
    // @ts-ignore
    tr = applyMark(tr, schema, markType as Mark<any>, attrs)
    return tr
}

class FontSizeCommand extends UICommand {
    _popUp = null
    _pt = 0

    constructor(pt: number) {
        super()
        this._pt = pt
    }

    isEnabled = (state: EditorState): boolean => {
        return isTextStyleMarkCommandEnabled(state, MARK_FONT_SIZE)
    }

    execute = (
        state: EditorState,
        dispatch: (tr: Transaction) => void | null | undefined,
        view: EditorView | null | undefined,
    ): boolean => {
        const {schema, selection} = state
        const tr = setFontSize(
            state.tr.setSelection(selection),
            schema,
            this._pt,
        )
        // @ts-ignore
        if (tr.docChanged || tr.storedMarksSet) {
            // If selection is empty, the color is added to `storedMarks`, which
            // works like `toggleMark`
            // (see https://prosemirror.net/docs/ref/#commands.toggleMark).
            dispatch && dispatch(tr)
            return true
        }
        return false
    }
}

export default FontSizeCommand
