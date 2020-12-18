const HTTP_PREFIX = /^http(s?):*\/\//i

export function sanitizeURL(url: string | null | undefined): string {
    if (!url) {
        return url
    }
    if (HTTP_PREFIX.test(url)) {
        return url
    }
    return 'http://' + url
}

const YOUTUBE = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)(.*)/;

function getYouTubeId(url:string):string|null {
    const match = url.match(YOUTUBE);
    return (match && match[2].length) ? match[2] : null;
}

export function convertToEmbedURL(url: string): string {
    const youTubeId = getYouTubeId(url)
    if (youTubeId) {
        return `https://www.youtube.com/embed/${youTubeId}`;
    }
    return sanitizeURL(url)
}
