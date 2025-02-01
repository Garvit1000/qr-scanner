import { collection, addDoc, query, where, getDocs, orderBy, limit as limitQuery } from 'firebase/firestore';
import { db } from './firebase';
import validUIDs from '../data/validUIDs.json';

const COLLECTION_NAME = 'scans';

// Create a Set from validUIDs for O(1) lookup
const validUIDsSet = new Set(validUIDs.uids);

class QRService {
  async checkIfScanned(uid) {
    try {
      const scansRef = collection(db, COLLECTION_NAME);
      const q = query(scansRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking scan:', error);
      throw error;
    }
  }

  async addScan(scanData) {
    try {
      const scansRef = collection(db, COLLECTION_NAME);
      await addDoc(scansRef, {
        uid: scanData.uid,
        timestamp: new Date().toISOString(),
        isValid: scanData.isValid
      });
      return true;
    } catch (error) {
      console.error('Error adding scan:', error);
      throw error;
    }
  }

  validateUID(uid) {
    try {
      // O(1) lookup using Set instead of array includes
      return validUIDsSet.has(uid);
    } catch (error) {
      console.error('Error validating UID:', error);
      throw error;
    }
  }

  async getRecentScans(maxResults = 20) {
    try {
      const scansRef = collection(db, COLLECTION_NAME);
      const q = query(scansRef, orderBy('timestamp', 'desc'), limitQuery(maxResults));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching recent scans:', error);
      throw error;
    }
  }
}

export default new QRService();
