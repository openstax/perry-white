import CustomButton from './CustomButton'
import * as React from 'react'

class CustomMenuItemSeparator extends React.Component<any, any> {
    render() {
        return <div className="czi-custom-menu-item-separator" />
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
        return <CustomButton {...this.props} className="czi-custom-menu-item" />
    }
}

export default CustomMenuItem
