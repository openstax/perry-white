import cx from 'classnames'
import * as React from 'react'

import CustomButton from './CustomButton'
import LoadingIndicator from './LoadingIndicator'
import preventEventDefault from './preventEventDefault'
import {prefixed,uuid} from '../util'

import {EditorRuntime, ImageLike} from '../Types'

interface State {
    error: Object
    id: string
    pending: boolean
    alt: string
    image: ImageLike | null
}

class ImageUploadEditor extends React.Component<any, State> {
    _img = null
    _unmounted = false

    props: {
        runtime: EditorRuntime | null | undefined
        close: (val?: ImageLike | null | undefined) => void
    }

    state: State = {
        error: null,
        id: uuid(),
        pending: false,
        alt: '',
        image: null,
    }

    componentWillUnmount(): void {
        this._unmounted = true
    }

    render() {
        const {error, pending, alt, image} = this.state
        const className = cx(prefixed('image-upload-editor'), {pending, error})
        let label: React.ReactNode = 'Choose an image file...'

        if (pending) {
            label = <LoadingIndicator />
        } else if (error) {
            label = 'Something went wrong, please try again'
        }

        return (
            <div className={className}>
                <form className={prefixed('form')} onSubmit={preventEventDefault}>
                    <fieldset>
                        <legend>Upload Image</legend>
                        <div className={prefixed('image-upload-editor-body')}>
                            {this._renderImage(label)}
                        </div>
                        <input
                            className={prefixed('image-upload-editor-alt-text-input')}
                            onChange={this._onAltTextChange}
                            placeholder="Alternative Text"
                            type="text"
                            value={alt || ''}
                        />
                    </fieldset>
                    <div className={prefixed('form-buttons')}>
                        <CustomButton label="Cancel" onClick={this._cancel} />
                        <CustomButton
                            active={!!image}
                            disabled={!image}
                            label="Insert"
                            onClick={this._insert}
                        />
                    </div>
                </form>
            </div>
        )
    }

    _renderImage = (label) => {
        const {image, id, pending, alt} = this.state

        if(!image || (image && !image.src)) {
            return (
                <>
                    <div className={prefixed('image-upload-editor-label')}>
                        {label}
                    </div>
                    <input
                        accept="image/png,image/gif,image/jpeg,image/jpg"
                        className={prefixed('image-upload-editor-input')}
                        disabled={pending}
                        id={id}
                        key={id}
                        onChange={this._onSelectFile}
                        type="file"
                    />
                </>
            )
        }
        return (
            <img alt={alt} height="100%" src={image.src}/>
        )
    }

    _onAltTextChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
        // @ts-ignore
        const alt = e.target.value
        this.setState(
            {
                alt,
            })
    }

    _onSelectFile = (event: React.SyntheticEvent): void => {
        // @ts-ignore
        const file = event.target.files && event.target.files[0]
        if (file && typeof file === 'object') {
            this._upload(file)
        }
    }

    _onSuccess = (image: ImageLike): void => {
        if (this._unmounted) {
            return
        }
        this.setState({
            image: image,
            pending: false,
            error: null,
        })
    }

    _onError = (error: Error): void => {
        if (this._unmounted) {
            return
        }
        this.setState({
            error,
            id: uuid(),
            pending: false,
        })
    }

    _upload = async (file: Blob): Promise<void> => {
        try {
            const runtime = this.props.runtime || {}

            if (!runtime.canUploadImage || !runtime.uploadImage || !runtime.canUploadImage()) {
                throw new Error('feature is not available')
            }
            this.setState({pending: true, error: null})
            const image = await runtime.uploadImage(file)
            this._onSuccess(image)
        } catch (ex) {
            this._onError(ex)
        }
    }

    _insert = (): void => {
        const {image, alt} = this.state
        if (this._unmounted || !image) {
            return
        }
        image.alt = alt
        this.props.close(image)
    }

    _cancel = (): void => {
        this.props.close()
    }
}

export default ImageUploadEditor
