// lib/faceapi-cache.js
import * as faceapi from "face-api.js";
import { openDB } from "idb";

const DB_NAME = "faceapi-models";
const STORE_NAME = "models";

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

// Save file to IndexedDB
export async function saveModelToIDB(modelName, buffer) {
  const db = await getDB();
  await db.put(STORE_NAME, buffer, modelName);
  console.log(`💾 Saved ${modelName} to IndexedDB`);
}

// Load file from IndexedDB
export async function loadModelFromIDB(modelName) {
  const db = await getDB();
  const result = await db.get(STORE_NAME, modelName);
  if (result) {
    console.log(`⚡ Loaded ${modelName} from IndexedDB`);
    return result;
  }
  return null;
}

// Fetch model file and cache if not exists
export async function fetchAndCacheModel(url, modelName) {
  const cached = await loadModelFromIDB(modelName);
  if (cached) return new Uint8Array(cached);

  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  await saveModelToIDB(modelName, buffer);
  return new Uint8Array(buffer);
}

// Load face-api model with IndexedDB caching
export async function loadFaceAPIModels(baseUrl = "/models/tiny_face_detector") {
  // Example tinyFaceDetector
  const weight = await fetchAndCacheModel(`${baseUrl}/tiny_face_detector_model-shard1`, "tiny_face_detector");
//   const manifest = await fetch(`${baseUrl}/tiny_face_detector_model-weights_manifest.json`).then(r => r.json());

//   await faceapi.nets.tinyFaceDetector.loadFromBinary(weight, manifest);
  console.log("✅ tinyFaceDetector loaded from cache/URL", weight);
return weight
  // Same pattern for other models (faceLandmark68Net, faceRecognitionNet etc.)
}
