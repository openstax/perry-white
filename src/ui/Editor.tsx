import {Transaction} from 'prosemirror-state'
import * as React from 'react'
import cx from 'classnames'

import CustomEditorView from './CustomEditorView'
import createEmptyEditorState from '../createEmptyEditorState'
import EditingArea from './EditingArea'
import EditorFrameset from './EditorFrameset'
import EditorToolbar from './EditorToolbar'
import Frag from './Frag'
import uuid from './uuid'

import {EditorFramesetProps} from './EditorFrameset'
import {EditorProps} from './EditingArea'

type Props = EditorFramesetProps & EditorProps & {children?: any | null | undefined}

interface State {
    contentHeight?: number
    editorState?: object
    contentOverflowHidden?: boolean
    editorView?: CustomEditorView
}

const EMPTY_EDITOR_RUNTIME = {}

export class Editor extends React.Component<Props, State> {
    props: Props

    state: State

    _id: string

    constructor(props: any, context: any) {
        super(props, context)
        this._id = uuid()
        this.state = {
            contentHeight: NaN,
            contentOverflowHidden: false,
            editorView: null,
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
            onChange,
            nodeViews,
            placeholder,
            readOnly,
            width,
            fitToContent,
        } = this.props

        let {editorState, runtime} = this.props

        editorState = editorState || createEmptyEditorState()
        runtime = runtime || EMPTY_EDITOR_RUNTIME
        const {editorView} = this.state

        console.log({ editorView, runtime  })

        const toolbar =
            !!readOnly === true ? null : (
                <EditorToolbar
                    disabled={disabled}
                    dispatchTransaction={this._dispatchTransaction}
                    editorState={editorState || EditingArea.EDITOR_EMPTY_STATE}
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
                    onChange={onChange}
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
        const {onChange, editorState, readOnly} = this.props
        if (readOnly === true) {
            return
        }
        const state = editorState || EditingArea.EDITOR_EMPTY_STATE

        if (onChange) {
            onChange({ state, transaction: tr })
        } else {
            // @ts-ignore
            this.setState({editorState: state.apply(tr)})
            //this.state.editorView.updateState()
        }
    }

    _onReady = (editorView: CustomEditorView): void => {
        if (editorView !== this.state.editorView) {
            this.setState({editorView})
            const {onReady} = this.props
            onReady && onReady(editorView)
        }
    }
}
