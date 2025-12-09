import { openDB } from 'idb';

const DB_NAME = 'VakioBokyEbooks';
const DB_VERSION = 1;
const STORE_NAME = 'ebooks';

const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};

export const saveEbook = async (ebook) => {
  const db = await initDB();
  await db.put(STORE_NAME, ebook);
};

export const getEbook = async (id) => {
  const db = await initDB();
  return await db.get(STORE_NAME, id);
};

export const getAllEbooks = async () => {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
};

export const deleteEbook = async (id) => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};