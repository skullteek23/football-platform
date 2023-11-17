export class SupportRequest {
  subject: string = '';
  description: string = '';
  uid: string = '';
  screenshots: string[] = [];
  createdAt: number = new Date().getTime();
}
