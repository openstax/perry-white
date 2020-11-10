import {EditorState, Transaction} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import * as React from "react"

import CustomMenu from "./CustomMenu"
import CustomMenuItem from "./CustomMenuItem"
import UICommand from "./UICommand"

class CommandMenu extends React.Component<any, any> {
    _activeCommand: UICommand | null | undefined = null

    props: {
        commandGroups: Array<{
            [key: string]: UICommand
        }>
        dispatch: (tr: Transaction) => void
        editorState: EditorState
        editorView: EditorView | null | undefined
        onCommand: Function | null | undefined
    }

    render() {
        const {commandGroups, editorState, editorView} = this.props
        const children = []
        const jj = commandGroups.length - 1

        commandGroups.forEach((group, ii) => {
            Object.keys(group).forEach(label => {
                const command = group[label]
                let disabled = true
                try {
                    disabled =
                        !editorView ||
                        !command.isEnabled(editorState, editorView)
                } catch (ex) {
                    disabled = false
                }
                children.push(
                    <CustomMenuItem
                        active={command.isActive(editorState)}
                        disabled={disabled}
                        key={label}
                        label={command.renderLabel(editorState) || label}
                        onClick={this._onUIEnter}
                        onMouseEnter={this._onUIEnter}
                        value={command}
                    />,
                )
            })
            if (ii !== jj) {
                children.push(
                    <CustomMenuItem.Separator key={`${String(ii)}-hr`} />,
                )
            }
        })
        return <CustomMenu>{children}</CustomMenu>
    }

    _onUIEnter = (command: UICommand, event: React.SyntheticEvent): void => {
        if (command.shouldRespondToUIEvent(event)) {
            this._activeCommand && this._activeCommand.cancel()
            this._activeCommand = command
            this._execute(command, event)
        }
    }

    _execute = (command: UICommand, e: React.SyntheticEvent) => {
        const {dispatch, editorState, editorView, onCommand} = this.props
        if (command.execute(editorState, dispatch, editorView, e)) {
            onCommand && onCommand()
        }
    }
}

export default CommandMenu
