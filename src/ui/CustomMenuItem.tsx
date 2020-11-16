import CustomButton from './CustomButton'
import * as React from 'react'

import {prefixed} from '../util'

class CustomMenuItemSeparator extends React.Component<any, any> {
    render() {
        return <div className={prefixed('custom-menu-item-separator')} />
    }
}

class CustomMenuItem extends React.Component<any, any> {
    static Separator = CustomMenuItemSeparator

    props: {
        label: string
        disabled?: boolean | null | undefined
        onClick: (
            value: any,
            e: React.SyntheticEvent,
        ) => void | null | undefined
        onMouseEnter: (
            value: any,
            e: React.SyntheticEvent,
        ) => void | null | undefined
        value: any
        active?: boolean
    }

    render() {
        return <CustomButton {...this.props} className={prefixed('custom-menu-item')} />
    }
}

export default CustomMenuItem
