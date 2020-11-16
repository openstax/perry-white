import * as React from 'react'

import CustomButton from './CustomButton'
import MathQuillEditor from './mathquill-editor/MathQuillEditor'
import preventEventDefault from './preventEventDefault'
import { uuid, prefixed } from '../util'

type Props = {
    // eslint-disable-line no-unused-vars
    initialValue: string | null | undefined
    close: (latex?: string) => void
}

class MathEditor extends React.Component<Props, any> {

    state = {
        initialValue: this.props.initialValue,
        value: this.props.initialValue || '',
    }

    _id = uuid()
    _unmounted = false

    render() {
        const {initialValue, value} = this.state
        return (
            <div className={prefixed('math-editor')}>
                <form className={prefixed('form')} onSubmit={preventEventDefault}>
                    <fieldset>
                        <legend>Insert Math</legend>
                        <MathQuillEditor
                            onChange={this._onChange}
                            value={value}
                        />
                    </fieldset>
                    <div className={prefixed('form-buttons')}>
                        <CustomButton label="Cancel" onClick={this._cancel} />
                        <CustomButton
                            active={true}
                            disabled={!this.state.value}
                            label={initialValue ? 'Update' : 'Insert'}
                            onClick={this._insert}
                        />
                    </div>
                </form>
            </div>
        )
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
