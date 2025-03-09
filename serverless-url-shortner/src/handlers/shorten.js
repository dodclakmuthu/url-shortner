require('dotenv').config();
const AWS = require('aws-sdk');
const crypto = require('crypto');
const docClient = new AWS.DynamoDB.DocumentClient();

async function insertUrl(shortenedId, originalUrl) {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            id: shortenedId,
            originalUrl: originalUrl,
            createdAt: new Date().toISOString(),  // Timestamp
            clickCount: 0,  // Initially set to 0
            expiresAt: null,  // Optionally set an expiration time
        },
    };

    try {
        await docClient.put(params).promise();
        console.log('Item inserted successfully');
    } catch (error) {
        console.error('Error inserting item:', error);
    }
}

async function generateUniqueShortId() {
    let id;
    let exists = true;

    while (exists) {
        id = crypto.randomBytes(3).toString('hex');
        const params = {
            TableName: process.env.DYNAMODB_TABLE,
            Key: { id }
        };

        const result = await docClient.get(params).promise();
        exists = result.Item ? true : false;
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
