import { QueryDocumentSnapshot } from "@angular/fire/firestore";

/**
 * Check if the value is an enum key
 * @param value
 * @param myEnum
 * @returns {boolean}
 */
export function isEnumKey(value: any, myEnum: any): boolean {
  if (value === null || value === undefined) {
    return false;
  }
  for (const enumKey in myEnum) {
    if (myEnum.hasOwnProperty(enumKey) && myEnum[enumKey] === value) {
      return true;
    }
  }
  return false;
}

/**
 * Converts the Firestore data to the model class
 * @param firestoreData
 * @param modelClass
 * @returns
 */
export function convertFirestoreData<T>(firestoreData: any, modelClass: new () => T): T {
  const defaultModel = new modelClass();

  // Merge Firestore data with the default model object to ensure all keys are present
  const mergedData = { ...defaultModel, ...firestoreData };

  // Create a new instance of the model class using the merged data
  const model = new modelClass();

  // Assign the merged data to the model instance
  Object.assign(model, mergedData);

  return model;
}

/**
 * Converts the Firestore data array to the model class array
 * @param firestoreDataArray
 * @param modelClass
 * @returns
 */
export function convertFirestoreDataArray<T>(firestoreDataArray: any[], modelClass: new () => T): T[] {
  if (firestoreDataArray?.length === 0) {
    return [];
  }
  return firestoreDataArray.map(firestoreData => convertFirestoreData(firestoreData, modelClass));
}

/**
 * Converts the custom typed object to normal object data
 * @param obj
 * @returns
 */
export function convertObjectToFirestoreData<T>(obj: T): any {
  const newObj = JSON.parse(JSON.stringify(obj));
  if ('id' in newObj) {
    delete newObj['id'];
  }
  return newObj;
}

/**
 * Combines the array data with the id
 * @param data
 * @returns
 */
export function combineArrayDataWithId(data: QueryDocumentSnapshot[]): any[] {
  if (!data?.length) {
    return [];
  }
  return data.map(resp => ({ ...resp.data(), id: resp.id }));
}

/**
 * Finds the index of the value in the enum
 * @param enumType
 * @param value
 * @returns
 */
export function findIndexByValue(value: any, enumType: any): number | undefined {
  const keys = Object.keys(enumType);
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    if (enumType[key] === value) {
      return index;
    }
  }
  return undefined;
}
/**
 * Gets the value from enum by index
 * @param enumType
 * @param index
 * @returns
 */
export function getValueByIndex(enumType: any, index: number): any | undefined {
  const keys = Object.keys(enumType);
  const values = Object.values(enumType);

  if (index >= 0 && index < keys.length) {
    return values[index];
  }

  return undefined;
}
