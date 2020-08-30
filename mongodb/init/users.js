db.users.deleteMany({});

db.users.insertOne({
  username: 'hanhanhan',
  password: 'hanhanhan',
  score: 'superAdministrator',
});

db.users.insertMany([
  {
    username: 'xiaoming',
    password: 'woshixiaoming',
    score: 'administrator',
  },
  {
    username: 'lihua',
    password: 'woshilihua',
    score: 'administrator',
  },
  {
    username: 'xianyue',
    password: 'yueyueyue',
    score: 'articlePublisher',
  },
]);
