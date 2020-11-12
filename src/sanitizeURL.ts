const HTTP_PREFIX = /^http(s?):*\/\//i

export default function sanitizeURL(url: string | null | undefined): string {
    if (!url) {
        return 'http://'
    }
    if (HTTP_PREFIX.test(url)) {
        return url
    }
    return 'http://' + url
}