import cx from "classnames"
import * as React from "react"

import "./czi-editor-frameset.css"

export type EditorFramesetProps = {
    body: React.ReactElement<any> | null | undefined
    className: string | null | undefined
    embedded: boolean | null | undefined
    fitToContent: boolean | null | undefined
    header: React.ReactElement<any> | null | undefined
    height: (string | number) | null | undefined
    toolbarPlacement?: "header" | "body" | null
    toolbar: React.ReactElement<any> | null | undefined
    width: (string | number) | null | undefined
}

export const FRAMESET_BODY_CLASSNAME = "czi-editor-frame-body"

function toCSS(val: (number | string) | null | undefined): string {
    if (typeof val === "number") {
        return val + "px"
    }
    if (val === undefined || val === null) {
        return "auto"
    }
    return String(val)
}

class EditorFrameset extends React.Component<any, any> {
    props: EditorFramesetProps

    render() {
        const {
            body,
            className,
            embedded,
            header,
            height,
            toolbarPlacement,
            toolbar,
            width,
            fitToContent,
        } = this.props

        const useFixedLayout = width !== undefined || height !== undefined
        let mainClassName = ""
        //  FS IRAD-1040 2020-17-09
        //  wrapping style for fit to content mode
        if (fitToContent) {
            mainClassName = cx(className, {
                "czi-editor-frameset": true,
                "with-fixed-layout": useFixedLayout,
                fitToContent: fitToContent,
            })
        } else {
            mainClassName = cx(className, {
                "czi-editor-frameset": true,
                "with-fixed-layout": useFixedLayout,
                embedded: embedded,
            })
        }

        const mainStyle = {
            width: toCSS(
                width === undefined && useFixedLayout ? "auto" : width,
            ),
            height: toCSS(
                height === undefined && useFixedLayout ? "auto" : height,
            ),
        }

        const toolbarHeader =
            toolbarPlacement === "header" || !toolbarPlacement ? toolbar : null
        const toolbarBody = toolbarPlacement === "body" && toolbar

        return (
            <div className={mainClassName} style={mainStyle}>
                <div className="czi-editor-frame-main">
                    <div className="czi-editor-frame-head">
                        {header}
                        {toolbarHeader}
                    </div>
                    <div className={FRAMESET_BODY_CLASSNAME}>
                        {toolbarBody}
                        <div className="czi-editor-frame-body-scroll">
                            {body}
                        </div>
                    </div>
                    <div className="czi-editor-frame-footer" />
                </div>
            </div>
        )
    }
}

export default EditorFrameset
