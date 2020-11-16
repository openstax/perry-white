import {EditorState, Transaction} from 'prosemirror-state'
import {EditorView} from 'prosemirror-view'
import * as React from 'react'
import cx from 'classnames'

import CustomEditorView from './CustomEditorView'
import createEmptyEditorState from '../createEmptyEditorState'
import EditingArea from './EditingArea'
import EditorFrameset from './EditorFrameset'
import EditorToolbar from './EditorToolbar'
import Frag from './Frag'
import { uuid } from '../util'

import {EditorFramesetProps} from './EditorFrameset'
import {EditorProps} from './EditingArea'

type Props = EditorFramesetProps & EditorProps & {
    children?: any | null | undefined
    defaultEditorState: EditorState
}

interface State {
    contentHeight?: number
    editorState: EditorState
    contentOverflowHidden?: boolean
    editorView?: CustomEditorView
}

const EMPTY_EDITOR_RUNTIME = {}

export class Editor extends React.Component<Props, State> {

    state: State

    _id: string

    constructor(props: any, context: any) {
        super(props, context)
        this._id = uuid()

        this.state = {
            contentHeight: NaN,
            contentOverflowHidden: false,
            editorView: undefined,
            editorState: props.defaultEditorState || createEmptyEditorState(),
        }
    }

    render() {
        const {
            autoFocus,
            children,
            className,
            disabled,
            embedded,
            header,
            height,
            nodeViews,
            placeholder,
            readOnly,
            width,
            fitToContent,
        } = this.props

        let { runtime} = this.props

        //        const editorState = this.props.editorState || this.state.editorState || createEmptyEditorState()
        runtime = runtime || EMPTY_EDITOR_RUNTIME
        const {editorView, editorState} = this.state

        const toolbar =
            !!readOnly === true ? null : (
                <EditorToolbar
                    disabled={disabled}
                    dispatchTransaction={this._dispatchTransaction}
                    editorState={editorState}
                    editorView={editorView}
                    readOnly={readOnly}
                />
            )

        const body = (
            <Frag>
                <EditingArea
                    autoFocus={autoFocus}
                    disabled={disabled}
                    dispatchTransaction={this._dispatchTransaction}
                    editorState={editorState}
                    embedded={embedded}
                    fitToContent={fitToContent}
                    id={this._id}
                    nodeViews={nodeViews}
                    onReady={this._onReady}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    runtime={runtime}
                />
                {children}
            </Frag>
        )

        return (
            <EditorFrameset
                body={body}
                className={cx('perry-white', className)}
                embedded={embedded}
                fitToContent={fitToContent}
                header={header}
                height={height}
                toolbar={toolbar}
                width={width}
            />
        )
    }



    _dispatchTransaction = (tr: Transaction): void => {
        const {onChange, readOnly} = this.props
        if (readOnly === true) {
            return
        }
        const state = this.state.editorState || EditingArea.EDITOR_EMPTY_STATE

        if (onChange) {
            onChange({ state, transaction: tr })
        } else {
            // @ts-ignore
            this.setState({editorState: state.apply(tr)})
            //this.state.editorView.updateState()
        }
    }

    _onReady = (ev: EditorView): void => {
        if (ev !== this.state.editorView) {
            const editorView = ev as CustomEditorView
            this.setState({editorView})
            const {onReady} = this.props
            onReady && onReady(editorView)
        }
    }
}
