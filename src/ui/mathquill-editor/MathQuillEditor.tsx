import * as MathQuillEditorSymbols from './MathQuillEditorSymbols'
import MathQuillEditorSymbolsPanel from './MathQuillEditorSymbolsPanel'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import cx from 'classnames'
import {prefixed} from '../../util'

// MathQuill requires this to get JQuery exported as global.
// eslint-disable-next-line no-unused-vars
import jquery from 'jquery'

import {MathQuillEditorSymbol} from './MathQuillEditorSymbols'
import 'node-mathquill/build/mathquill.js'

const MQ = (window as any).MathQuill.getInterface(2)


class MathQuillElement extends React.Component<any, any> {
    shouldComponentUpdate(): boolean {
        return false
    }

    render() {
        return (
            <div
                className={prefixed('mathquill-editor-element')}
                dangerouslySetInnerHTML={{__html: this.props.value}}
            />
        )
    }
}

class MathQuillEditor extends React.Component<any, any> {
    props: {
        value: string
        onChange?: (latex: string) => void | null | undefined
    }

    // MathJax apparently fire 4 edit events on startup.
    _element = null
    _ignoreEditEvents = 4
    _mathField = null
    _latex = ''

    render() {
        const {value} = this.props
        const panels = [
            MathQuillEditorSymbols.OPERATORS,
            MathQuillEditorSymbols.STRUCTURE,
            MathQuillEditorSymbols.SYMBOLS,
            MathQuillEditorSymbols.TRIG,
        ].map(this._renderPanel)

        const empty = !value
        const className = cx(prefixed('mathquill-editor'), {empty})
        return (
            <div className={className}>
                <div className={prefixed('mathquill-editor-main')}>
                    <MathQuillElement ref={this._onElementRef} />
                </div>
                <div className={prefixed('mathquill-editor-side')}>{panels}</div>
            </div>
        )
    }

    componentDidUpdate(): void {
        const mathField = this._mathField
        if (this._latex !== this.props.value && mathField) {
            mathField.latex(this.props.value || ' ')
        }
    }

    componentDidMount(): void {
        const config = {
            autoCommands: 'pi theta sqrt sum',
            autoOperatorNames: 'sin cos',
            restrictMismatchedBrackets: true,
            handlers: {
                edit: this._onEdit,
            },
        }

        const mathField = MQ.MathField(this._element, config)
        this._mathField = mathField

        // TODO: Remove this if MathQuill supports `\displaystyle`.
        const rawLatex = (this.props.value || '').replace(/\\displaystyle/g, '')

        mathField.latex(rawLatex || ' ')
        mathField.focus()
        if (rawLatex && !mathField.latex()) {
            console.error('unable to process latex', rawLatex)
        }
    }

    _renderPanel = (
        symbols: {title: string; symbols: Array<MathQuillEditorSymbol>},
        ii: number,
    ): React.ReactElement<any> => {
        return (
            <MathQuillEditorSymbolsPanel
                key={`s${ii}`}
                onSelect={this._onSymbolSelect}
                symbols={symbols}
            />
        )
    }

    _onSymbolSelect = (symbol: MathQuillEditorSymbol): void => {
        const {latex, cmd} = symbol
        const mathField = this._mathField
        if (!mathField || !cmd || !latex) {
            return
        }
        if (cmd === 'write') {
            mathField.write(latex)
        } else if (cmd === 'cmd') {
            mathField.cmd(latex)
        }
        mathField.focus()
    }

    _onEdit = (mathField: any): void => {
        if (this._ignoreEditEvents > 0) {
            this._ignoreEditEvents -= 1
            return
        }

        const {onChange} = this.props
        const latex = mathField.latex()
        this._latex = latex
        onChange && onChange(latex)
    }

    _onElementRef = (ref: any): void => {
        if (ref) {
            this._element = ReactDOM.findDOMNode(ref)
        } else {
            this._element = null
        }
    }
}

export default MathQuillEditor
