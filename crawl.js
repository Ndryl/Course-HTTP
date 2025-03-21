const {JSDOM} = require('jsdom');


async function crawlPage(currentURL) {
    if (!currentURL) {
        console.error(`Invalid URL provided: ${currentURL}`);
        return;
    }

    console.log(`Actively crawling: ${currentURL}`);

    try {
        const resp = await fetch(currentURL);

        if (!resp.ok) {
            console.error(`Error crawling ${currentURL}: HTTP status ${resp.status}`);
            return;
        }

        const contentType = resp.headers.get('content-type');
        if (!contentType || !contentType.includes('text/html')) {
            console.error(`Error crawling ${currentURL}: Unsupported content type ${contentType}`);
            return;
        }

        const htmlBody = await resp.text();
        console.log(htmlBody);
    } catch (error) {
        console.error(`Error crawling ${currentURL}: ${error.message}`);
    }
}


function getURLsFromHTML(htmlBody, baseURL) {
    const urls = [];
    const dom = new JSDOM(htmlBody);
    const links = dom.window.document.querySelectorAll('a');

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return; // Ignora links sem href

        try {
            if (href.startsWith('/')) {
                // URL relativa: resolve com baseURL
                urls.push(new URL(href, baseURL).href);
            } else {
                // URL absoluta: tenta criar objeto URL para validar
                urls.push(new URL(href).href);
            }
        } catch (error) {
            // Ignora URLs inválidas
            console.error(`URL inválida ignorada: ${href}`);
        }
    });

    return urls;
}

function normalizeURL(urlString) {
    const urlObj = new URL(urlString);
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
    return hostPath.endsWith('/') ? hostPath.slice(0, -1) : hostPath;
}


module.exports = {normalizeURL, getURLsFromHTML, crawlPage};