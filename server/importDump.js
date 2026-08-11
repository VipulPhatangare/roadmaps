const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function importData() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/roadmap_ai';
  console.log('[Import] Connecting to MongoDB:', mongoUri);
  await mongoose.connect(mongoUri);

  const dumpPath = path.join(__dirname, 'dump.json');
  if (!fs.existsSync(dumpPath)) {
    console.error('[Import] Error: dump.json file not found at', dumpPath);
    process.exit(1);
  }

  console.log('[Import] Reading dump.json...');
  const dump = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));

  for (const collectionName of Object.keys(dump)) {
    const docs = dump[collectionName];
    if (docs.length > 0) {
      const col = mongoose.connection.db.collection(collectionName);
      await col.deleteMany({});
      await col.insertMany(docs);
      console.log(`[Import] Successfully imported ${docs.length} documents into collection '${collectionName}'`);
    }
  }

  console.log('[Import] ✅ Database import completed successfully!');
  process.exit(0);
}

importData().catch((err) => {
  console.error('[Import] Failed:', err);
  process.exit(1);
});
