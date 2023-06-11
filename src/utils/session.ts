import aes from 'crypto-js/aes';
import encUTF8 from 'crypto-js/enc-utf8';
import defer from 'lodash/defer';

const LOCAL_STORAGE = window.localStorage;
const SESSION_STORAGE = window.sessionStorage;
let tobeLocalSavedJson: Record<string, any> = {};
let tobeSessionSavedJson: Record<string, any> = {};

class SessionManager {
  put(key: string, value: any, isPersist = false) {
    if (!value) {
      this.remove(key);
      return;
    }
    if (isPersist) {
      tobeLocalSavedJson[key] = value;
    } else {
      tobeSessionSavedJson[key] = value;
    }
    defer(() => this.saveStorage());
  }

  get(key: string) {
    const cacheValue = tobeSessionSavedJson[key] || tobeLocalSavedJson[key];
    if (!cacheValue) {
      const value = SESSION_STORAGE.getItem(key) || LOCAL_STORAGE.getItem(key);
      return value ? JSON.parse(aes.decrypt(value, key).toString(encUTF8)) : null;
    }
    return cacheValue;
  }

  remove(key: string) {
    delete tobeSessionSavedJson[key];
    delete tobeLocalSavedJson[key];

    try {
      SESSION_STORAGE.removeItem(key);
      LOCAL_STORAGE.removeItem(key);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`localStorage access denied!`);
    }
  }
  clear(isPersist: boolean) {
    tobeLocalSavedJson = {};
    tobeSessionSavedJson = {};
    try {
      SESSION_STORAGE.clear();
    } catch (f) {
      // eslint-disable-next-line no-console
      console.error('localStorage access denied');
    }
    if (isPersist) {
      try {
        LOCAL_STORAGE.clear();
      } catch (f) {
        // eslint-disable-next-line no-console
        console.error('session Storage access denied');
      }
    }
  }

  saveStorage() {
    this.saveToStorage(tobeLocalSavedJson, LOCAL_STORAGE);
    this.saveToStorage(tobeSessionSavedJson, SESSION_STORAGE);
  }

  saveToStorage(jsonMap: Record<string, any>, storage: Storage) {
    Object.keys(jsonMap).forEach((key) => {
      const value = jsonMap[key];
      const encryptValue = aes.encrypt(JSON.stringify(value), key).toString();
      try {
        storage.setItem(key, encryptValue);
      } catch (e) {
        console.error(`localStorage access denied!`);
      }
    });
  }
}

export default new SessionManager();
