import canUseCSSFont from './canUseCSSFont'
import * as katex from 'katex'

const latexEl: any = document.createElement('div')
const cached: Object = {}

export default function renderLaTeXAsHTML(
    latex: string | null | undefined,
): string {
    if (cached.hasOwnProperty(latex)) {
        return cached[latex]
    }

    const latexText = latex || ''
    latexEl.innerHTML = ''
    if (!latexText) {
        return latexText
    }
    try {
        katex.render(latex, latexEl)
    } catch (ex) {
        latexEl.innerHTML = ''
        latexEl.appendChild(document.createTextNode(latexText))
    }
    const html = latexEl.innerHTML
    latexEl.innerHTML = ''
    cached[latex] = html

    return html
}
