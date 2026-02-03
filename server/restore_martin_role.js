const { db } = require('./src/firestore');
async function setRole(role) {
  const uid = 'v9tticCb4Wc5HCjghQWFWw84LI63';
  await db.collection('users').doc(uid).update({ role });
  console.log('Updated role to ' + role + ' for ' + uid);
}
setRole('manager');
