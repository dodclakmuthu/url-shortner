require('dotenv').config();
const AWS = require('aws-sdk');
const crypto = require('crypto');

const { insertUrl, getUrl } = require('../models/urlModel');


async function generateUniqueShortId() {
    let id;
    let exists = true;

    while (exists) {
        id = crypto.randomBytes(3).toString('hex');
        const result = await getUrl(id);
        exists = result ? true : false;
    }

    return id;
}

module.exports.shorten = async (event) => {
    try {
        const { originalUrl } = JSON.parse(event.body);
        if (!originalUrl) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing originalUrl" }),
            };
        }

        console.log(event.requestContext)

        const shortenedId = await generateUniqueShortId();
        await insertUrl(shortenedId, originalUrl);

        return {
            statusCode: 200,
            body: JSON.stringify({
                status: "success",
                shortUrl: `https://${event.requestContext.domainName}/${shortenedId}`,
            }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};
