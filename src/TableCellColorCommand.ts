import nullthrows from 'nullthrows'
import {EditorState, Transaction} from 'prosemirror-state'
import {setCellAttr} from 'prosemirror-tables'

import EditorView from './ui/EditorView'
import ColorEditor from './ui/ColorEditor'
import {atAnchorRight} from './ui/PopUpPosition'
import UICommand from './ui/UICommand'
import createPopUp from './ui/createPopUp'

const setCellBackgroundBlack = setCellAttr('background', '#000000')

class TableCellColorCommand extends UICommand {
    _popUp = null

    shouldRespondToUIEvent = (
        e: React.SyntheticEvent | MouseEvent,
    ): boolean => {
        return e.type === UICommand.EventType.MOUSEENTER
    }

    isEnabled = (state: EditorState): boolean => {
        // @ts-ignore
        return setCellBackgroundBlack(state.tr)
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
            this._popUp = createPopUp(ColorEditor, null, {
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
        hex: string | null | undefined,
    ): boolean => {
        if (dispatch && hex !== undefined) {
            const cmd = setCellAttr('background', hex)
            // @ts-ignore
            cmd(state, dispatch, view)
            return true
        }
        return false
    }
}

export default TableCellColorCommand
