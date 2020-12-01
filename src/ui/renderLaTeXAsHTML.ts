import * as MathLive from 'mathlive'

export default function renderLaTeXAsHTML(
    latex: string | null | undefined,
): string {
    return MathLive.convertLatexToMarkup(latex)
}
