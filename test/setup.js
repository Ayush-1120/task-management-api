const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

beforeAll(async () => {
  const mongoServer = new MongoMemoryServer();
//   const mongoUri = await mongoServer.getUri();

  await mongoose.connect('mongodb://localhost:27017/taskmanagement', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
