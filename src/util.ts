import {v1 as uuid} from 'uuid'

export const PREFIX = 'pw'

export { uuid }

type PrefixOptions = {
    format: 'cssVar' | 'data' | 'selector'
}
export const prefixed = (s:string, options?:PrefixOptions) => {
    const withPrefix = `${PREFIX}-${s}`
    switch ((options || {}).format) {
        case 'cssVar': {
            return `--${withPrefix}`
        }
        case 'data': {
            return `data-${withPrefix}`
        }
        case 'selector': {
            return `.${withPrefix}`
        }
    }
    return withPrefix
}
