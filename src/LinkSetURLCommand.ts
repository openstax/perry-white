import {EditorState, Transaction} from 'prosemirror-state'
import {TextSelection} from 'prosemirror-state'
import CustomEditorView from './ui/CustomEditorView'
import {MARK_LINK} from './MarkNames'
import {
    hideSelectionPlaceholder,
    showSelectionPlaceholder,
} from './SelectionPlaceholderPlugin'
import applyMark from './applyMark'
import findNodesWithSameMark from './findNodesWithSameMark'
import LinkURLEditor from './ui/LinkURLEditor'
import UICommand from './ui/UICommand'
import createPopUp from './ui/createPopUp'

class LinkSetURLCommand extends UICommand {
    _popUp = null

    isEnabled = (state: EditorState): boolean => {
        if (!(state.selection instanceof TextSelection)) {
            // Could be a NodeSelection or CellSelection.
            return false
        }

        const markType = state.schema.marks[MARK_LINK]
        if (!markType) {
            return false
        }
        const {from, to} = state.selection
        return from < to
    }

    waitForUserInput = (
        state: EditorState,
        dispatch: (tr: Transaction) => void | null | undefined,
        view: CustomEditorView | null | undefined,
        event: React.SyntheticEvent | null | undefined,
    ): Promise<any> => {
        if (this._popUp) {
            return Promise.resolve(undefined)
        }

        if (dispatch) {
            // @ts-ignore
            dispatch(showSelectionPlaceholder(state))
        }
        const {doc, schema, selection} = state
        const markType = schema.marks[MARK_LINK]
        if (!markType) {
            return Promise.resolve(undefined)
        }
        const {from, to} = selection
        const result = findNodesWithSameMark(doc, from, to, markType)
        const href = result ? result.mark.attrs.href : null
        return new Promise(resolve => {
            this._popUp = createPopUp(
                LinkURLEditor,
                {href},
                {
                    container: view.frameset,
                    modal: true,
                    onClose: val => {
                        if (this._popUp) {
                            this._popUp = null
                            resolve(val)
                        }
                    },
                },
            )
        })
    }

    executeWithUserInput = (
        state: EditorState,
        dispatch: (tr: Transaction) => void | null | undefined,
        view: CustomEditorView | null | undefined,
        href: string | null | undefined,
    ): boolean => {
        if (dispatch) {
            const {selection, schema} = state
            let {tr} = state
            // @ts-ignore
            tr = view ? hideSelectionPlaceholder(view.state) : tr
            tr = tr.setSelection(selection)
            if (href !== undefined) {
                const markType = schema.marks[MARK_LINK]
                const attrs = href ? {href} : null
                // @ts-ignore
                tr = applyMark(
                    tr.setSelection(state.selection),
                    schema,
                    markType,
                    attrs,
                )
            }
            dispatch(tr)
        }
        view && view.focus()
        return true
    }
}

export default LinkSetURLCommand
