import * as React from 'react'
import {prefixed} from '../util'

// https://loading.io/css/
class LoadingIndicator extends React.Component<any, any> {
    render() {
        return (
            <div className={prefixed('loading-indicator')}>
                <div className={prefixed('loading-indicator-frag-1 frag')} />
                <div className={prefixed('loading-indicator-frag-2 frag')} />
                <div className={prefixed('loading-indicator-frag-3 frag')} />
                <div className={prefixed('loading-indicator-frag-4 frag')} />
            </div>
        )
    }
}

export default LoadingIndicator
