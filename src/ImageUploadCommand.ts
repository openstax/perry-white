import {Class} from 'utility-types'

import {EditorState} from 'prosemirror-state'
import EditorView from './ui/EditorView'
import * as React from 'react'

import ImageSourceCommand from './ImageSourceCommand'
import ImageUploadEditor from './ui/ImageUploadEditor'

class ImageUploadCommand extends ImageSourceCommand {
    isEnabled = (
        state: EditorState,
        view: EditorView,
    ): boolean => {
        if (!view) {
            return false
        }

        // @ts-ignore
        const {runtime} = view
        if (!runtime) {
            return false
        }

        if (!runtime.canUploadImage || !runtime.uploadImage) {
            return false
        }
        if (!runtime.canUploadImage()) {
            return false
        }

        return this.__isEnabled(state, view)
    }

    getEditor(): Class<React.Component<any, any>> {
        return ImageUploadEditor
    }
}
export default ImageUploadCommand
