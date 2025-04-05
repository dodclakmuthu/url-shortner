require('dotenv').config();

const { getUrl, incrementClickCount } = require('../models/urlModel');


module.exports.redirect = async (event) => {
    try {
        console.log('event:', event);
        const shortenedId = event.pathParameters.shortId;
        const urlData = await getUrl(shortenedId);

        if (!urlData) {
            return { statusCode: 404, body: JSON.stringify({ error: "URL not found" }) };
        }

        // Increment click count (optional)
        await incrementClickCount(shortenedId);

        return {
            statusCode: 302, // Temporary redirect
            headers: { Location: urlData.originalUrl },
        };
    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: JSON.stringify({ error: "Internal Server Error" }) };
    }
};
