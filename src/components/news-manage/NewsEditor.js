import React, { useState, useEffect } from 'react'
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NewsEditor(props) {
    useEffect(() => {
        const html = props.content
        if (html === undefined) return
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState)
        }
    }, [props.content])
    const [editorState, setEditorState] = useState("")
    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="aaaaa"
                wrapperClassName="bbbbb"
                editorClassName="ccccc"
                onEditorStateChange={(editorState) => setEditorState(editorState)}

                // 失去焦点的时候调用保存数据
                onBlur={() => {
                    // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
            />
        </div>
    )
}
