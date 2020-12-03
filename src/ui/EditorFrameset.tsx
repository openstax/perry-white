import cx from 'classnames'
import * as React from 'react'
import {prefixed} from '../util'
import { useOnClickOutside } from '../hooks/click-outside'

export interface EditorFramesetProps {
    body: React.ReactElement<any> | null | undefined
    className: string | null | undefined
    embedded: boolean | null | undefined
    fitToContent: boolean | null | undefined
    header: React.ReactElement<any> | null | undefined
    height: (string | number) | null | undefined
    toolbarPlacement?: 'header' | 'body' | null
    toolbar: React.ReactElement<any> | null | undefined
    width: (string | number) | null | undefined
    onBlur?: (event: MouseEvent) => void
}

export const FRAMESET_BODY_CLASSNAME = prefixed('editor-frame-body')

function toCSS(val: (number | string) | null | undefined): string {
    if (typeof val === 'number') {
        return val + 'px'
    }
    if (val === undefined || val === null) {
        return 'auto'
    }
    return String(val)
}

export function getParentFrameSet(el:Element) : HTMLDivElement | undefined {
    return el.closest(`.${FRAMESET_BODY_CLASSNAME}`)
}

export const EditorFrameset:React.FC<EditorFramesetProps> = ({
    body,
    className,
    embedded,
    header,
    height,
    toolbarPlacement,
    toolbar,
    width,
    onBlur,
    fitToContent,
}) => {
    const root = React.useRef<HTMLDivElement>()

    useOnClickOutside(root, React.useCallback((event: MouseEvent) => {
        if (!onBlur) return
        const target = (event.target as HTMLElement)
        if (target.closest && !target.closest(prefixed('pop-up-element', { format: 'selector' }))) {
            onBlur(event)
        }
    }, [onBlur]))

    const useFixedLayout = width !== undefined || height !== undefined
    let mainClassName = ''
    //  FS IRAD-1040 2020-17-09
    //  wrapping style for fit to content mode
    if (fitToContent) {
        mainClassName = cx(className, {
            [prefixed('editor-frameset')]: true,
            'with-fixed-layout': useFixedLayout,
            fitToContent: fitToContent,
        })
    } else {
        mainClassName = cx(className, {
            [prefixed('editor-frameset')]: true,
            'with-fixed-layout': useFixedLayout,
            embedded: embedded,
        })
    }

    const mainStyle = {
        width: toCSS(
            width === undefined && useFixedLayout ? 'auto' : width,
        ),
        height: toCSS(
            height === undefined && useFixedLayout ? 'auto' : height,
        ),
    }

    const toolbarHeader =
        toolbarPlacement === 'header' || !toolbarPlacement ? toolbar : null
    const toolbarBody = toolbarPlacement === 'body' && toolbar

    return (
        <div className={mainClassName} ref={root} style={mainStyle}>
            <div className={prefixed('editor-frame-main')}>
                <div className={prefixed('editor-frame-head')}>
                    {header}
                    {toolbarHeader}
                </div>
                <div className={FRAMESET_BODY_CLASSNAME}>
                    {toolbarBody}
                    <div className={prefixed('editor-frame-body-scroll')}>
                        {body}
                    </div>
                </div>
                <div className={prefixed('editor-frame-footer')} />
            </div>
        </div>
    )
}
