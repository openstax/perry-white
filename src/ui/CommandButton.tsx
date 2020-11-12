import {EditorState, Transaction} from 'prosemirror-state'
import {EditorView} from 'prosemirror-view'
import * as React from 'react'

import CustomButton from './CustomButton'
import UICommand from './UICommand'

interface Props {
    className?: string | null | undefined
    command: UICommand
    disabled?: boolean | null | undefined
    dispatch: (tr: Transaction) => void
    editorState: EditorState
    commandGroups?: any
    editorView: EditorView | null | undefined
    icon?: string | React.ReactNode | null
    label?: string | React.ReactNode | null
    title?: string | null | undefined
}


class CommandButton extends React.Component<Props, any> {

    render() {
        const {
            label,
            className,
            command,
            editorState,
            editorView,
            icon,
            title,
        } = this.props
        let disabled = this.props.disabled
        if (!!disabled === false) {
            disabled =
                !editorView || !command.isEnabled(editorState, editorView)
        }
        return (
            <CustomButton
                active={command.isActive(editorState)}
                className={className}
                disabled={disabled}
                icon={icon}
                label={label}
                onClick={this._onUIEnter}
                onMouseEnter={this._onUIEnter}
                title={title}
                value={command}
            />
        )
    }
    // eslint-disable-next-line no-undef
    _onUIEnter = (
        command: UICommand,
        event: React.SyntheticEvent<HTMLButtonElement>
    ): void => {
        if (command.shouldRespondToUIEvent(event)) {
            this._execute(command, event)
        }
    }
    // eslint-disable-next-line no-undef
    _execute = (
        value: any,
        event: React.SyntheticEvent<HTMLButtonElement>,
    ): void => {
        const {command, editorState, dispatch, editorView} = this.props
        command.execute(editorState, dispatch, editorView, event)
    }
}

export default CommandButton
