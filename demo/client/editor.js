import applyDevTools from 'prosemirror-dev-tools'
import { TextSelection } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import * as React from 'react'
import { DOMSerializer } from 'prosemirror-model'
import { hot } from 'react-hot-loader';
import convertFromJSON from '../../src/convertFromJSON'
import convertToHTML from '../../src/convertToHTML'
import { Editor } from '../../src/index'
import uuid from '../../src/uuid'
import Runtime from './CustomRuntime'
import SimpleConnector from '../../src/client/SimpleConnector'
import CollabConnector from '../../src/client/CollabConnector'
import { EMPTY_DOC_JSON } from '../../src/createEmptyEditorState'
import createPopUp from '../../src/ui/createPopUp'
import {atViewportCenter} from '../../src/ui/PopUpPosition'
import AlertInfo from '../../src/ui/AlertInfo'
import convertFromHTML from '../../src/convertFromHTML'
import './editor.css'

/**
 * properties:
 *  docID {number} [0] Collaborative Doument ID
 *  debug {boolean} [false] To enable/disable ProseMirror Debug Tools, available only in development.
 *  width {string} [100%] Width of the editor.
 *  height {height} [100%] Height of the editor.
 *  readOnly {boolean} [false] To enable/disable editing mode.
 *  onChange {@callback} [null] Fires after each significant change.
 *      @param data {JSON} Modified document data.
 *  onReady {@callback} [null] Fires when the editor is fully ready.
 *      @param ref {LICIT} Rerefence of the editor.
 *  data {JSON} [null] Document data to be loaded into the editor.
 *  disabled {boolean} [false] Disable the editor.
 *  embedded {boolean} [false] Disable/Enable inline behaviour.
 *  plugins [plugins] External Plugins into the editor.
 *  fitToContent {boolean} [false] Fit to content behavour.
 */
class DemoEditor extends React.Component {
    _runtime
    _connector
    _clientID
    _editorView
    _skipSCU

    _popUp = null

    constructor(props, context) {

        super(props, context)

        this._clientID = uuid()
        this._editorView = null
        this._skipSCU = true

        const noop = function () { }

        // [FS] IRAD-981 2020-06-10
        // Component's configurations.
        const docID = props.docID || 0 // 0 < means collaborative.
        const collaborative = (0 < docID)
        const debug = props.debug || false
        const width = props.width || '100%'
        const height = props.height || '100%'
        const onChangeCB = (typeof props.onChange === 'function') ? props.onChange : noop
        const onReadyCB = (typeof props.onReady === 'function') ? props.onReady : noop
        const readOnly = props.readOnly || false
        const data = props.data || null
        const disabled = props.disabled || false
        const embedded = props.embedded || false// [FS] IRAD-996 2020-06-30
        const fitToContent = props.fitToContent || false// [FS] IRAD-996 2020-06-30
        // [FS] 2020-07-03
        // Handle Image Upload from Angular App
        const runtime = props.runtime ? props.runtime : new Runtime()
        const plugins = props.plugins || null
        let editorState = convertFromHTML(props.html, null, plugins)
        console.log({ editorState })
        //    let editorState = convertFromJSON(data, null, plugins)
        // [FS] IRAD-1067 2020-09-19
        // The editorState will return null if the doc Json is mal-formed
        if (null == editorState) {
            editorState = convertFromJSON(EMPTY_DOC_JSON, null, plugins)
            this.showAlert()
        }

        const setState = this.setState.bind(this)
        this._connector = collaborative
            ? new CollabConnector(editorState, setState, { docID })
            : new SimpleConnector(editorState, setState)

        // FS IRAD-989 2020-18-06
        // updating properties should automatically render the changes
        this.state = {
            docID,
            data,
            editorState,
            width,
            height,
            readOnly,
            onChangeCB,
            onReadyCB,
            debug,
            disabled,
            embedded,
            fitToContent,
            runtime
        }
        // FS IRAD-1040 2020-26-08
        // Get the modified schema from editorstate and send it to collab server
        if (this._connector.updateSchema) {
            this._connector.updateSchema(this.state.editorState.schema)
        }
    }

    // [FS] IRAD-1067 2020-09-19
    // Alert funtion to show document is corrupted
    showAlert() {
        const anchor =  null
        this._popUp = createPopUp(AlertInfo, null, {
            anchor,
            position: atViewportCenter,
            onClose: val => {
                if (this._popUp) {
                    this._popUp = null
                }
            },
        })


    }

