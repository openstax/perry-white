import * as React from 'react'

import {prefixed} from '../util'

class CustomMenu extends React.Component<any, any> {
    render() {
        const {children} = this.props
        return (
            <div className={prefixed('custom-scrollbar custom-menu')}>
                {children}
            </div>
        )
    }
}

export default CustomMenu
