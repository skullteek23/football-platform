
// Internal types
type FunctionsErrorCode = `functions/${FunctionsErrorCodeCore}`;
type FunctionsErrorCodeCore = 'ok' | 'cancelled' | 'unknown' | 'invalid-argument' | 'deadline-exceeded' | 'not-found' | 'already-exists' | 'permission-denied' | 'resource-exhausted' | 'failed-precondition' | 'aborted' | 'out-of-range' | 'unimplemented' | 'internal' | 'unavailable' | 'data-loss' | 'unauthenticated';

class FirebaseError extends Error {
  /** The error code for this error. */
  readonly code!: string;
  /** Custom data for this error. */
  customData?: Record<string, unknown> | undefined;
  /** The custom name for all FirebaseErrors. */
  override readonly name!: string;
  constructor(
    /** The error code for this error. */
    code: string, message: string,
    /** Custom data for this error. */
    customData?: Record<string, unknown> | undefined) {
    super();
  };
}
enum StorageErrorCode {
  UNKNOWN = "unknown",
  OBJECT_NOT_FOUND = "object-not-found",
  BUCKET_NOT_FOUND = "bucket-not-found",
  PROJECT_NOT_FOUND = "project-not-found",
  QUOTA_EXCEEDED = "quota-exceeded",
  UNAUTHENTICATED = "unauthenticated",
  UNAUTHORIZED = "unauthorized",
  UNAUTHORIZED_APP = "unauthorized-app",
  RETRY_LIMIT_EXCEEDED = "retry-limit-exceeded",
  INVALID_CHECKSUM = "invalid-checksum",
  CANCELED = "canceled",
  INVALID_EVENT_NAME = "invalid-event-name",
  INVALID_URL = "invalid-url",
  INVALID_DEFAULT_BUCKET = "invalid-default-bucket",
  NO_DEFAULT_BUCKET = "no-default-bucket",
  CANNOT_SLICE_BLOB = "cannot-slice-blob",
  SERVER_FILE_WRONG_SIZE = "server-file-wrong-size",
  NO_DOWNLOAD_URL = "no-download-url",
  INVALID_ARGUMENT = "invalid-argument",
  INVALID_ARGUMENT_COUNT = "invalid-argument-count",
  APP_DELETED = "app-deleted",
  INVALID_ROOT_OPERATION = "invalid-root-operation",
  INVALID_FORMAT = "invalid-format",
  INTERNAL_ERROR = "internal-error",
  UNSUPPORTED_ENVIRONMENT = "unsupported-environment"
}

// Interfaces
export interface IApiError extends FirebaseError { }
export type CloudFnErrorCode = FunctionsErrorCode;
export type CloudStorageErrorCode = StorageErrorCode;

