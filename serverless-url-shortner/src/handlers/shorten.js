module.exports.shorten = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Serverless URL Shortener API is working!",
    }),
  };
};
