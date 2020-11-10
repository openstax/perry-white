import * as React from "react"

import PopUpManager from "./PopUpManager"
import {atAnchorBottomLeft, atViewportCenter} from "./PopUpPosition"
import uuid from "./uuid"

import {PopUpDetails} from "./PopUpManager"
import {Rect} from "./rects"

type PositionHandler = (
    anchorRect: Rect | null | undefined,
    bodyRect: Rect | null | undefined,
) => Rect

export type ViewProps = Object

export type PopUpParams = {
    anchor?: any
    autoDismiss?: boolean | null | undefined
    container?: Element | null | undefined
    modal?: boolean | null | undefined
    onClose?: (val: any) => void | null | undefined
    position?: PositionHandler | null | undefined
}

export type PopUpProps = {
    View: Function
    close: (val: any) => void
    popUpParams: PopUpParams
    viewProps: Object
}

export type PopUpHandle = {
    close: (val: any) => void
    update: (props: Object) => void
}

class PopUp extends React.Component<any, any> {
    props: PopUpProps

    _bridge = null
    _id = uuid()

    render() {
        const dummy = {}
        const {View, viewProps, close} = this.props
        return (
            <div data-pop-up-id={this._id} id={this._id}>
                <View {...(viewProps || dummy)} close={close} />
            </div>
        )
    }

    componentDidMount(): void {
        this._bridge = {getDetails: this._getDetails}
        PopUpManager.register(this._bridge)
    }

    componentWillUnmount(): void {
        this._bridge && PopUpManager.unregister(this._bridge)
    }

    _getDetails = (): PopUpDetails => {
        const {close, popUpParams} = this.props
        const {anchor, autoDismiss, position, modal} = popUpParams
        return {
            anchor,
            autoDismiss: autoDismiss === false ? false : true,
            body: document.getElementById(this._id),
            close,
            modal: modal === true,
            position:
                position || (modal ? atViewportCenter : atAnchorBottomLeft),
        }
    }
}

export default PopUp
