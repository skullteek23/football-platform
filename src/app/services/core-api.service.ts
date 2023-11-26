import { Injectable, inject } from '@angular/core';
import { Firestore, QueryFieldFilterConstraint, WhereFilterOp, addDoc, collection, collectionData, collectionSnapshots, deleteDoc, doc, docData, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { getFirestoreErrorMsg } from '@app/utils/api-error-handling-utility';;
import { combineArrayDataWithId, convertObjectToFirestoreData } from '@ballzo-ui/core';
import { Observable, catchError, map, of, take, throwError } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CoreApiService {
  private firestore: Firestore = inject(Firestore);

  constructor(
    private cloudFn: Functions
  ) { }

  /**
   * Returns the reference of a collection
   * @param collectionName
   * @returns
   */
  private getCollectionRef(collectionName: string) {
    return collection(this.firestore, collectionName);
  }

  /**
   * Returns the reference of a document
   * @param collectionName
   * @param documentId
   * @returns
   */
  private getDocumentRef(collectionName: string, documentId: string) {
    return doc(this.firestore, collectionName, documentId);
  }

  /**
   * Returns the metadata of a collection along with data
   * @param collectionName
   * @returns
   */
  private observeCollectionMetadata(collectionName: string): Observable<any> {
    return collectionSnapshots(this.getCollectionRef(collectionName));
  }

  /**
   * Returns the data of a collection
   * @param collectionName
   * @returns
   */
  private observeCollection(collectionName: string): Observable<any> {
    return collectionData(this.getCollectionRef(collectionName));
  }

  /**
   * Returns the data of a document
   * @param collectionName
   * @param documentId
   * @returns
   */
  private observeDocument(collectionName: string, documentId: string, options = {}): Observable<any> {
    return docData(this.getDocumentRef(collectionName, documentId), options);
  }

  /**
   * Calls HTTP cloud function on the firebase backend
   * @param {string} functionName
   * @param {any} data
   * @returns {Promise<any>}
   */
  callHttpFunction(functionName: string, data: any = {}): Promise<any> {
    if (data !== null && data !== undefined) {
      const callable = httpsCallable(this.cloudFn, functionName);
      return callable(data);
    }
    return Promise.reject('Data is null or undefined');
  }

  /**
   * watches a collection and returns the data/metadata with real-time updates
   * @param {string} collectionName
   * @param {string} includeMetadata
   * @returns {Observable<any>}
   */
  watchCollection(collectionName: string, includeMetadata: boolean = false): Observable<any> {
    if (includeMetadata) {
      return this.observeCollectionMetadata(collectionName)
        .pipe(
          catchError(err => this.handleApiError(err))
        );;
    }
    return this.observeCollection(collectionName)
      .pipe(
        catchError(err => this.handleApiError(err))
      );;
  }


  /**
   * Gets a collection and returns the data/metadata once
   * @param {string} collectionName
   * @param {string} includeMetadata
   * @returns {Observable<any>}
  */
  getCollection(collectionName: string, includeMetadata: boolean = false): Observable<any> {
    if (includeMetadata) {
      return this.observeCollectionMetadata(collectionName).pipe(
        take(1),
        catchError(err => this.handleApiError(err))
      );
    }
    return this.observeCollection(collectionName).pipe(
      take(1),
      catchError(err => this.handleApiError(err))
    );
  }

  /**
   * Gets a collection and returns the data/metadata once
   * @param {string} collectionName
   * @param {string} includeMetadata
   * @returns {Observable<any>}
  */
  getCollectionWithIds(collectionName: string): Observable<any> {
    return this.getCollection(collectionName, true)
      .pipe(
        map(resp => combineArrayDataWithId(resp)),
        catchError(err => this.handleApiError(err))
      );
  }

  /**
   * watches a document and returns the data with real-time updates
   * @param {string} collectionName
   * @param {string} documentId
   * @returns {Observable<any>}
   */
  watchDocument(collectionName: string, documentId: string, options = {}): Observable<any> {
    return this.observeDocument(collectionName, documentId, options)
      .pipe(
        catchError(err => this.handleApiError(err))
      );
  }

  /**
   * Get a document and returns the data with real-time updates
   * @param {string} collectionName
   * @param {string} documentId
   * @returns {Observable<any>}
  */
  getDocument(collectionName: string, documentId: string, options = {}): Observable<any> {
    return this.observeDocument(collectionName, documentId, options).pipe(
      take(1),
      catchError(err => this.handleApiError(err))
    );
  }

  /**
   * Writes a document to a collection
   * @param collectionName
   * @param documentId
   * @param data
   * @returns
  */
  addDocument(collectionName: string, addData: any, documentId?: string): Promise<any> {
    const data = convertObjectToFirestoreData(addData);
    if (documentId) {
      return setDoc(doc(this.firestore, `${collectionName}/${documentId}`), data)
        .catch(err => this.handleApiErrorAsPromise(err));
    } else {
      return addDoc(this.getCollectionRef(collectionName), data)
        .catch(err => this.handleApiErrorAsPromise(err));
    }
  }

  /**
   * Updates a document in a collection
   * @param collectionName
   * @param documentId
   * @param data
   * @returns
  */
  updateDocument(collectionName: string, addData: any, documentId: string): Promise<any> {
    const data = convertObjectToFirestoreData(addData);
    return updateDoc(doc(this.firestore, `${collectionName}/${documentId}`), data)
      .catch(err => this.handleApiErrorAsPromise(err));
  }

  /**
   * Deletes a document from a collection
   * @param collectionName
   * @param documentId
   * @returns
  */
  deleteDocument(collectionName: string, documentId: string): Promise<any> {
    return deleteDoc(doc(this.firestore, `${collectionName}/${documentId}`))
      .catch(err => this.handleApiErrorAsPromise(err));
  }

  /**
   * Returns a query where function
   * @param key
   * @param symbol
   * @param value
   * @returns
   */
  getWhereQuery(key: string, symbol: WhereFilterOp, value: any): QueryFieldFilterConstraint {
    return where(key, symbol, value);
  }

  /**
   * Queries a collection
   * @param collectionName
   * @param q
   */
  queryCollection(collectionName: string, q: QueryFieldFilterConstraint[]): Observable<any> {
    if (q.length) {
      const ref = this.getCollectionRef(collectionName);
      const qRef = query(ref, ...q);
      return collectionData(qRef).pipe(
        take(1),
        catchError(err => this.handleApiError(err))
      );
    }
    return of(null);
  }

  /**
   * Queries a collection
   * @param collectionName
   * @param q
   */
  queryCollectionSnapshot(collectionName: string, q: QueryFieldFilterConstraint[]): Observable<any> {
    if (q.length) {
      const ref = this.getCollectionRef(collectionName);
      const qRef = query(ref, ...q);
      return collectionSnapshots(qRef).pipe(
        take(1),
        map(resp => combineArrayDataWithId(resp)),
        catchError(err => this.handleApiError(err))
      );
    }
    return of(null);
  }

  /**
   * Handles the API error when observable is used
   * @param err
   */
  handleApiError(err: any): any {
    if (!environment.production) {
      console.log(err);
    }
    const errorMsg = getFirestoreErrorMsg(err);
    return throwError(() => errorMsg);
  }

  /**
   * Handles the API error when promise is used
   * @param err
   */
  handleApiErrorAsPromise(err: any): Promise<any> {
    if (!environment.production) {
      console.log(err);
    }
    const errorMsg = getFirestoreErrorMsg(err);
    return Promise.reject(errorMsg);
  }
}
