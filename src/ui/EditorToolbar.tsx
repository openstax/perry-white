import cx from 'classnames'
import {EditorState, Transaction} from 'prosemirror-state'
import {EditorView} from 'prosemirror-view'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import CustomEditorView from './CustomEditorView'
import CommandButton from './CommandButton'
import CommandMenuButton from './CommandMenuButton'
import CustomButton from './CustomButton'
import {COMMAND_GROUPS, COMMAND_GROUPS_T, parseLabel} from './EditorToolbarConfig'
import Icon from './Icon'
import ResizeObserver from './ResizeObserver'
import UICommand from './UICommand'
import isReactClass from './isReactClass'

interface Props {
    disabled?: boolean | null | undefined
    dispatchTransaction?: (tr: Transaction) => void | null | undefined
    editorState: EditorState
    editorView: CustomEditorView
    onReady?: (view: EditorView) => void | null | undefined
    readOnly?: boolean | null | undefined
}

interface State {
    expanded: boolean
    wrapped: boolean
    cmd_groups: COMMAND_GROUPS_T

}

class EditorToolbar extends React.Component<Props, State> {
    _body = null

    state = {
        expanded: false,
        wrapped: null,
        cmd_groups: [] // COMMAND_GROUPS //[]
    }

    componentDidUpdate() {
        if (this.props.editorView && this.state.cmd_groups.length == 0) {
            const { filterCommandGroups } = this.props.editorView.runtime

            console.log({ filterCommandGroups })
            this.setState({
                cmd_groups: filterCommandGroups ? filterCommandGroups(COMMAND_GROUPS) : COMMAND_GROUPS
            })

        }
    }

    render() {
        const {wrapped, expanded, cmd_groups} = this.state

        const className = cx('czi-editor-toolbar', {expanded, wrapped})
        const wrappedButton = wrapped ? (
            <CustomButton
                active={expanded}
                className="czi-editor-toolbar-expand-button"
                icon={Icon.get('more_horiz')}
                key="expand"
                onClick={this._toggleExpansion}
                title="More"
                value={expanded}
            />
        ) : null
        return (
            <div className={className}>
                <div className="czi-editor-toolbar-flex">
                    <div className="czi-editor-toolbar-body">

                        <div
                            className="czi-editor-toolbar-body-content"
                            ref={this._onBodyRef}
                        >
                            <i className="czi-editor-toolbar-wrapped-anchor" />
                            {cmd_groups.map(this._renderButtonsGroup)}
                            <div className="czi-editor-toolbar-background">
                                <div className="czi-editor-toolbar-background-line" />
                                <div className="czi-editor-toolbar-background-line" />
                                <div className="czi-editor-toolbar-background-line" />
                                <div className="czi-editor-toolbar-background-line" />
                                <div className="czi-editor-toolbar-background-line" />
                            </div>
                            <i className="czi-editor-toolbar-wrapped-anchor" />
                        </div>
                        {wrappedButton}
                    </div>
                    <div className="czi-editor-toolbar-footer" />
                </div>
            </div>
        )
    }

    _renderButtonsGroup = (
        group: Object,
        index: number,
    ) => {
        const buttons = Object.keys(group)
            .map(label => {
                const obj = group[label]
                if (isReactClass(obj)) {
                    // JSX requies the component to be named with upper camel case.
                    const ThatComponent = obj
                    const {
                        editorState,
                        editorView,
                        dispatchTransaction,
                    } = this.props
                    return (
                        <ThatComponent
                            dispatch={dispatchTransaction}
                            editorState={editorState}
                            editorView={editorView}
                            key={label}
                        />
                    )
                } else if (obj instanceof UICommand) {
                    return this._renderButton(label, obj)
                } else if (Array.isArray(obj)) {
                    return this._renderMenuButton(label, obj)
                } else {
                    return null
                }
            })
            .filter(Boolean)

        return (
            <div className="czi-custom-buttons" key={'g' + String(index)}>
                {buttons}
            </div>
        )
    }

    _renderMenuButton = (
        label: string,
        commandGroups: Array<{
            [key: string]: UICommand
        }>,
    ) => {
        const {
            editorState,
            editorView,
            disabled,
            dispatchTransaction,
        } = this.props
        const {icon, title} = parseLabel(label)
        return (
            <CommandMenuButton
                commandGroups={commandGroups}
                disabled={disabled}
                dispatch={dispatchTransaction}
                editorState={editorState}
                editorView={editorView}
                icon={icon}
                key={label}
                label={icon ? null : title}
                title={title}
            />
        )
    }

    _renderButton = (
        label: string,
        command: UICommand,
    ) => {
        const {
            disabled,
            editorState,
            editorView,
            dispatchTransaction,
        } = this.props
        const {icon, title} = parseLabel(label)

        return (
            <CommandButton
                command={command}
                disabled={disabled}
                dispatch={dispatchTransaction}
                editorState={editorState}
                editorView={editorView}
                icon={icon}
                key={label}
                label={icon ? null : title}
                title={title}
            />
        )
    }

    _onBodyRef = (ref: any): void => {
        if (ref) {
            this._body = ref
            // Mounting
            const el = ReactDOM.findDOMNode(ref)
            if (el instanceof HTMLElement) {
                ResizeObserver.observe(el, this._checkIfContentIsWrapped)
            }
        } else {
            // Unmounting.
            const el = this._body && ReactDOM.findDOMNode(this._body)
            if (el instanceof HTMLElement) {
                ResizeObserver.unobserve(el)
            }
            this._body = null
        }
    }

    _checkIfContentIsWrapped = (): void => {
        const ref = this._body
        const el: any = ref && ReactDOM.findDOMNode(ref)
        const startAnchor = el && el.firstChild
        const endAnchor = el && el.lastChild
        if (startAnchor && endAnchor) {
            const wrapped = startAnchor.offsetTop < endAnchor.offsetTop
            this.setState({wrapped})
        }
    }

    _toggleExpansion = (expanded: boolean): void => {
        this.setState({expanded: !expanded})
    }
}

export default EditorToolbar
