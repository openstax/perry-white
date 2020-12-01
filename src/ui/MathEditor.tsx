import * as React from 'react'
import { Mathfield } from './MathField'
import CustomButton from './CustomButton'
import preventEventDefault from './preventEventDefault'
import { uuid, prefixed } from '../util'

type Props = {
    initialValue: string | null | undefined
    close: (latex?: string) => void
}

class MathEditor extends React.Component<Props, any> {

    inputRef = React.createRef<HTMLInputElement>()

    state = {
        initialValue: this.props.initialValue,
        value: this.props.initialValue || '',
    }

    _id = uuid()
    _unmounted = false

    componentDidMount() {
        this.inputRef.current.focus()
    }

    render() {
        const {initialValue, value} = this.state
        const operation = initialValue ? 'Update' : 'Insert'

        return (
            <div className={prefixed('math-editor')}>
                <form className={prefixed('form')} onSubmit={preventEventDefault}>
                    <fieldset>
                        <legend>{operation} Latex</legend>
                        <Mathfield
                            latex={value}
                            onChange={this._onChange}
                        />
                        Latex: <input onChange={this._onLatexChange} ref={this.inputRef} type="text" value={value} />

                    </fieldset>
                    <div className={prefixed('form-buttons')}>
                        <CustomButton label="Cancel" onClick={this._cancel} />
                        <CustomButton
                            active={true}
                            disabled={!this.state.value}
                            label={operation}
                            onClick={this._insert}
                        />
                    </div>
                </form>
            </div>
        )
    }
    _onLatexChange = ({ target: { value }}) => {
        this._onChange(value)
    }

    _onChange = (value: string): void => {
        this.setState({value})
    }

    _cancel = (): void => {
        this.props.close()
    }

    _insert = (): void => {
        this.props.close(this.state.value)
    }
}

export default MathEditor
