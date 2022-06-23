module.exports = {
  mongo_dsn: process.env.MONGO_DSN || 'mongodb://localhost:27017/moviesdb',
  port: process.env.PORT || 3000,
  jwt_secret: process.env.JWT_SECRET || 'NOT_A_SECRET!',
};
