let dbIndexedDB: IDBDatabase | null = null;

export async function openDB(): Promise<IDBDatabase> {
  if (dbIndexedDB) return dbIndexedDB;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open("MyAppDatabase", 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbIndexedDB = request.result;
      resolve(dbIndexedDB);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create customers object store
      if (!db.objectStoreNames.contains("customers")) {
        const customersStore = db.createObjectStore("customers", {
          keyPath: "cust_id",
        });
        customersStore.createIndex("cust_name", "cust_name", { unique: false });
        customersStore.createIndex("cust_phone", "cust_phone", {
          unique: false,
        });
      }

      // Create products object store
      if (!db.objectStoreNames.contains("products")) {
        const productsStore = db.createObjectStore("products", {
          keyPath: "prod_id",
        });
        productsStore.createIndex("prod_name", "prod_name", { unique: false });
      }

      // Create bills object store
      if (!db.objectStoreNames.contains("bills")) {
        const billsStore = db.createObjectStore("bills", {
          keyPath: "bill_id",
        });
        billsStore.createIndex("cust_id", "cust_id", { unique: false });
        billsStore.createIndex("bill_date", "bill_date", { unique: false });
      }

      // Create transactions object store
      if (!db.objectStoreNames.contains("transactions")) {
        const transactionsStore = db.createObjectStore("transactions", {
          keyPath: "tran_id",
        });
        transactionsStore.createIndex("tran_date", "tran_date", {
          unique: false,
        });
      }
    };
  });
}

// Helper function to ensure database is open before performing operations
export async function withDB<T>(
  callback: (db: IDBDatabase) => Promise<T>
): Promise<T> {
  const database = await openDB();
  return callback(database);
}

// Example functions for CRUD operations

export async function addItem<T>(
  storeName: string,
  item: T
): Promise<IDBValidKey> {
  return withDB(async (db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.add(item);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  });
}

export async function getItem<T>(
  storeName: string,
  key: IDBValidKey
): Promise<T | undefined> {
  return withDB(async (db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || undefined);
    });
  });
}

export async function getAllItems<T>(storeName: string): Promise<T[]> {
  return withDB(async (db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  });
}

export async function updateItem<T>(
  storeName: string,
  item: T
): Promise<IDBValidKey> {
  return withDB(async (db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.put(item);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  });
}

export async function deleteItem(
  storeName: string,
  key: IDBValidKey
): Promise<void> {
  return withDB(async (db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  });
}