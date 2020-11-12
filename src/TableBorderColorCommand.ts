import nullthrows from 'nullthrows'
import {EditorState, Transaction} from 'prosemirror-state'
import {setCellAttr} from 'prosemirror-tables'
import {EditorView} from 'prosemirror-view'

import ColorEditor from './ui/ColorEditor'
import {atAnchorRight} from './ui/PopUpPosition'
import UICommand from './ui/UICommand'
import createPopUp from './ui/createPopUp'

const setCellBorderBlack = setCellAttr('borderColor', '#000000')

class TableBorderColorCommand extends UICommand {
    _popUp = null

    shouldRespondToUIEvent = (
        e: React.SyntheticEvent | MouseEvent,
    ): boolean => {
        return e.type === UICommand.EventType.MOUSEENTER
    }

    isEnabled = (state: EditorState): boolean => {
        // @ts-ignore
        return setCellBorderBlack(state.tr)
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
        const target = nullthrows(event).currentTarget
        if (!(target instanceof HTMLElement)) {
            return Promise.resolve(undefined)
        }

        const anchor = event ? event.currentTarget : null
        return new Promise(resolve => {
            this._popUp = createPopUp(ColorEditor, null, {
                anchor,
                position: atAnchorRight,
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
        color: string | null | undefined,
    ): boolean => {
        if (dispatch && color !== undefined) {
            const cmd = setCellAttr('borderColor', color)
            // @ts-ignore
            cmd(state, dispatch, view)
            return true
        }
        return false
    }

    cancel(): void {
        this._popUp && this._popUp.close(undefined)
    }
}

export default TableBorderColorCommand
