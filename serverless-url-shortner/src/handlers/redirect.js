require('dotenv').config();
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function getUrl(shortenedId) {
    console.log('shortenedId:', shortenedId);
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: { id: shortenedId },
    };

    const result = await docClient.get(params).promise();
    return result.Item;
}

async function incrementClickCount(shortenedId) {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: { id: shortenedId },
        UpdateExpression: "SET clickCount = if_not_exists(clickCount, :zero) + :inc",
        ExpressionAttributeValues: { ":zero": 0, ":inc": 1 },
    };

    await docClient.update(params).promise();
}

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
