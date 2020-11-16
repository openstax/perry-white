import * as React from 'react'
import {prefixed} from '../util'

class Frag extends React.Component<any, any> {
    render() {
        return <div className={prefixed('frag')}>{this.props.children}</div>
    }
}

export default Frag
