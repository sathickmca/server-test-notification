module.exports = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/',
  dbName: process.env.MONGODB_DB || 'test',
  collectionName: 'servertest',
};
