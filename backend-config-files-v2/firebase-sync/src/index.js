const { MongoClient } = require('mongodb');
const admin = require('firebase-admin');
require('dotenv').config();

// Firebase 초기화
const serviceAccount = require('/app/service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firestore = admin.firestore();

// MongoDB 연결 설정
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:27017';
const DATABASE_NAME = process.env.MONGODB_DATABASE || 'health_research';

// health_research 데이터베이스 컬렉션 매핑
const HEALTH_RESEARCH_COLLECTIONS = {
  'study': 'studies',
  'subject': 'subjects',
  'taskSpec': 'taskSpecs',
  'taskResult': 'taskResults',
  'investigator': 'investigators',
  'participationRequirement': 'participationRequirements',
  'educationalContent': 'educationalContents',
  'inLabVisit': 'inLabVisits',
  'dashboard': 'dashboards',
  'chart': 'charts',
  'studyDataFolder': 'studyDataFolders',
  'studyDataFile': 'studyDataFiles',
  'studyDataInfo': 'studyDataInfos',
  'subjectInfo': 'subjectInfos',
  'subjectStudyRelation': 'subjectStudyRelations',
  'investigatorStudyRelation': 'investigatorStudyRelations'
};

// 시스템 컬렉션 (동기화 제외)
const SYSTEM_COLLECTIONS = ['_schema', 'system.'];

// MongoDB Document를 Firestore용으로 변환
function convertToFirestoreData(doc) {
  const data = { ...doc };
  
  // _id를 문자열로 변환
  if (data._id) {
    data.id = data._id.toString();
    delete data._id;
  }
  
  // ObjectId 필드들을 문자열로 변환
  for (const key of Object.keys(data)) {
    if (data[key] && typeof data[key] === 'object') {
      if (data[key]._bsontype === 'ObjectId' || data[key].constructor?.name === 'ObjectId') {
        data[key] = data[key].toString();
      } else if (data[key] instanceof Date) {
        data[key] = admin.firestore.Timestamp.fromDate(data[key]);
      } else if (Array.isArray(data[key])) {
        data[key] = data[key].map(item => {
          if (item && typeof item === 'object' && (item._bsontype === 'ObjectId' || item.constructor?.name === 'ObjectId')) {
            return item.toString();
          }
          return item;
        });
      } else if (!Array.isArray(data[key])) {
        data[key] = convertToFirestoreData(data[key]);
      }
    }
  }
  
  return data;
}

// Firestore 컬렉션 경로 결정
function getFirestorePath(dbName, collectionName) {
  if (dbName === DATABASE_NAME) {
    return HEALTH_RESEARCH_COLLECTIONS[collectionName] || null;
  } else if (dbName.startsWith('study_')) {
    const studyId = dbName.replace('study_', '');
    if (SYSTEM_COLLECTIONS.some(sys => collectionName.startsWith(sys))) {
      return null;
    }
    return { type: 'healthData', studyId: studyId, collection: collectionName };
  }
  return null;
}

// Firestore에 문서 저장
async function syncToFirestore(dbName, collection, documentId, data, operationType) {
  const firestorePath = getFirestorePath(dbName, collection);
  if (!firestorePath) return;

  try {
    let docRef, logPath;
    
    if (typeof firestorePath === 'string') {
      docRef = firestore.collection(firestorePath).doc(documentId);
      logPath = `${firestorePath}/${documentId}`;
    } else {
      // study_* 데이터베이스: studies/{studyId}/healthData/{dataType}/records/{docId}
      docRef = firestore
        .collection('studies').doc(firestorePath.studyId)
        .collection('healthData').doc(firestorePath.collection)
        .collection('records').doc(documentId);
      logPath = `studies/${firestorePath.studyId}/healthData/${firestorePath.collection}/records/${documentId}`;
    }
    
    if (operationType === 'delete') {
      await docRef.delete();
      console.log(`[DELETE] ${logPath}`);
    } else {
      const firestoreData = convertToFirestoreData(data);
      await docRef.set(firestoreData, { merge: true });
      console.log(`[SYNC] ${logPath}`);
    }
  } catch (error) {
    console.error(`[ERROR] Failed to sync ${dbName}.${collection}/${documentId}:`, error.message);
  }
}

// 특정 데이터베이스의 기존 데이터 동기화
async function initialSyncDatabase(client, dbName, collections) {
  console.log(`\n--- Syncing database: ${dbName} ---`);
  const db = client.db(dbName);
  
  for (const collectionName of collections) {
    try {
      const collection = db.collection(collectionName);
      const documents = await collection.find({}).toArray();
      
      if (documents.length > 0) {
        console.log(`[INIT] Syncing ${documents.length} documents from '${dbName}.${collectionName}'...`);
        for (const doc of documents) {
          const documentId = doc._id.toString();
          await syncToFirestore(dbName, collectionName, documentId, doc, 'insert');
        }
      }
      console.log(`[INIT] Completed '${dbName}.${collectionName}'`);
    } catch (error) {
      // 컬렉션이 없으면 무시
    }
  }
}

// 기존 데이터 초기 동기화 (모든 관련 데이터베이스)
async function initialSync(client) {
  console.log('\n========== Starting Initial Sync ==========\n');
  
  // 1. health_research 데이터베이스 동기화
  await initialSyncDatabase(client, DATABASE_NAME, Object.keys(HEALTH_RESEARCH_COLLECTIONS));
  
  // 2. study_* 데이터베이스들 찾아서 동기화
  const adminDb = client.db('admin');
  const dbList = await adminDb.command({ listDatabases: 1 });
  
  for (const dbInfo of dbList.databases) {
    if (dbInfo.name.startsWith('study_')) {
      const studyDb = client.db(dbInfo.name);
      const collections = await studyDb.listCollections().toArray();
      const collectionNames = collections
        .map(c => c.name)
        .filter(name => !SYSTEM_COLLECTIONS.some(sys => name.startsWith(sys)));
      
      await initialSyncDatabase(client, dbInfo.name, collectionNames);
    }
  }
  
  console.log('\n========== Initial Sync Completed ==========\n');
}

// Change Streams로 전체 클러스터 실시간 동기화
async function watchAllChanges(client) {
  console.log('\n========== Watching for Changes (All Databases) ==========\n');
  
  const changeStream = client.watch([], { fullDocument: 'updateLookup' });
  
  changeStream.on('change', async (change) => {
    const dbName = change.ns.db;
    const collection = change.ns.coll;
    
    // health_research 또는 study_* 데이터베이스만 처리
    if (dbName !== DATABASE_NAME && !dbName.startsWith('study_')) return;
    
    // 시스템 컬렉션 무시
    if (SYSTEM_COLLECTIONS.some(sys => collection.startsWith(sys))) return;
    
    // health_research의 경우 매핑된 컬렉션만 처리
    if (dbName === DATABASE_NAME && !HEALTH_RESEARCH_COLLECTIONS[collection]) return;
    
    const documentId = change.documentKey._id.toString();
    
    switch (change.operationType) {
      case 'insert':
        console.log(`\n[CHANGE] INSERT in '${dbName}.${collection}'`);
        await syncToFirestore(dbName, collection, documentId, change.fullDocument, 'insert');
        break;
      case 'update':
      case 'replace':
        console.log(`\n[CHANGE] UPDATE in '${dbName}.${collection}'`);
        if (change.fullDocument) {
          await syncToFirestore(dbName, collection, documentId, change.fullDocument, 'update');
        }
        break;
      case 'delete':
        console.log(`\n[CHANGE] DELETE in '${dbName}.${collection}'`);
        await syncToFirestore(dbName, collection, documentId, null, 'delete');
        break;
    }
  });
  
  changeStream.on('error', (error) => {
    console.error('[ERROR] Change stream error:', error);
  });
  
  console.log('Listening for MongoDB changes on ALL databases...\n');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForReplicaSet(client, maxRetries = 30) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const adminDb = client.db('admin');
      const status = await adminDb.command({ replSetGetStatus: 1 });
      const primary = status.members?.find(m => m.stateStr === 'PRIMARY');
      if (primary) {
        console.log('[OK] Replica Set is ready (PRIMARY found)\n');
        return true;
      }
      console.log(`[WAIT] Replica Set initializing... (attempt ${i + 1}/${maxRetries})`);
    } catch (error) {
      console.log(`[WAIT] Waiting for Replica Set... (attempt ${i + 1}/${maxRetries})`);
    }
    await sleep(2000);
  }
  throw new Error('Replica Set failed to initialize');
}

async function main() {
  console.log('==========================================');
  console.log('  MongoDB -> Firestore Sync Service');
  console.log('  (All Databases Mode)');
  console.log('==========================================\n');
  
  console.log(`MongoDB URI: ${MONGODB_URI.replace(/:[^:@]+@/, ':****@')}`);
  console.log(`Main Database: ${DATABASE_NAME}`);
  console.log(`Also watching: study_* databases (health data)\n`);
  
  try {
    const client = new MongoClient(MONGODB_URI, {
      directConnection: true,
      serverSelectionTimeoutMS: 5000
    });
    
    await client.connect();
    console.log('[OK] Connected to MongoDB\n');
    
    await waitForReplicaSet(client);
    
    if (process.env.INITIAL_SYNC !== 'false') {
      await initialSync(client);
    }
    
    await watchAllChanges(client);
    
    process.on('SIGINT', async () => {
      console.log('\nShutting down...');
      await client.close();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('[FATAL] Failed to start sync service:', error);
    process.exit(1);
  }
}

main();
