const { db } = require('../src/firestore');

async function setManager() {
    const uid = 'v9tticCb4Wc5HCjghQWFWw84LI63';
    console.log(`Setting role for user ${uid}...`);

    await db.collection('users').doc(uid).set({
        email: 'martin.omander@cloudadvocacyorg.joonix.net',
        role: 'manager'
    }, { merge: true });

    console.log('User role updated to manager');
}

setManager().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
});
