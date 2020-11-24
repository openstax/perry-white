import nullthrows from 'nullthrows'
import {Plugin, PluginKey, Transaction} from 'prosemirror-state'
import {EditorState, TextSelection} from 'prosemirror-state'
import {Decoration, DecorationSet} from 'prosemirror-view'
import {EditorView} from 'prosemirror-view'

import {prefixed} from './util'
import {IMAGE} from './NodeNames'
import { uuid } from './util'

const IMAGE_FILE_TYLES = new Set([
    'image/jpeg',
    'image/gif',
    'image/png',
    'image/jpg',
])

const TITLE = 'Uploading...'

const INNER_HTML = new Array(4).join(
    `<div class="${prefixed('image-upload-placeholder-child')}"></div>`,
)

function isImageUploadPlaceholderPlugin(plugin: Plugin): boolean {
    return plugin instanceof ImageUploadPlaceholderPlugin
}

function isImageFileType(file: File): boolean {
    // eslint-disable-line no-undef
    return file && IMAGE_FILE_TYLES.has(file.type)
}

function findImageUploadPlaceholder(
    placeholderPlugin: ImageUploadPlaceholderPlugin,
    state: EditorState,
    id: Object,
): Decoration | null | undefined {
    const decos = placeholderPlugin.getState(state)
    const found = decos.find(null, null, spec => spec.id === id)
    return found.length ? found[0].from : null
}

function defer(fn: Function): Function {
    return () => {
        setTimeout(fn, 0)
    }
}

export function uploadImageFiles(
    view: EditorView,
    files: Array<File>, // eslint-disable-line no-undef
    coords?: {x: number; y: number} | null | undefined,
): boolean {
    // @ts-ignore
    const {runtime, state, readOnly, disabled} = view
    const {schema, plugins} = state
    if (readOnly || disabled || !runtime || !runtime.canUploadImage) {
        return false
    }

    const imageType = schema.nodes[IMAGE]
    if (!imageType) {
        return false
    }

    if (!runtime.uploadImage || !runtime.canUploadImage) {
        return false
    }

    const imageFiles = Array.from(files).filter(isImageFileType)
    if (!imageFiles.length) {
        return false
    }

    const placeholderPlugin = plugins.find(isImageUploadPlaceholderPlugin)
    if (!placeholderPlugin) {
        return false
    }

    // A fresh object to act as the ID for this upload.
    const id = {
        debugId: 'image_upload_' + uuid(),
    }

    const uploadNext = defer(() => {
        const done = (imageInfo: {src: string | null | undefined}) => {
            const pos = findImageUploadPlaceholder(
                placeholderPlugin,
                view.state,
                id,
            )
            let trNext = view.state.tr
            // @ts-ignore
            if (pos && !view.readOnly && !view.disabled) {
                const imageNode = imageType.create(imageInfo)
                // @ts-ignore
                trNext = trNext.replaceWith(pos, pos, imageNode)
            } else {
                // Upload was cancelled.
                imageFiles.length = 0
            }
            if (imageFiles.length) {
                uploadNext()
            } else {
                // Remove the placeholder.
                trNext = trNext.setMeta(placeholderPlugin, {remove: {id}})
            }
            view.dispatch(trNext)
        }
        const ff = nullthrows(imageFiles.shift())
        runtime.uploadImage(ff)
            .then(done)
            .catch(done.bind(null, {src: null}))
    })

    uploadNext()

    let {tr} = state

    // Replace the selection with a placeholder
    let from = 0

    // Adjust the cursor to the dropped position.
    if (coords) {
        const dropPos = view.posAtCoords({
            left: coords.x,
            top: coords.y,
        })

        if (!dropPos) {
            return false
        }

        from = dropPos.pos
        tr = tr.setSelection(TextSelection.create(tr.doc, from, from))
    } else {
        from = tr.selection.to
        tr = tr.setSelection(TextSelection.create(tr.doc, from, from))
    }
    const meta = {
        add: {
            id,
            pos: from,
        },
    }

    tr = tr.setMeta(placeholderPlugin, meta)
    view.dispatch(tr)
    return true
}

// https://prosemirror.net/examples/upload/
class ImageUploadPlaceholderPlugin extends Plugin {
    constructor() {
        super({
            // [FS] IRAD-1005 2020-07-07
            // Upgrade outdated packages.
            key: new PluginKey('ImageUploadPlaceholderPlugin'),
            state: {
                init() {
                    return DecorationSet.empty
                },
                apply(tr: Transaction, set: DecorationSet): DecorationSet {
                    // Adjust decoration positions to changes made by the transaction
                    set = set.map(tr.mapping, tr.doc)
                    // See if the transaction adds or removes any placeholders
                    const action = tr.getMeta(this)
                    if (action && action.add) {
                        const el = document.createElement('div')
                        el.title = TITLE
                        el.className = prefixed('image-upload-placeholder')
                        el.innerHTML = INNER_HTML

                        const deco = Decoration.widget(action.add.pos, el, {
                            id: action.add.id,
                        })

                        set = set.add(tr.doc, [deco])
                    } else if (action && action.remove) {
                        const finder = spec => spec.id == action.remove.id
                        set = set.remove(set.find(null, null, finder))
                    }
                    return set
                },
            },
            props: {
                decorations(state: EditorState): DecorationSet {
                    return this.getState(state)
                },
            },
        })
    }
}

export default ImageUploadPlaceholderPlugin
