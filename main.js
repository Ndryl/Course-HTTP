const {crawlPage} = require('./crawl.js')
const {printReport} = require('./report.js')
async function main() {
    if (process.argv.length < 3) {
        console.log("No website provided");
        process.exit(1);
    }
    if (process.argv.length > 3) {
        console.log("Too many arguments");
        process.exit(1);
    }

    const website = process.argv[2];
    console.log(`Starting crawler for ${website}`);

  
        const pages = await crawlPage(website, website, {}); // Passando o mesmo URL como base e atual

        printReport(pages);
    
}

main();