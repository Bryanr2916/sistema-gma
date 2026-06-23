import { Injectable } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private functions: Functions) {}

  async enviarEmail(toEmail: string, subject: string, textContent: string): Promise<any> {
    const sendEmail = httpsCallable(this.functions, 'sendEmailViaBrevo');
    return sendEmail({ toEmail, subject, textContent });
  }
}
