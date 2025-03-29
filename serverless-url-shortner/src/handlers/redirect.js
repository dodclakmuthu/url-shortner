require('dotenv').config();
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function getUrl(shortenedId) {
    console.log('shortenedId:', shortenedId);
    const params = {
        TableName: process.env.DYNAMODB_TABLE_SHORTEN_URL,
        Key: { id: shortenedId },
    };

    const result = await docClient.get(params).promise();
    return result.Item;
}

async function incrementClickCount(shortenedId) {
    const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD

    try {
        // Step 1: Ensure `clickedByDate` exists
        await docClient.update({
            TableName: process.env.DYNAMODB_TABLE_SHORTEN_URL,
            Key: { id: shortenedId },
            UpdateExpression: "SET clickedByDate = if_not_exists(clickedByDate, :emptyMap)",
            ExpressionAttributeValues: {
                ":emptyMap": {} // Initialize if it doesn't exist
            }
        }).promise();

        // Step 2: Increment click count and update today's date count
        await docClient.update({
            TableName: process.env.DYNAMODB_TABLE_SHORTEN_URL,
            Key: { id: shortenedId },
            UpdateExpression: "SET clickCount = if_not_exists(clickCount, :zero) + :inc, clickedByDate.#date = if_not_exists(clickedByDate.#date, :zero) + :inc",
            ExpressionAttributeNames: {
                "#date": today
            },
            ExpressionAttributeValues: {
                ":inc": 1,
                ":zero": 0
            }
        }).promise();

        console.log(`Click count updated for ${shortenedId} on ${today}`);
    } catch (error) {
        console.error("Error updating click count:", error);
    }
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
