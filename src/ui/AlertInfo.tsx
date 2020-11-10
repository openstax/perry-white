import * as React from "react"
import { ImageLike } from '../Types';

import "./czi-form.css"

interface Props {
    initialValue: any
    // eslint-disable-line no-unused-vars
    close: (href?: ImageLike | null) => void // eslint-disable-line no-undef
}

class AlertInfo extends React.Component<Props, any> {
    _unmounted = false

    // [FS] IRAD-1005 2020-07-07
    // Upgrade outdated packages.
    // To take care of the property type declaration.
    // static propsTypes = {
    //     initialValue: PropTypes.object,
    //     close: function(props: any, propName: string) {
    //         const fn = props[propName]
    //         if (
    //             !fn.prototype ||
    //             (typeof fn.prototype.constructor !== "function" &&
    //              fn.prototype.constructor.length !== 1)
    //         ) {
    //             return new Error(
    //                 propName +
    //                 "must be a function with 1 arg of type ImageLike",
    //             )
    //         }
    //         return undefined
    //     },
    // }

    state = {
        ...(this.props.initialValue || {}),
        validValue: null,
    }

    componentWillUnmount(): void {
        this._unmounted = true
    }

    render() {
        return (
            <div className="alert">
                <span className="closebtn" onClick={this._cancel}>
            &times;
                </span>
                <strong>Document Error!</strong> Unable to load the document.
                <span> Have issues in Json format, please verify...</span>
                {/* <fieldset>
                    <legend>The Json Format for the document is not correct</legend>
                    <legend>Unable to load the content in Editor</legend>
                    <legend>Please check the Json format</legend>
                    </fieldset> */}
                {/* <div className="czi-form-buttons">
                    <CustomButton label="Cancel" onClick={this._cancel} />
                    </div> */}
            </div>
        )
    }

    _cancel = (): void => {
        this.props.close()
    }
}

export default AlertInfo
