export default function lookUpElement(
    el: Element | Node | null | undefined,
    predict: (el: Element | Node) => boolean,
): Element | Node | null | undefined {
    while (el && el.nodeName) {
        if (predict(el)) {
            return el
        }
        el = el.parentElement
    }
    return null
}
