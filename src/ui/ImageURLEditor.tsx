import * as React from 'react'
import * as PropTypes from 'prop-types'

import CustomButton from './CustomButton'
import preventEventDefault from './preventEventDefault'
import resolveImage from './resolveImage'
import {prefixed} from '../util'
import {ImageLike} from '../Types'

type Props = {
    // eslint-disable-line no-unused-vars
    initialValue: ImageLike | null | undefined
    close: (href?: ImageLike | null) => void
}

interface State {
    src?: string
    validValue?: any
    height?: number
    id?: string
    width?: number;
    alt?: string;
}

class ImageURLEditor extends React.Component<Props, State> {
    _img = null
    _unmounted = false

    // [FS] IRAD-1005 2020-07-07
    // Upgrade outdated packages.
    // To take care of the property type declaration.
    static propsTypes = {
        initialValue: PropTypes.object,
        close: function(props: any, propName: string) {
            const fn = props[propName]
            if (
                !fn.prototype ||
                (typeof fn.prototype.constructor !== 'function' &&
                    fn.prototype.constructor.length !== 1)
            ) {
                return new Error(
                    propName +
                        'must be a function with 1 arg of type ImageLike',
                )
            }
            return undefined
        },
    }

    state:State = {
        ...(this.props.initialValue || {}),
        validValue: null,
    }

    componentWillUnmount(): void {
        this._unmounted = true
    }

    render() {
        const {src, alt, validValue} = this.state
        const preview = validValue ? (
            <div
                className={prefixed('image-url-editor-input-preview')}
                style={{backgroundImage: `url(${String(validValue.src)}`}}
            />
        ) : null

        return (
            <div className={prefixed('image-url-editor')}>
                <form className={prefixed('form')} onSubmit={preventEventDefault}>
                    <fieldset>
                        <legend>Insert Image</legend>
                        <div className={prefixed('image-url-editor-src-input-row')}>
                            <input
                                autoFocus={true}
                                className={prefixed('image-url-editor-src-input')}
                                onChange={this._onSrcChange}
                                placeholder="Paste URL of Image..."
                                type="text"
                                value={src || ''}
                            />
                            <input
                                className={prefixed('image-url-editor-alt-text-input')}
                                onChange={this._onAltTextChange}
                                placeholder="Alternative Text"
                                type="text"
                                value={alt || ''}
                            />
                            {preview}
                        </div>
                        <em>
                            Only select image that you have confirmed the
                            license to use
                        </em>
                    </fieldset>
                    <div className={prefixed('form-buttons')}>
                        <CustomButton label="Cancel" onClick={this._cancel} />
                        <CustomButton
                            active={!!validValue}
                            disabled={!validValue}
                            label="Insert"
                            onClick={this._insert}
                        />
                    </div>
                </form>
            </div>
        )
    }

    _onSrcChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
        // @ts-ignore
        const src = e.target.value
        this.setState(
            {
                src,
                validValue: null,
            },
            this._didSrcChange,
        )
    }

    _onAltTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const alt = e.target.value
        this.setState(
            {
                alt,
            })
    }

    _didSrcChange = (): void => {
        resolveImage(this.state.src).then(result => {
            if (this.state.src === result.src && !this._unmounted) {
                const validValue = result.complete ? result : null
                this.setState({validValue})
            }
        })
    }

    _cancel = (): void => {
        this.props.close()
    }

    _insert = (): void => {
        const {validValue, alt} = this.state
        if(validValue) validValue.alt = alt
        this.props.close(validValue)
    }
}

export default ImageURLEditor
