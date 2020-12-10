import cx from 'classnames'
import {DOMSerializer, Schema} from 'prosemirror-model'
import {EditorState, Transaction} from 'prosemirror-state'
import {EditorView} from 'prosemirror-view'
import * as React from 'react'
import webfontloader from 'webfontloader'
import {prefixed} from '../util'

import {
    registerEditorView,
    releaseEditorView,
} from '../CZIProseMirror'
import {BOOKMARK, IMAGE, LIST_ITEM, MATH, EMBED} from '../NodeNames'
import WebFontLoader from '../WebFontLoader'
import {preLoadFonts} from '../FontTypeMarkSpec'
import createEmptyEditorState from '../createEmptyEditorState'
import normalizeHTML from '../normalizeHTML'
import BookmarkNodeView from './BookmarkNodeView'
import CustomEditorView from './CustomEditorView'
import CustomNodeView from './CustomNodeView'
import ImageNodeView from './ImageNodeView'
import ListItemNodeView from './ListItemNodeView'
import MathNodeView from './MathNodeView'
import EmbedNodeView from './EmbedNodeView'
import handleEditorDrop from './handleEditorDrop'
import handleEditorKeyDown from './handleEditorKeyDown'
import handleEditorPaste from './handleEditorPaste'
import { uuid } from '../util'
import {EditorRuntime} from '../Types'

export interface ChangeArgs {
    state: EditorState
    transaction: Transaction<any>
}

export type EditorProps = {
    id?: string
    autoFocus?: boolean | null | undefined
    disabled?: boolean | null | undefined
    dispatchTransaction?: (tr: Transaction) => void | null | undefined
    editorState?: EditorState | null | undefined
    embedded?: boolean | null | undefined
    fitToContent?: boolean | null | undefined
    onBlur?: () => void | null | undefined
    onChange?: (ChangeArgs) => void | null | undefined
    onReady?: (view: EditorView) => void | null | undefined
    // Mapping for custom node views.
    nodeViews?:
                                  | {
                                      [nodeName: string]: CustomNodeView
                                  }
                                | null
                                | undefined
    placeholder?: (string | React.ReactElement<any>) | null | undefined
    readOnly?: boolean | null | undefined
    runtime?: EditorRuntime | null | undefined
    transformPastedHTML?: (html: string) => string
}

// Export utilities for debugging.
// window.CZIProseMirror = {
//     exportJSON,
//     registeryKeys,
// }

const AUTO_FOCUS_DELAY = 350

// Default custom node views.
export const DEFAULT_NODE_VIEWS = Object.freeze({
    [IMAGE]: ImageNodeView,
    [MATH]: MathNodeView,
    [BOOKMARK]: BookmarkNodeView,
    [LIST_ITEM]: ListItemNodeView,
    [EMBED]: EmbedNodeView,
})

const EDITOR_EMPTY_STATE = Object.freeze(createEmptyEditorState())

// Monkey patch the `scrollIntoView` mathod of 'Transaction'.
// Why this is necessary?
// It appears that promse-mirror does call `scrollIntoView` extensively
// from many of the built-in transformations, thus cause unwanted page
// scrolls. To make the behavior more manageable, this patched method asks
// developer to explicitly use `scrollIntoView(true)` to enforce page scroll.
const scrollIntoView = Transaction.prototype.scrollIntoView
const scrollIntoViewPatched = function(forced: boolean): Transaction {
    if (forced === true && scrollIntoView) {
        return scrollIntoView.call(this)
    } else {
        return this
    }
}
Transaction.prototype.scrollIntoView = scrollIntoViewPatched as () => Transaction<any>

// Sets the implementation so that `FontTypeMarkSpec` can load custom fonts.
WebFontLoader.setImplementation(webfontloader)
// FS IRAD-988 2020-06-18
preLoadFonts()

const handleDOMEvents = {
    drop: handleEditorDrop,
    keydown: handleEditorKeyDown,
    paste: handleEditorPaste,
}

function bindNodeView(NodeView: any): Function {
    return (node, view, getPos, decorations) => {
        return new NodeView(node, view, getPos, decorations)
    }
}

function getSchema(editorState: EditorState | null | undefined): Schema {
    return editorState ? editorState.schema : EDITOR_EMPTY_STATE.schema
}

class EditingArea extends React.Component<EditorProps, any> {
    static EDITOR_EMPTY_STATE = EDITOR_EMPTY_STATE

    _autoFocusTimer: number = 0
    _id = uuid()
    _editorView = null

    panelRef = React.createRef<HTMLDivElement>()

    props: EditorProps

    state = {
        isPrinting: false,
    }

    static defaultProps = {
        transformPastedHTML: normalizeHTML,
    }

