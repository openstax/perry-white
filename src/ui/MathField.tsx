import * as React from 'react'
// @ts-ignore
import * as Mathlive from 'mathlive'


interface BaseProps {
    onChange?: (latex: string) => void
    className?: string
    /**
     * The raw options of mathlive's makeMathField.
     * */
    mathfieldConfig?: Mathlive.MathfieldConfig

    /**
     * The mathfield object returned by makeMathField.
     */
    mathfieldRef?: (mathfield: Mathlive.Mathfield) => void
}

interface ControlledProps extends BaseProps {
    latex: string
    initialLatex?: undefined
}

interface UncontrolledProps extends BaseProps {
    latex?: undefined
    initialLatex: string
}

export type Props = ControlledProps | UncontrolledProps

export function combineConfig(props: Props): Mathlive.MathfieldConfig {
    const combinedConfiguration: Mathlive.MathfieldConfig = {
        ...props.mathfieldConfig,
    }

    const { onChange } = props

    if (onChange) {
        if (props.mathfieldConfig && props.mathfieldConfig.onContentDidChange) {
            const fromConfig = props.mathfieldConfig.onContentDidChange
            combinedConfiguration.onContentDidChange = (mf: Mathlive.Mathfield) => {
                onChange(mf.getValue())
                fromConfig(mf)
            }
        } else {
            combinedConfiguration.onContentDidChange = (mf: Mathlive.Mathfield) =>
                onChange(mf.getValue())
        }
    }

    return combinedConfiguration
}

/** A react-control that hosts a mathlive-mathfield in it. */
export class Mathfield extends React.Component<Props> {
    private insertElement: HTMLElement | null = null
    private readonly combinedConfiguration = combineConfig(this.props)
    private mathfield: Mathlive.Mathfield | undefined

    componentDidUpdate(prevProps: Props) {
        if (!this.mathfield) {
            throw new Error('Component was not correctly initialized.')
        }
        if (prevProps.latex !== undefined) {
            if (this.props.latex !== prevProps.latex) {
                if (!this.props.latex) {
                    this.mathfield.setValue('')
                } else {
                    this.mathfield.setValue(this.props.latex, {
                        suppressChangeNotifications: true,
                    })
                }
            }
        }
    }

    render() {
        return <div className={this.props.className} ref={(instance) => (this.insertElement = instance)} />
    }

    componentDidMount() {
        if (!this.insertElement) {
            throw new Error(
                'React did apparently not mount the insert point correctly.'
            )
        }

        const initialValue = this.props.initialLatex ?? this.props.latex

        this.mathfield = Mathlive.makeMathField(
            this.insertElement,
            this.combinedConfiguration
        )
        this.mathfield.setValue(initialValue, {
            suppressChangeNotifications: true,
        })

        if (this.props.mathfieldRef) {
            this.props.mathfieldRef(this.mathfield)
        }
    }
}
