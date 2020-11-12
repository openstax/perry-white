import {Schema} from 'prosemirror-model'
import {EditorState} from 'prosemirror-state'
import {Step} from 'prosemirror-transform'
import {EditorView} from 'prosemirror-view'
import {Transaction} from 'prosemirror-state'
import SetDocAttrStep from './SetDocAttrStep'
import DocLayoutEditor from './ui/DocLayoutEditor'
import UICommand from './ui/UICommand'
import createPopUp from './ui/createPopUp'

import {DocLayoutEditorValue} from './ui/DocLayoutEditor'

function setDocLayout(
    tr: Transaction,
    schema: Schema,
    width: number | null | undefined,
    layout: string | null | undefined,
): Transaction {
    const {doc} = tr
    if (!doc) {
        return tr
    }

    tr = tr.step((new SetDocAttrStep('width', width || null)) as any as Step)
    tr = tr.step((new SetDocAttrStep('layout', layout || null)) as any as Step)
    return tr
}

class DocLayoutCommand extends UICommand {
    _popUp = null

    isEnabled = (state: EditorState): boolean => {
        return true
    }

    isActive = (state: EditorState): boolean => {
        return !!this._popUp
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

        const {doc} = state

        return new Promise(resolve => {
            const props = {
                initialValue: doc.attrs,
            }
            this._popUp = createPopUp(DocLayoutEditor, props, {
                modal: true,
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
        inputs: DocLayoutEditorValue | null | undefined,
    ): boolean => {
        if (dispatch) {
            const {selection, schema} = state
            let {tr} = state
            // tr = view ? hideCursorPlaceholder(view.state) : tr;
            tr = tr.setSelection(selection)

            if (inputs) {
                const {width, layout} = inputs
                // @ts-ignore
                tr = setDocLayout(tr, schema, width, layout)
            }
            dispatch(tr)
            view && view.focus()
        }

        return false
    }
}

export default DocLayoutCommand
