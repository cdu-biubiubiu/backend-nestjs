db.links.deleteMany({});

let links = [
  {
    name: "Baidu",
    src: "www.baidu.com",
  },
  {
    name: "Tencent",
    src: "www.qq.com",
  },
  {
    name: "Zhihu",
    src: "www.zhihu.com",
  },
  {
    name: "netflix",
    src: "www.netflix.com",
  },
];

db.links.insertMany(links);
