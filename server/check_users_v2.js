const { db } = require('./src/firestore');
async function listUsers() {
  try {
    console.log('Fetching users...');
    const snapshot = await db.collection('users').get();
    console.log('Snapshot size:', snapshot.size);
    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }
    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
    });
  } catch (err) {
    console.error('Error getting documents', err);
  }
}
listUsers();
