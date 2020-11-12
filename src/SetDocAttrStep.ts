import {Node} from 'prosemirror-model'
import {Step, StepResult, Mappable} from 'prosemirror-transform'

type SetDocAttrStepJSONValue = {
    key: string
    stepType: string
    value: any
}

// https://discuss.prosemirror.net/t/changing-doc-attrs/784/17
class SetDocAttrStep extends Step {
    key: string
    stepType: string
    value: any

    constructor(key: string, value: any, stepType: string = 'SetDocAttr') {
        super()
        this.stepType = stepType
        this.key = key
        this.value = value
    }
    // @ts-ignore
    apply(doc: Node): void {
        // @ts-ignore
        this.prevValue = doc.attrs[this.key]
        const attrs = {
            ...doc.attrs,
            [this.key]: this.value,
        }
        const docNew = doc.type.create(attrs, doc.content, doc.marks)
        // @ts-ignore
        return StepResult.ok(docNew)
    }

    // @ts-ignore
    invert(): SetDocAttrStep {
        // @ts-ignore
        return new SetDocAttrStep(this.key, this.prevValue, 'revertSetDocAttr')
    }

    // [FS] IRAD-1010 2020-07-27
    // Handle map properly so that undo works correctly for document attritube changes.
    // @ts-ignore
    map(mapping: Mappable): SetDocAttrStep | null | undefined {
        // @ts-ignore
        const from = mapping.mapResult(this.from, 1)
        // @ts-ignore
        const to = mapping.mapResult(this.to, -1)
        if (from.deleted && to.deleted) {
            return null
        }
        return new SetDocAttrStep(this.key, this.value, 'SetDocAttr')
    }

    // @ts-ignore
    merge(other: SetDocAttrStep): SetDocAttrStep | null | undefined {
        if (
            other instanceof SetDocAttrStep &&
                // @ts-ignore
                other.mark.eq(this.mark) &&
                // @ts-ignore
                this.from <= other.to &&
                // @ts-ignore
                this.to >= other.from
        ) {
            return new SetDocAttrStep(this.key, this.value, 'SetDocAttr')
        }
        return undefined
    }

    toJSON(): SetDocAttrStepJSONValue {
        return {
            stepType: this.stepType,
            key: this.key,
            value: this.value,
        }
    }

    static fromJSON(schema: any, json: SetDocAttrStepJSONValue) {
        return new SetDocAttrStep(json.key, json.value, json.stepType)
    }
}

// [FS-AFQ][13-MAR-2020][IRAD-899]
// Register this step so that capcomode can be dealt collaboratively.
// @ts-ignore
Step.jsonID('SetDocAttr', SetDocAttrStep)

export default SetDocAttrStep
