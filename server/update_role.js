const { db } = require('./src/firestore');
async function setRole(role) {
  const snapshot = await db.collection('users').get();
  if (snapshot.empty) return;
  const uid = snapshot.docs[0].id; // Just grab the first user
  await db.collection('users').doc(uid).update({ role });
  console.log('Updated role to ' + role + ' for ' + uid);
}
setRole('employee');
