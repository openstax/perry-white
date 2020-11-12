import {EditorState, Transaction} from 'prosemirror-state'
import {EditorView} from 'prosemirror-view'

import UICommand from './ui/UICommand'

class PrintCommand extends UICommand {
    isActive = (state: EditorState): boolean => {
        return false
    }

    isEnabled = (state: EditorState): boolean => {
        return !!window.print
    }

    execute = (
        state: EditorState,
        dispatch?: (tr: Transaction) => void | null | undefined,
        view?: EditorView | null | undefined,
    ): boolean => {
        if (dispatch && window.print) {
            window.print()
            return true
        }
        return false
    }
}

export default PrintCommand
