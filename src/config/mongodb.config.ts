const MongodbConfig = () => ({
  mongoProfile: {
    host: process.env.MONGO_HOST || "localhost",
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
    port: process.env.MONGO_PORT || 27017,
  },
});

export default MongodbConfig;
