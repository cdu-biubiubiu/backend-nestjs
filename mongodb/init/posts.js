db.posts.deleteMany({});

for (let i = 0; i < 100; i += 1) {
  db.posts.insertOne({
    title: `article #${i}`,
    creationDate: new Date(),
    modifiedDate: new Date(),
    content:
      'Ullamco culpa eu aute culpa id et veniam excepteur.Nisi voluptate ad culpa mollit officia pariatur aute et quis quis veniam cillum et. Pariatur consectetur laboris Lorem eu exercitation consectetur fugiat Lorem veniam. Velit non elit non proident ipsum dolor. Et sint adipisicing nostrud aute. Aliquip aliqua laborum exercitation enim cillum tempor adipisicing sit velit non. Reprehenderit et ex ad dolore qui elit.',
  });
}
