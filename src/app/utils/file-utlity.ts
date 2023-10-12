export const FileType = {
  cad: 'image/vnd.dwg',
  excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  imageJPEG: 'image/jpeg',
  imagePNG: 'image/png',
  image: 'image/*',
  octetStream: 'application/octet-stream',
  pdf: 'application/pdf',
  word: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  csv: 'text/csv',
  zip: '.zip',
}

/**
 * Sanitizes the file name
 * @param fileName
 * @returns
 */
export function sanitizeFileName(fileName: string, separator: string): string {
  return fileName.replace(/\s+/g, separator);
}
