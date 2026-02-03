const { db } = require('./src/firestore');
async function listUsers() {
  const snapshot = await db.collection('users').get();
  snapshot.forEach(doc => {
    console.log(doc.id, doc.data());
  });
}
listUsers();
