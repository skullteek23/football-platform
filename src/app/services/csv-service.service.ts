import { Injectable } from '@angular/core';
import { mkConfig, generateCsv, download } from "export-to-csv";

@Injectable({
  providedIn: 'root'
})
export class CsvServiceService {
  csvConfig = mkConfig({ useKeysAsHeaders: true });
  constructor() { }

  download(data: any) {
    const csv = generateCsv(this.csvConfig)(data);
    download(this.csvConfig)(csv)
  }


}
