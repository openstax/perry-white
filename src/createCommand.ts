import {EditorState} from 'prosemirror-state'
import {EditorView} from 'prosemirror-view'
import {Transaction} from 'prosemirror-state'
import UICommand from './ui/UICommand'

type ExecuteCall = (
    state: EditorState,
    dispatch?: (tr: Transaction) => void | null | undefined,
    view?: EditorView | null | undefined,
) => boolean

export default function createCommand(execute: ExecuteCall): UICommand {
    class CustomCommand extends UICommand {
        isEnabled = (state: EditorState): boolean => {
            return this.execute(state)
        }

        execute = (
            state: EditorState,
            dispatch?: (tr: Transaction) => void | null | undefined,
            view?: EditorView | null | undefined,
        ): boolean => {
            const tr = state.tr
            let endTr = tr
            execute(
                state,
                nextTr => {
                    endTr = nextTr
                    dispatch && dispatch(endTr)
                },
                view,
            )
            return endTr.docChanged || tr !== endTr
        }
    }
    return new CustomCommand()
}
