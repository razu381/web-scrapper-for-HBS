const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const formData = {
    reason: "General interest",
    lastName: "shohidul islam",
    firstName: "Razu",
    country: "Bangladesh",
    region: "South Asia",
    institution: "Noakhali college",
    topic: "Emerging Markets",
    email: "sirazu52@gmail.com"
};

const logFile = path.join(__dirname, 'download_log.txt');

const logMessage = (message) => {
    const logEntry = `${new Date().toISOString()} - ${message}\n`;
    fs.appendFileSync(logFile, logEntry);
    console.log(message);
};

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        logMessage('Navigating to the main page');
        await page.goto('https://www.hbs.edu/creating-emerging-markets/interviews/Pages/default.aspx?HBSGeographicArea=South%20Asia');

        logMessage('Extracting the first link for "Download Transcript (pdf)"');
        const link = await page.evaluate(() => {
            const anchor = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes("Download Transcript (pdf)"));
            return anchor ? anchor.href : null;
        });

        if (link) {
            const pdfPage = await browser.newPage();
            try {
                logMessage(`Processing link: ${link}`);
                await pdfPage.goto(link);

                logMessage('Filling the form');
                await pdfPage.waitForSelector('input[type="checkbox"][value="' + formData.reason + '"]');
                await pdfPage.type('input[name="3. Last Name"]', formData.lastName);
                await pdfPage.type('input[name="4. First Name"]', formData.firstName);
                await pdfPage.type('input[name="5. Country of Residence"]', formData.country);
                await pdfPage.select('select[name="6. Region"]', formData.region);
                await pdfPage.type('input[name="7. Institution"]', formData.institution);
                await pdfPage.type('input[name="8. Research Topic"]', formData.topic);
                await pdfPage.type('input[name="9. Email"]', formData.email);

                logMessage('Submitting the form');
                await Promise.all([
                    pdfPage.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 }), // Wait for navigation after form submission
                    pdfPage.evaluate(() => {
                        document.querySelector('form').submit(); // Submit the form directly
                    })
                ]);
                logMessage('Form submitted');

                // Now on the thank you page, wait for the PDF download link
                await pdfPage.waitForSelector('a.btn.btn-right.pdf');
                const pdfUrl = await pdfPage.evaluate(() => {
                    const link = document.querySelector('a.btn.btn-right.pdf');
                    return link ? link.href : null;
                });

                if (pdfUrl) {
                    logMessage(`Downloading PDF from: ${pdfUrl}`);
                    const pdfBuffer = await pdfPage.goto(pdfUrl).then(res => res.buffer());

                    const pdfName = path.basename(pdfUrl);
                    fs.writeFileSync(path.join(__dirname, pdfName), pdfBuffer);

                    logMessage(`Successfully downloaded PDF from link: ${pdfUrl}`);
                } else {
                    logMessage('No PDF link found on Thank You page');
                }

            } catch (error) {
                logMessage(`Error processing link ${link}: ${error.message}`);
                console.error(error);
            } finally {
                await pdfPage.close();
            }
        } else {
            logMessage('No "Download Transcript (pdf)" link found');
        }

    } catch (error) {
        logMessage(`Error navigating to the main page or extracting links: ${error.message}`);
        console.error(error);
    } finally {
        await browser.close();
        logMessage('Browser closed');
    }
})();
