const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE = process.env.DYNAMODB_TABLE_USERS;

async function getUserByEmail(email) {
  const params = {
    TableName: USERS_TABLE,
    IndexName: "EmailIndex",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
  };
  const result = await docClient.query(params).promise();
  return result.Item;
}

async function createUser(user) {
  const params = {
    TableName: USERS_TABLE,
    Item: user,
  };
  await docClient.put(params).promise();
}

module.exports = {
  getUserByEmail,
  createUser,
};
