db.users.deleteMany({});

db.users.insertOne({
  username: "hanhanhan",
  password: "$2b$10$XJhwbqRoAseYVheaiEFtEegG77d3PUXMn1GCtqq.r8oGoUqHwNi5W",
  score: "superAdmin",
});

db.users.insertMany([
  {
    username: "xiaoming",
    password: "$2b$10$4kWj75icEysb857zwQSeXO2MU7JvhsjmB96DA/yTDimWAzh3LdSmO",
    score: "admin",
  },
  {
    username: "lihua",
    password: "$2b$10$KP6ZVzR3okjnCura3aFxKetG9SWZp9qgSEuQW4zyp6UIYX.sVsr.u",
    score: "user",
  },
  {
    username: "xiaoyue",
    password: "$2b$10$WYiKDd1uUMkIBozJhnMSme9ZIMT4R0NfJD4I8H5Bx0tPyKhf7c6be",
    score: "user",
  },
]);
