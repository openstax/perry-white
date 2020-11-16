import * as React from 'react'
import sanitizeURL from '../sanitizeURL'
import CustomButton from './CustomButton'
import {ENTER} from './KeyCodes'
import preventEventDefault from './preventEventDefault'
import {prefixed} from '../util'
const BAD_CHARACTER_PATTER = /\s/

type Props = {
    // eslint-disable-line no-unused-vars
    href: string | null | undefined
    close: (href?: string) => void
}

class LinkURLEditor extends React.Component<Props, any> {

    state = {
        url: this.props.href,
    }

    render() {
        const {href} = this.props
        const {url} = this.state

        const error = url ? BAD_CHARACTER_PATTER.test(url) : false

        let label = 'Apply'
        let disabled = !!error
        if (href) {
            label = url ? 'Apply' : 'Remove'
            disabled = error
        } else {
            disabled = error || !url
        }

        return (
            <div className={prefixed('image-url-editor')}>
                <form className={prefixed('form')} onSubmit={preventEventDefault}>
                    <fieldset>
                        <legend>Add a Link</legend>
                        <input
                            autoFocus={true}
                            onChange={this._onURLChange}
                            onKeyDown={this._onKeyDown}
                            placeholder="Paste a URL"
                            spellCheck={false}
                            type="text"
                            value={url || ''}
                        />
                    </fieldset>
                    <div className={prefixed('form-buttons')}>
                        <CustomButton label="Cancel" onClick={this._cancel} />
                        <CustomButton
                            active={true}
                            disabled={disabled}
                            label={label}
                            onClick={this._apply}
                        />
                    </div>
                </form>
            </div>
        )
    }

    _onKeyDown = (e: any) => {
        if (e.keyCode === ENTER) {
            e.preventDefault()
            this._apply()
        }
    }

    _onURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value as string
        this.setState({
            url,
        })
    }

    _cancel = (): void => {
        this.props.close()
    }

    _apply = (): void => {
        const {url} = this.state
        if (url && !BAD_CHARACTER_PATTER.test(url)) {
            this.props.close(sanitizeURL(url))
        }
    }
}

export default LinkURLEditor
