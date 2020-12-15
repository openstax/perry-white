import nullthrows from 'nullthrows'
import {EditorState, TextSelection, Transaction} from 'prosemirror-state'
import EditorView from './ui/EditorView'
import insertTable from './insertTable'
import {atAnchorRight} from './ui/PopUpPosition'
import TableGridSizeEditor from './ui/TableGridSizeEditor'
import UICommand from './ui/UICommand'
import createPopUp from './ui/createPopUp'
import {TableGridSizeEditorValue} from './ui/TableGridSizeEditor'

class TableInsertCommand extends UICommand {
    _popUp = null

    shouldRespondToUIEvent = (
        e: React.SyntheticEvent | MouseEvent,
    ): boolean => {
        return e.type === UICommand.EventType.MOUSEENTER
    }

    isEnabled = (state: EditorState): boolean => {
        const tr = state
        let bOK = false
        const {selection} = tr
        if (selection instanceof TextSelection) {
            bOK = selection.from === selection.to
            // [FS] IRAD-1065 2020-09-18
            // Disable create table menu if the selection is inside a table.
            if (bOK) {
                const $head = selection.$head
                for (let d = $head.depth; d > 0; d--) {
                    if ($head.node(d).type.spec.tableRole == 'row') {
                        return false
                    }
                }
            }
            return bOK
        }
        return bOK
    }

    waitForUserInput = (
        state: EditorState,
        dispatch: (tr: Transaction) => void | null | undefined,
        view: EditorView,
        event: React.SyntheticEvent | null | undefined,
    ): Promise<any> => {
        if (this._popUp) {
            return Promise.resolve(undefined)
        }
        const target = nullthrows(event).currentTarget
        if (!(target instanceof HTMLElement)) {
            return Promise.resolve(undefined)
        }

        const anchor = event ? event.currentTarget : null
        return new Promise(resolve => {
            this._popUp = createPopUp(TableGridSizeEditor, null, {
                anchor,
                position: atAnchorRight,
                container: view.frameset,
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
        inputs: TableGridSizeEditorValue | null | undefined,
    ): boolean => {
        if (dispatch) {
            const {selection, schema} = state
            let {tr} = state
            if (inputs) {
                const {rows, cols} = inputs
                tr = tr.setSelection(selection)
                tr = insertTable(tr, schema, rows, cols)
            }
            dispatch(tr)
        }
        return false
    }
}

export default TableInsertCommand
