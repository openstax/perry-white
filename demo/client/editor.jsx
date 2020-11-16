import React, { useState, useMemo } from 'react'
import { Editor } from '../../src/index'
import convertFromHTML from '../../src/convertFromHTML'
import convertToHTML from '../../src/convertToHTML'
import CustomRuntime from './CustomRuntime'

const EditorDemo = ({ defaultValue }) => {
    const [editorView, setEditorView] = useState()
    const [htmlContent, setHTMLContent] = useState('')
    const runtime = useMemo(() => new CustomRuntime())
    const defaultEditorState = useMemo(() => convertFromHTML(defaultValue, null, null));
    const setContent = (d) => {
        const html = convertToHTML(editorView.state)
        console.log(html)
        setHTMLContent(html)
    }

    return (
        <div style={{ height: '100%' }}>

            <Editor
                defaultEditorState={defaultEditorState}
                fitToContent
                runtime={runtime}
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