    setContent = (content = {}) => {
        const { doc, tr, schema } = this._connector.getState()
        const document = content
            ? schema.nodeFromJSON(content)
            : schema.nodeFromJSON(EMPTY_DOC_JSON)

        const selection = TextSelection.create(doc, 0, doc.content.size)
        const transaction = tr
            .setSelection(selection)
            .replaceSelectionWith(document, false)

        this._skipSCU = true
        this._editorView.dispatch(transaction)
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Only interested if properties are set from outside.
        if (!this._skipSCU) {
            this._skipSCU = false
            let dataChanged = false

            // Compare data, if found difference, update editorState
            if (this.state.data !== nextState.data) {
                dataChanged = true
            } else if (null === nextState.data) {
                if (
                    this.state.editorState.doc.textContent &&
                        0 < this.state.editorState.doc.textContent.trim().length
                ) {
                    dataChanged = true
                }
            }

            if (dataChanged) {
                // data changed, so update document content
                this.setContent(nextState.data)
            }

            if (this.state.docID !== nextState.docID) {
                // Collaborative mode changed
                const collabEditing = (nextState.docID != 0)
                const editorState = this._connector.getState()
                const setState = this.setState.bind(this)
                const docID = nextState.docID || 1
                // create new connector
                this._connector = collabEditing
                    ? new CollabConnector(editorState, setState, { docID })
                    : new SimpleConnector(editorState, setState)
            }
        }

        return true
    }

    onExport = () => {
        console.log(
            convertToHTML(this._editorView.state)
        )
    }

    render() {
        const { editorState, width, height, readOnly, disabled, embedded, fitToContent, runtime } = this.state
        // [FS] IRAD-978 2020-06-05
        // Using 100vw & 100vh (100% viewport) is not ideal for a component which is expected to be a part of a page,
        // so changing it to 100%  width & height which will occupy the area relative to its parent.
        return (
            <div style={{ height: '100%' }}>
                <Editor
                    disabled={disabled}
                    editorState={editorState}
                    embedded={embedded}
                    fitToContent={fitToContent}
                    height={height}
                    onChange={this._onChange}
                    onReady={this._onReady}
                    readOnly={readOnly}
                    runtime={runtime}
                    width={width}
                />
                <button onClick={this.onExport}>Export as HTML</button>
            </div>
        )
    }

    _onChange = (data) => {
        const { transaction } = data
        // debugger

        let isEmpty = false
        this._connector.onEdit(transaction)
        if (transaction.docChanged) {
            const docJson = transaction.doc.toJSON()
            if (docJson.content && docJson.content.length === 1) {
                if (docJson.content[0].content && '' === docJson.content[0].content[0].text.trim()) {
                    isEmpty = true
                }
            }
            this.state.onChangeCB(docJson, isEmpty)
        }
    }

    _onReady = (editorView) => {
        // [FS][06-APR-2020][IRAD-922]
        // Showing focus in the editor.
        const { state, dispatch } = editorView
        this._editorView = editorView
        const tr = state.tr
        const doc = state.doc
        dispatch(tr.setSelection(TextSelection.create(doc, 0, doc.content.size)))
        editorView.focus()

        if (this.state.onReadyCB) {
            this.state.onReadyCB(this)
        }

        if (this.state.debug) {
            window.debugProseMirror = () => {
                applyDevTools(editorView)
            }
            window.debugProseMirror()
        }
    }

    /**
     * LICIT properties:
     *  docID {number} [0] Collaborative Doument ID
     *  debug {boolean} [false] To enable/disable ProseMirror Debug Tools, available only in development.
     *  width {string} [100%] Width of the editor.
     *  height {height} [100%] Height of the editor.
     *  readOnly {boolean} [false] To enable/disable editing mode.
     *  onChange {@callback} [null] Fires after each significant change.
     *      @param data {JSON} Modified document data.
     *  onReady {@callback} [null] Fires when the editor is fully ready.
     *      @param ref {LICIT} Rerefence of the editor.
     *  data {JSON} [null] Document data to be loaded into the editor.
     *  disabled {boolean} [false] Disable the editor.
     *  embedded {boolean} [false] Disable/Enable inline behaviour.
     * fitToContent {boolean} [false] Fit to content behavour.
     */
    setProps = (props) => {
        if (this.state.readOnly) {
            // It should be possible to load content into the editor in readonly as well.
            // It should not be necessary to make the component writable any time during the process
            const propsCopy = {}
            this._skipSCU = true
            Object.assign(propsCopy, props)
            // make writable without content change
            propsCopy.readOnly = false
            delete propsCopy.data
            this.setState(propsCopy)
        }
        // Need to go through shouldComponentUpdate lifecycle here, when updated from outside,
        // so that content is modified gracefully using transaction so that undo/redo works too.
        this._skipSCU = false
        this.setState(props)
    }
}

export default hot(module)(DemoEditor)
