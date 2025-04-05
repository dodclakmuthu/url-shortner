const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.DYNAMODB_TABLE_SHORTEN_URL;

async function insertUrl(shortenedId, originalUrl) {
    const params = {
        TableName,
        Item: {
            id: shortenedId,
            originalUrl: originalUrl,
            createdAt: new Date().toISOString(),
            clickCount: 0,
            clickedByDate: {},
            expiresAt: null,
        },
    };

    try {
        await docClient.put(params).promise();
        return { success: true }; // ✅ Return success response
    } catch (error) {
        console.error("Error inserting item:", error);
        throw new Error("Database insert failed"); // ✅ Throw an error to be caught
    }
}

async function getUrl(shortenedId) {
    const params = {
        TableName,
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
            TableName: TableName,
            Key: { id: shortenedId },
            UpdateExpression: "SET clickedByDate = if_not_exists(clickedByDate, :emptyMap)",
            ExpressionAttributeValues: {
                ":emptyMap": {} // Initialize if it doesn't exist
            }
        }).promise();

        // Step 2: Increment click count and update today's date count
        await docClient.update({
            TableName: TableName,
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
        throw new Error("Database update failed"); 
    }
}

module.exports = {
    insertUrl,
    getUrl,
    incrementClickCount,
};