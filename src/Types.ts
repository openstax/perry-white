import * as React from "react"

export type NodeSpec = {
    attrs?:
        | {
              [key: string]: any
          }
        | null
        | undefined
    content?: string | null | undefined
    draggable?: boolean | null | undefined
    group?: string | null | undefined
    inline?: boolean | null | undefined
    defining?: boolean | null
    name?: string | null | undefined
    parseDOM?: Array<any> | null | undefined
    toDOM?: (node: any) => Array<any> | null | undefined
}

export type MarkSpec = {
    attrs?:
        | {
              [key: string]: any
          }
        | null
        | undefined
    name?: string | null | undefined
    inline?: boolean | null | undefined
    group?: string
    defining?: boolean
    draggable?: boolean
    inclusive?: boolean
    spanning?: boolean
    excludes?: string
    parseDOM: Array<any>
    toDOM: (node: any) => Array<any>
}

export type EditorProps = {}

export type DirectEditorProps = EditorProps & {}

export type RenderCommentProps = {
    commentThreadId: string
    isActive: boolean
    requestCommentThreadDeletion: Function
    requestCommentThreadReflow: Function
}

export type ImageLike = {
    height: number
    id: string
    src: string
    width: number
}

export type EditorRuntime = {
    // Image Proxy
    canProxyImageSrc?: (src: string) => boolean
    getProxyImageSrc?: (src: string) => string

    // Image Upload
    canUploadImage?: () => boolean
    uploadImage?: (obj: Blob) => Promise<ImageLike>

    // Comments
    canComment?: () => boolean
    createCommentThreadID?: () => string
    renderComment?: (
        props: RenderCommentProps,
    ) => React.ReactElement<any> | null | undefined

    // External HTML
    canLoadHTML?: () => boolean
    loadHTML?: () => Promise<string | null | undefined>
}

export type EditorState = any