    componentDidMount(): void {
        const {
            onReady,
            editorState,
            readOnly,
            runtime,
            placeholder,
            disabled,
            dispatchTransaction,
            nodeViews,
            transformPastedHTML,
        } = this.props

        const editorNode = this.panelRef.current
        if (editorNode) {
            const effectiveNodeViews = Object.assign(
                {},
                DEFAULT_NODE_VIEWS,
                nodeViews,
            )
            const boundNodeViews = {}
            const schema = getSchema(editorState)
            const {nodes} = schema

            Object.keys(effectiveNodeViews).forEach(nodeName => {
                const nodeView = effectiveNodeViews[nodeName]
                // Only valid and supported node views should be used.
                if (nodes[nodeName]) {
                    boundNodeViews[nodeName] = bindNodeView(nodeView)
                }
            })

            // Reference: http://prosemirror.net/examples/basic/
            const view = (this._editorView = new CustomEditorView(editorNode, {
                clipboardSerializer: DOMSerializer.fromSchema(schema),
                dispatchTransaction,
                editable: this._isEditable,
                nodeViews: boundNodeViews,
                state: editorState || EDITOR_EMPTY_STATE,
                transformPastedHTML,
                handleDOMEvents,
            }))

            view.runtime = runtime
            view.placeholder = placeholder
            view.readOnly = !!readOnly
            view.disabled = !!disabled
            view.updateState(editorState || EDITOR_EMPTY_STATE)

            // Expose the view to CZIProseMirror so developer could debug it.
            registerEditorView(this._id, view)

            onReady && onReady(view)

            this._autoFocusTimer && clearTimeout(this._autoFocusTimer)
            this._autoFocusTimer = setTimeout(this.focus, AUTO_FOCUS_DELAY) as any as number

        }

        window.addEventListener('beforeprint', this._onPrintStart, false)
        window.addEventListener('afterprint', this._onPrintEnd, false)
    }

    componentDidUpdate(prevProps: EditorProps): void {
        const view = this._editorView
        if (view) {
            const prevSchema = getSchema(prevProps.editorState)
            const currSchema = getSchema(this.props.editorState)
            if (prevSchema !== currSchema) {
                // schema should never change.
                // TODO: re-create the editor view if schema changed.
                console.error('editor schema changed.')
            }

            const {
                runtime,
                editorState,
                placeholder,
                readOnly,
                disabled,
            } = this.props
            const {isPrinting} = this.state
            const state = editorState || EDITOR_EMPTY_STATE
            view.runtime = runtime
            view.placeholder = placeholder
            view.readOnly = !!readOnly || isPrinting
            view.disabled = !!disabled
            view.updateState(state)
            if (this._autoFocusTimer && !this.props.autoFocus) {
                clearTimeout(this._autoFocusTimer)
                this._autoFocusTimer = 0
            }
        }
    }

    componentWillUnmount(): void {
        this._autoFocusTimer && clearTimeout(this._autoFocusTimer)
        this._autoFocusTimer = 0
        this._editorView && this._editorView.destroy()
        this._editorView = null
        releaseEditorView(this._id)
        window.removeEventListener('beforeprint', this._onPrintStart, false)
        window.removeEventListener('afterprint', this._onPrintEnd, false)
    }

    render() {
        const {embedded, fitToContent, readOnly} = this.props
        let className = ''
        //  FS IRAD-1040 2020-17-09
        //  wrapping style for fit to content mode
        if (fitToContent) {
            className = cx('prosemirror-editor-wrapper', {
                fitToContent,
                readOnly,
            })
        } else {
            className = cx('prosemirror-editor-wrapper', {embedded, readOnly})
        }
        return (
            <div
                className={className}
                ref={this.panelRef}
                { ...{[prefixed('prosemirror-editor-id', { format: 'data' })]: this._id}}
                id={this._id}
                onBlur={this._onBlur}
            />
        )
    }

    _onBlur = (): void => {
        const {onBlur} = this.props
        const view = this._editorView
        if (view && !view.disabled && !view.readOnly && onBlur) {
            onBlur()
        }
    }

    focus = (): void => {
        const view = this._editorView
        if (view && !view.disabled && !view.readOnly) {
            view.focus()
        }
        this._autoFocusTimer = 0
    }

    _isEditable = (): boolean => {
        const {disabled, readOnly} = this.props
        const {isPrinting} = this.state
        return !isPrinting && !!this._editorView && !readOnly && !disabled
    }

    _onPrintStart = (): void => {
        this.setState({isPrinting: true})
    }

    _onPrintEnd = (): void => {
        this.setState({isPrinting: false})
    }
}

export default EditingArea
