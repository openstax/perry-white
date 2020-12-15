import * as React from 'react'
import {EditorState, Selection} from 'prosemirror-state'
import {Transaction} from 'prosemirror-state'
import {EditorView} from 'prosemirror-view'

export type IsActiveCall = (state: EditorState) => boolean

export type FindNodeTypeInSelectionCall = (selection: Selection) => Object

const EventType = {
    CLICK: 'mouseup',
    MOUSEENTER: 'mouseenter',
}

function dryRunEditorStateProxyGetter(
    state: EditorState,
    propKey: string,
): any {
    // @ts-ignore
    const val = state[propKey]
    if (propKey === 'tr' && val instanceof Transaction) {
        return val.setMeta('dryrun', true)
    }
    return val
}

function dryRunEditorStateProxySetter(
    state: EditorState,
    propKey: string,
    propValue: any,
): boolean {
    // @ts-ignore
    state[propKey] = propValue
    // Indicate success
    return true
}

export class UICommand {
    static EventType = EventType

    shouldRespondToUIEvent(
        e: React.SyntheticEvent | MouseEvent,
    ): boolean {
        return e.type === UICommand.EventType.CLICK
    }

    renderLabel(state: EditorState):any {
        return null
    }

    isActive(state: EditorState): boolean {
        return false
    }

    isEnabled(
        state: EditorState,
        view: EditorView | null | undefined,
    ): boolean {
        return this.dryRun(state, view)
    }

    dryRun(
        state: EditorState,
        view: EditorView,
    ): boolean {
        const {Proxy} = window

        const dryRunState = Proxy
            ? new Proxy(state, {
                get: dryRunEditorStateProxyGetter,
                set: dryRunEditorStateProxySetter,
            })
            : state

        return this.execute(dryRunState, null, view)
    }

    execute(
        state: EditorState,
        dispatch: null | ((tr: Transaction | null) => void),
        view: EditorView | null,
        event?: React.SyntheticEvent | null,
    ): boolean {
        // @ts-ignore
        this.waitForUserInput(state, dispatch, view, event)
            .then(inputs => {
                this.executeWithUserInput(state, dispatch, view, inputs)
            })
            .catch(error => {
                console.error(error)
            })
        return false
    }

    waitForUserInput(
        state: EditorState,
        dispatch: null | ((tr: Transaction) => void),
        view: EditorView | null | undefined,
        event: React.SyntheticEvent | null | undefined,
    ): Promise<any> {
        return Promise.resolve(undefined)
    }

    executeWithUserInput(
        state: EditorState,
        dispatch: null | ((tr: Transaction) => void),
        view: EditorView | null | undefined,
        inputs: any,
    ): boolean {
        return false
    }

    cancel(): void {
        // subclass should overwrite this.
    }
}

export interface UICommands {
    [key: string]: UICommand
}

export default UICommand
