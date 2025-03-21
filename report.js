function printReport(pages) {
    console.log('=========');
    console.log('Report');
    console.log('=========');
    const sortedPages = sortPages(pages);
    for (const [url, hits] of sortedPages) {
        console.log(`Found ${hits} links to ${url}`);
    }
    console.log('=========');
    console.log('End report');
    console.log('=========');
}

function sortPages(pages) {
    const pagesArray = Object.entries(pages);
    pagesArray.sort((a, b) => {
        const aHits = a[1];
        const bHits = b[1];
        return bHits - aHits; // Ordem decrescente
    });
    return pagesArray;
}

module.exports = { sortPages, printReport };
