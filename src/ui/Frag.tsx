import * as React from "react"

import "./czi-frag.css"

class Frag extends React.Component<any, any> {
    render() {
        return <div className="czi-frag">{this.props.children}</div>
    }
}

export default Frag
