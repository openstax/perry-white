import * as React from 'react'
import ReactDOM from 'react-dom'

import Editor from './editor'
import CustomRuntime from './CustomRuntime'

function main() {
    const el = document.createElement('div')
    el.id = 'pm-plus-r-demo-app'
    el.style.setProperty('margin', 'auto')
    el.style.setProperty('width', '90vw')
    el.style.setProperty('height', '80vh')
    const { body } = document
    body && body.appendChild(el)
    const docJSON = { 'type': 'doc', 'attrs': { 'layout': null, 'padding': null, 'width': null }, 'content': [{ 'type': 'paragraph', 'attrs': { 'align': null, 'color': null, 'id': null, 'indent': null, 'lineSpacing': null, 'paddingBottom': null, 'paddingTop': null }, 'content': [{ 'type': 'text', 'marks': [{ 'type': 'mark-font-type', 'attrs': { 'name': 'Arial Black' } }], 'text': 'First line Arial black' }] }, { 'type': 'ordered_list', 'attrs': { 'id': null, 'counterReset': null, 'indent': 0, 'following': null, 'listStyleType': null, 'name': null, 'start': 1 }, 'content': [{ 'type': 'list_item', 'attrs': { 'align': null }, 'content': [{ 'type': 'paragraph', 'attrs': { 'align': null, 'color': null, 'id': null, 'indent': null, 'lineSpacing': null, 'paddingBottom': null, 'paddingTop': null }, 'content': [{ 'type': 'text', 'text': 'List 1' }] }] }] }, { 'type': 'ordered_list', 'attrs': { 'id': null, 'counterReset': null, 'indent': 1, 'following': null, 'listStyleType': null, 'name': null, 'start': 1 }, 'content': [{ 'type': 'list_item', 'attrs': { 'align': null }, 'content': [{ 'type': 'paragraph', 'attrs': { 'align': null, 'color': null, 'id': null, 'indent': null, 'lineSpacing': null, 'paddingBottom': null, 'paddingTop': null }, 'content': [{ 'type': 'text', 'text': 'Child' }] }] }] }, { 'type': 'ordered_list', 'attrs': { 'id': null, 'counterReset': 'none', 'indent': 0, 'following': null, 'listStyleType': null, 'name': null, 'start': 1 }, 'content': [{ 'type': 'list_item', 'attrs': { 'align': null }, 'content': [{ 'type': 'paragraph', 'attrs': { 'align': null, 'color': null, 'id': null, 'indent': null, 'lineSpacing': null, 'paddingBottom': null, 'paddingTop': null }, 'content': [{ 'type': 'text', 'text': 'List 2' }] }] }] }, { 'type': 'paragraph', 'attrs': { 'align': 'center', 'color': null, 'id': null, 'indent': null, 'lineSpacing': null, 'paddingBottom': null, 'paddingTop': null }, 'content': [{ 'type': 'text', 'text': 'Align' }] }, { 'type': 'paragraph', 'attrs': { 'align': null, 'color': null, 'id': null, 'indent': null, 'lineSpacing': null, 'paddingBottom': null, 'paddingTop': null }, 'content': [{ 'type': 'text', 'marks': [{ 'type': 'mark-text-color', 'attrs': { 'color': '#f20d96' } }], 'text': 'Font' }, { 'type': 'text', 'text': ' ' }, { 'type': 'text', 'marks': [{ 'type': 'mark-text-highlight', 'attrs': { 'highlightColor': '#e5e5e5' } }], 'text': 'Color ' }, { 'type': 'text', 'marks': [{ 'type': 'strong' }], 'text': 'align ' }, { 'type': 'text', 'marks': [{ 'type': 'link', 'attrs': { 'href': 'http://www.google.com', 'rel': 'noopener noreferrer nofollow', 'target': 'blank', 'title': null } }, { 'type': 'em' }], 'text': 'Link to google' }, { 'type': 'text', 'marks': [{ 'type': 'em' }], 'text': ' ' }, { 'type': 'text', 'marks': [{ 'type': 'underline' }], 'text': 'underline ' }, { 'type': 'text', 'marks': [{ 'type': 'em' }, { 'type': 'strong' }, { 'type': 'mark-text-color', 'attrs': { 'color': '#e5e5e5' } }, { 'type': 'mark-text-highlight', 'attrs': { 'highlightColor': '#979797' } }, { 'type': 'underline' }], 'text': 'combined' }] }, { 'type': 'heading', 'attrs': { 'align': null, 'color': null, 'id': null, 'indent': null, 'lineSpacing': null, 'paddingBottom': null, 'paddingTop': null, 'level': 1 }, 'content': [{ 'type': 'text', 'text': 'Header 1' }] }, { 'type': 'paragraph', 'attrs': { 'align': null, 'color': null, 'id': null, 'indent': null, 'lineSpacing': null, 'paddingBottom': null, 'paddingTop': null } }, { 'type': 'table', 'attrs': { 'marginLeft': null }, 'content': [{ 'type': 'table_row', 'content': [{ 'type': 'table_cell', 'attrs': { 'colspan': 1, 'rowspan': 1, 'colwidth': null, 'borderColor': null, 'background': null }, 'content': [{ 'type': 'paragraph', 'attrs': { 'align': null, 'color': null, 'id': null, 'indent': null, 'lineSpacing': null, 'paddingBottom': null, 'paddingTop': null }, 'content': [{ 'type': 'text', 'marks': [{ 'type': 'strong' }], 'text': 'Cell 1' }] }] }, { 'type': 'table_cell', 'attrs': { 'colspan': 1, 'rowspan': 1, 'colwidth': null, 'borderColor': null, 'background': null }, 'content': [{ 'type': 'paragraph', 'attrs': { 'align': null, 'color': null, 'id': null, 'indent': null, 'lineSpacing': null, 'paddingBottom': null, 'paddingTop': null }, 'content': [{ 'type': 'text', 'text': 'Cell 2' }] }] }] }] }, { 'type': 'paragraph', 'attrs': { 'align': null, 'color': null, 'id': null, 'indent': null, 'lineSpacing': null, 'paddingBottom': null, 'paddingTop': null } }, { 'type': 'paragraph', 'attrs': { 'align': null, 'color': null, 'id': null, 'indent': null, 'lineSpacing': null, 'paddingBottom': null, 'paddingTop': null }, 'content': [{ 'type': 'text', 'text': 'Subscript ' }, { 'type': 'text', 'marks': [{ 'type': 'super' }], 'text': '2 ' }] }] }

    const docHTML = `<p><span style="font-family: Arial Black">First line Arial black</span></p><ol data-indent="0" style="--czi-counter-name: czi-counter-0;--czi-counter-reset: 0;--czi-list-style-type: decimal" type="decimal"><li><p>List 1</p></li></ol><ol data-indent="1" style="--czi-counter-name: czi-counter-1;--czi-counter-reset: 0;--czi-list-style-type: lower-alpha" type="lower-alpha"><li><p>Child</p></li></ol><ol data-indent="0" data-counter-reset="none" style="--czi-counter-name: czi-counter-0;--czi-counter-reset: 0;--czi-list-style-type: decimal" type="decimal"><li><p>List 2</p></li></ol><p style="text-align: center;">Align</p><p><span style="color: #f20d96;">Font</span> <span style="background-color: #e5e5e5;">Color </span><strong>align </strong><a href="http://www.google.com" rel="noopener noreferrer nofollow" target="blank"><em>Link to google</em></a><em> </em><u>underline </u><em><strong><span style="color: #e5e5e5;"><span style="background-color: #979797;"><u>combined</u></span></span></strong></em></p><h1>Header 1</h1><p><img align="center" alt="" src="https://nathan.stitt.org/images/hippo.png" alt="a hippo portrait" title="a hippo"></p><p></p><table><tr><td><p><strong>Cell 1</strong></p></td><td><p>Cell 2</p></td></tr></table><p></p><p>Subscript <sup>2 </sup>

          <img src="https://s3-us-west-2.amazonaws.com/openstax-assets/Ss2Xg59OLfjbgarp-prodtutor/exercises/attachments/large_aeb10979cb1265ae1f928677f271c8e4f0f6154a26723b80e40ca3db913579d3.png" alt="The x-axis is temperature in Celsius degrees, ranging from 0 to 70 degrees in increments of 10 degrees.  The y-axis is rate of reaction and is not numbered.  The curve begins at 0 degrees, where the rate of the reaction is close to zero.  The curve proceeds upwards with a sharp slope until peaking at about 38 degrees, where an indicator line is labeled “optimal temperature.”  The curve is relatively flat for another ten degrees and then drops precipitously  from 50 to 60 degrees, hitting zero again at about 61 degrees." />

How many <span data-math="\\text{km/h}"></span> are equal to <span data-math="1.0\\,\\text{m/s}">1.0\\,\\text{m/s}</span>? Hint: Carry out the explicit steps involved in the conversion.

The speed limit on some interstate highways is roughly <span data-math="100,\\text{km/h}\">100\\,\\text{km/h}</span>. How many miles per hour is this if <span data-math=\"1.0\\,\\text{mile}\">1.0\\,\\text{mile}</span> is about <span data-math="1.609,\\text{km}">1.609,\text{km}</span>?

</p>`

    // Use this (set to null) if need a empty editor.
    // docJSON = null;
    // [FS] IRAD-982 2020-06-10
    // Use the licit component for demo.

    // To pass runtime to handle the upload image from angular App
    // null means it will take licit EditorRuntime
    const runTime = new CustomRuntime()

    // To pass prosemirror plugins to editor pass it to plugins property which accept array of plugin object.
    // null means no custom plugins to pass
    // the plugin object must contain a method getEffectiveSchema() which accept schema and returns schema.
    const plugins = null
    ReactDOM.render(<Editor defaultValue={docHTML} />, el)
}

function onChangeCB(data) {
    console.log('data: ' + JSON.stringify(data))
}

function onReadyCB(ref) {
    console.log('ref: ' + ref)
}


window.onload = main
