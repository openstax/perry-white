import "./czi-custom-button.css"
import PointerSurface from "./PointerSurface"
import * as React from "react"
import TooltipSurface from "./TooltipSurface"
import cx from "classnames"
import {PointerSurfaceProps} from "./PointerSurface"

interface Props extends PointerSurfaceProps{
    icon?: React.ReactNode | null
    label?: React.ReactNode | null
    target?: string
}

class CustomButton extends React.Component<Props, any> {

    render() {
        const {icon, label, className, title, ...pointerProps} = this.props
        const klass = cx(className, "czi-custom-button", {
            "use-icon": !!icon,
        })
        return (
            <TooltipSurface tooltip={title}>
                <PointerSurface {...pointerProps} className={klass}>
                    {icon}
                    {label}
                </PointerSurface>
            </TooltipSurface>
        )
    }
}

export default CustomButton
