import {Schema} from "prosemirror-model"
import {Node} from "prosemirror-model"
import {EditorState, Transaction} from "prosemirror-state"
import {CellSelection, mergeCells} from "prosemirror-tables"
import {EditorView} from "prosemirror-view"

import {PARAGRAPH, TABLE_CELL, TEXT} from "./NodeNames"
import UICommand from "./ui/UICommand"

function isBlankParagraphNode(node: Node | null | undefined): boolean {
    if (!node) {
        return false
    }
    if (node.type.name !== PARAGRAPH) {
        return false
    }
    const {firstChild, lastChild} = node
    if (!firstChild) {
        return true
    }
    if (firstChild !== lastChild) {
        return false
    }
    return firstChild.type.name === TEXT && firstChild.text === " "
}

function purgeConsecutiveBlankParagraphNodes(
    tr: Transaction,
    schema: Schema,
): Transaction {
    const paragraph = schema.nodes[PARAGRAPH]
    const cell = schema.nodes[TABLE_CELL]
    if (!paragraph || !cell) {
        return tr
    }
    // @ts-ignore
    const {doc, selection} = tr
    // @ts-ignore
    if (!selection instanceof CellSelection) {
        return tr
    }
    const {from, to} = selection
    const paragraphPoses = []
    doc.nodesBetween(from, to, (node, pos, parentNode) => {
        if (node.type === paragraph && parentNode.type === cell) {
            if (isBlankParagraphNode(node)) {
                const $pos = tr.doc.resolve(pos)
                if (isBlankParagraphNode($pos.nodeBefore)) {
                    paragraphPoses.push(pos)
                }
            }
            return false
        } else {
            return true
        }
    })
    paragraphPoses.reverse().forEach(pos => {
        const cell = tr.doc.nodeAt(pos)
        tr = tr.delete(pos, pos + cell.nodeSize)
    })
    return tr
}

class TableMergeCellsCommand extends UICommand {
    execute = (
        state: EditorState,
        dispatch: (tr: Transaction) => void | null | undefined,
        view: EditorView | null | undefined,
    ): boolean => {
        const {tr, schema, selection} = state
        let endTr = tr
        if (selection instanceof CellSelection) {
            mergeCells(
                state,
                nextTr => {
                    endTr = nextTr
                },
                // @ts-ignore
                view,
            )
            // Also merge onsecutive blank paragraphs into one.
            // @ts-ignore
            endTr = purgeConsecutiveBlankParagraphNodes(endTr, schema)
        }
        const changed = endTr.docChanged || endTr !== tr
        changed && dispatch && dispatch(endTr)
        return changed
    }
}

export default TableMergeCellsCommand
