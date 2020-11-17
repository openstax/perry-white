import React, { useState, useMemo, useRef } from 'react'
import { Editor } from '../../src/index'
import convertFromHTML from '../../src/convertFromHTML'
import convertToHTML from '../../src/convertToHTML'
import CustomRuntime from './CustomRuntime'

const EditorDemo = ({ defaultValue }) => {
    const [editorView, setEditorView] = useState()

    const runtime = useMemo(() => new CustomRuntime())
    const htmlRef = useRef()
    const defaultEditorState = useMemo(() => convertFromHTML(defaultValue, null, null));
    const setContent = (d) => {
        const html = convertToHTML(editorView.state)
        console.log(html)
        htmlRef.current.innerHTML = html
        htmlRef.current
               .querySelectorAll('img[src^="/resour"]')
               .forEach(i => i.src = `https://archive.cnx.org${new URL(i.src).pathname}`)
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

            <div ref={htmlRef} />

        </div>
    )
}

export default EditorDemo
