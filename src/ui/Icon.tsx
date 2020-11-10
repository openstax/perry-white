import cx from "classnames"
import * as React from "react"

import canUseCSSFont from "./canUseCSSFont"

import "./czi-icon.css"

// [FS] IRAD-1061 2020-09-19
// Now loaded locally, so that it work in closed network as well.
//import injectStyleSheet from './injectStyleSheet';
import "./icon-font.css"

const VALID_CHARS = /[a-z_]+/
const cached = {}

const CSS_CDN_URL = "//fonts.googleapis.com/icon?family=Material+Icons"
const CSS_FONT = "Material Icons"

// ;(async function() {
//     // Inject CSS Fonts reuqired for toolbar icons.
//     const fontSupported = await canUseCSSFont(CSS_FONT)
//     if (!fontSupported) {
//         console.info("Add CSS from ", CSS_CDN_URL)
//         // [FS] IRAD-1061 2020-09-19
//         // Now loaded locally, so that it work in closed network as well.
//         //injectStyleSheet(CSS_CDN_URL);
//     }
// })()

class SuperscriptIcon extends React.Component<any, any> {
    render() {
        return (
            <span className="superscript-wrap">
                <span className="superscript-base">x</span>
                <span className="superscript-top">y</span>
            </span>
        )
    }
}
class SubscriptIcon extends React.Component<any, any> {
    render() {
        return (
            <span className="subscript-wrap">
                <span className="subscript-base">x</span>
                <span className="subscript-bottom">y</span>
            </span>
        )
    }
}

const CUSTOM = {
    superscript: <SuperscriptIcon />,
    subscript: <SubscriptIcon />,
}

class Icon extends React.Component<any, any> {
    // Get the static Icon.
    static get(
        type: string,
        title?: string | null | undefined,
    ) {
        const key = `${type || ""}-${title || ""}`
        const icon = cached[key] || <Icon title={title} type={type} />
        cached[key] = icon
        return icon
    }

    props: {
        type: string
        title: string | null | undefined
    }

    render() {
        const {type, title} = this.props
        let className = ""
        let children = ""
        const custom = CUSTOM[type]
        if (custom) {
            className = cx("czi-icon", {[type]: true})
            children = custom
        } else if (!type || !VALID_CHARS.test(type)) {
            className = cx("czi-icon-unknown")
            children = title || type
        } else {
            className = cx("czi-icon", {[type]: true})
            children = type
        }
        return <span className={className}>{children}</span>
    }
}

export default Icon
