const {JSDOM} = require('jsdom');
function getURLsFromHTML(htmlBody, baseURL){
    const urls = [];
    const dom = new JSDOM(htmlBody);
    const links = dom.window.document.querySelectorAll('a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if(href){
            const url = new URL(href, baseURL);
            urls.push(url.href);
        }
    });
    return urls
}

function normalizeURL(urlString){
    const urlObj = new URL(urlString);   
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
    if(hostPath.length > 0 && hostPath.slice(-1) === '/'){
        return hostPath.slice(0, -1);
    }
    return hostPath;
}

module.exports = {normalizeURL, getURLsFromHTML};