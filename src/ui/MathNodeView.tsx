import CustomNodeView from './CustomNodeView'
import MathInlineEditor from './MathInlineEditor'
import * as React from 'react'
import createPopUp from './createPopUp'
import cx from 'classnames'
import renderLaTeXAsHTML from './renderLaTeXAsHTML'
import {Decoration} from 'prosemirror-view'
import {FRAMESET_BODY_CLASSNAME} from './EditorFrameset'
import {Node} from 'prosemirror-model'
import {atAnchorBottomCenter} from './PopUpPosition'
import {NodeSelection} from 'prosemirror-state'
import { uuid } from '../util'
import {NodeViewProps} from './CustomNodeView'
import {prefixed} from '../util'
import { Mathfield } from './MathField'
import { Mathfield as MathFieldType, MathfieldConfig} from 'mathlive'

class MathViewBody extends React.Component<NodeViewProps, any> {

    state = {
        isInlineEditing: false,
        isPopupShowing: false,
    }

    _inlineEditor = null
    _id = uuid()
    _mounted = false

    componentDidMount(): void {
        this._mounted = true
        this._renderInlineEditor()
    }

    componentDidUpdate(prevProps: NodeViewProps): void {
        this._renderInlineEditor()
    }

    componentWillUnmount(): void {
        this._mounted = false
    }

    render() {
        const config = {
            defaultMode: 'math',
            virtualKeyboardMode: 'onfocus',
            onFocus: this._onEditStart,
            onBlur: this._onEditEnd,
        } as MathfieldConfig
        const { isInlineEditing, isPopupShowing } = this.state
        const isActive = Boolean(isInlineEditing || isPopupShowing)
        const {node, selected} = this.props
        const {attrs} = node
        const {math} = attrs
        const className = cx(prefixed('math-view-body'), 'math-rendered', {active: isActive, selected})

        return (
            <span
                className={className}
                data-active={isActive}
                id={this._id}
            >
                <Mathfield
                    className={prefixed('math-view-body-content')}
                    latex={math}
                    mathfieldConfig={config}
                    onChange={this._onMathChange}
                />
            </span>
        )

    }

    _onMathChange = (math: string): void => {
        this._onChange({ math })
    }

    _renderInlineEditor(): void {
        const el = document.getElementById(this._id)

        if (!el || el.getAttribute('data-active') !== 'true') {

            this._inlineEditor && this._inlineEditor.close()
            return
        }
        const {node} = this.props
        const editorProps = {
            value: node.attrs,
            onSelect: this._onChange,
            onEditStart: this._onPopupEditStart,
            onEditEnd: this._onPopupEditEnd,
        }
        if (this._inlineEditor) {
            this._inlineEditor.update(editorProps)
        } else {
            this._inlineEditor = createPopUp(MathInlineEditor, editorProps, {
                anchor: el,
                autoDismiss: false,
                container: el.closest(`.${FRAMESET_BODY_CLASSNAME}`),
                position: atAnchorBottomCenter,
                onClose: () => {
                    this._inlineEditor = null
                },
            })
        }
    }

    _onPopupEditStart = () => {
        this.setState({ isPopupShowing: true })
    }

    _onPopupEditEnd = () => {
        this.setState({ isPopupShowing: false })
    }

    _onEditStart = (mf: MathFieldType):void => {
        this.setState({ isInlineEditing: true })
    }

    _onEditEnd = (mf: MathFieldType):void => {
        this.setState({ isInlineEditing: false })
    }

    _onChange = (
        value:
        | {align?: string | null | undefined; math: string}
        | null
        | undefined,
    ): void => {
        if (!this._mounted) {
            return
        }

        const align = value ? value.align : this.props.node.attrs.align
        const math = value ? value.math : null

        const {getPos, node, editorView} = this.props
        const pos = getPos()
        const attrs = {
            ...node.attrs,
            math,
            align,
        }

        let tr = editorView.state.tr
        const {selection} = editorView.state
        tr = tr.setNodeMarkup(pos, null, attrs)

        const origSelection = NodeSelection.create(tr.doc, selection.from)
        tr = tr.setSelection(origSelection)
        editorView.dispatch(tr)
    }
}

class MathNodeView extends CustomNodeView {

    createDOMElement(): HTMLElement {
        const el = document.createElement('span')
        el.className = prefixed('math-view')
        this._updateDOM(el)
        return el
    }

    update(node: Node, decorations: Array<Decoration>): boolean {
        super.update(node, decorations)
        this._updateDOM(this.dom)
        return true
    }

    renderReactComponent() {
        return <MathViewBody {...this.props} />
    }

    _updateDOM(el: HTMLElement): void {
        const {align} = this.props.node.attrs
        let className = prefixed('math-view')
        if (align) {
            className += ' align-' + align
        }
        el.className = className
    }
}

export default MathNodeView
