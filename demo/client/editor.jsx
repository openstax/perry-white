import React, { useState, useMemo } from 'react'
import { Editor } from '../../src/index'
import convertFromHTML from '../../src/convertFromHTML'
import convertToHTML from '../../src/convertToHTML'


const EditorDemo = ({ defaultValue }) => {
    const [editorView, setEditorView] = useState()
    const [htmlContent, setHTMLContent] = useState('')
    const defaultEditorState = useMemo(() => convertFromHTML(defaultValue, null, null));
    const setContent = (d) => setHTMLContent(convertToHTML(editorView.state))

    return (
        <div style={{ height: '100%' }}>

            <Editor
                defaultEditorState={defaultEditorState}
                fitToContent
                height="100%"
                onReady={setEditorView}
                width="100%"
            />

            <hr />

            <div>
                <button onClick={setContent}>Export as HTML</button>
                <button onClick={() => setHTMLContent('')}>Clear</button>
            </div>

            <hr />

            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />

        </div>
    )
}

export default EditorDemo
