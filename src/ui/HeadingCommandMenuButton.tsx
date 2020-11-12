import CommandMenuButton from './CommandMenuButton'
import HeadingCommand from '../HeadingCommand'
import CustomStyleCommand from '../CustomStyleCommand'
import { UICommands} from './UICommand'
import * as React from 'react'
import {findActiveHeading} from './findActiveHeading'
import findActiveCustomStyle from './findActiveCustomStyle'
import {EditorState} from 'prosemirror-state'
import {EditorView} from 'prosemirror-view'
import {HEADING_NAMES} from '../HeadingNodeSpec'
import {HEADING_NAME_DEFAULT} from './findActiveHeading'
import {Transaction} from 'prosemirror-state'


const HEADING_COMMANDS: UICommands = {
    [HEADING_NAME_DEFAULT]: new HeadingCommand(0),
}

HEADING_NAMES.forEach(obj => {
    if (obj.level) {
        HEADING_COMMANDS[obj.name] = new HeadingCommand(obj.level)
    } else {
        HEADING_COMMANDS[obj.name] = new CustomStyleCommand(
            obj.customstyles,
            obj.name,
        )
    }
})

const COMMAND_GROUPS = [HEADING_COMMANDS]

interface Props {
    dispatch: (tr: Transaction) => void
    editorState: EditorState
    editorView: EditorView | null | undefined
}

class HeadingCommandMenuButton extends React.Component<Props, any> {


    findHeadingName(level) {
        for (let i = 0; i < HEADING_NAMES.length; i++) {
            if (HEADING_NAMES[i].level == level) {
                return HEADING_NAMES[i].name
            }
        }
        return undefined
    }

    render() {
        const {dispatch, editorState, editorView} = this.props
        let customStyleName
        const headingLevel = findActiveHeading(editorState)
        if (0 < headingLevel) {
            customStyleName = this.findHeadingName(headingLevel)
        } else {
            customStyleName = findActiveCustomStyle(editorState)
        }

        return (
            <CommandMenuButton
                className="width-100" // [FS] IRAD-1008 2020-07-16
                // Disable font type menu on editor disable state
                commandGroups={COMMAND_GROUPS}
                disabled={editorView && editorView.editable ? false : true}
                dispatch={dispatch}
                editorState={editorState}
                editorView={editorView}
                label={customStyleName}
            />
        )
    }
}

export default HeadingCommandMenuButton
