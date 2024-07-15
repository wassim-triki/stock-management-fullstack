db = db.getSiblingDB('admin');

print('Current users:');
printjson(db.getUsers());

if (db.getUser(process.env.MONGO_INITDB_ROOT_USERNAME) === null) {
  db.createUser({
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
    roles: [{ role: 'root', db: 'admin' }],
  });
  print(`User ${process.env.MONGO_INITDB_ROOT_USERNAME} created.`);
} else {
  db.changeUserPassword(
    process.env.MONGO_INITDB_ROOT_USERNAME,
    process.env.MONGO_INITDB_ROOT_PASSWORD
  );
  print(`Password for ${process.env.MONGO_INITDB_ROOT_USERNAME} updated.`);
}
