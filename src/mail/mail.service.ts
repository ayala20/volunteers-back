/* eslint-disable prettier/prettier */
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { StatusAssociation } from 'src/api/association/dto/create-association.dto';
import { StatusFreeActivity } from 'src/api/free-activity/dto/create-free-activity.dto';

@Injectable()
export class MailService {

  constructor(private mailerService: MailerService) {}

  async sendingAnEmailToTheAssociation(email: string, status: string, name: string, password?: string) {
    if (status == StatusAssociation.APPROVED) {
      await this.mailerService.sendMail({
        to: email,
        subject: 'תשובה לבקשת פתיחת מערך התנדבות',
        template: './transactional.html',
        context: {
          name: name,
          status: "block",
          password: password,
          message: "נענתה בחיוב",
          m1: "קוד העמותה במערכת הינו:",
          m2: "קוד זה ישמש את האחראים מטעם העמותה לרישום למערכת שלנו"
        },
      });
    }
    else {
      await this.mailerService.sendMail({
        to: email,
        subject: 'תשובה לבקשת פתיחת מערך התנדבות',
        template: './transactional.html',
        context:
        {
          name: name,
          status: "none",
          message: "לא אושרה",
          password: password,
          m1: "",
          m2: "",
        },
      });
    }
  }

  async sendingAnEmailToAVolunteer(email: string, nameA: string, name: string, status: string) {
    if (status == StatusFreeActivity.APPROVED) {
      await this.mailerService.sendMail({
        to: email,
        subject: 'תשובה לבקשת התנדבות',
        template: './aOrROfVolunteering.html',
        context: {
          name: name,
          nameA: nameA,
          message: "נענתה בחיוב",
          m1: "את פרטי ההתנדבות תוכל למצא באתר ההתנדבויות",
        },
      });
    }
    else {
      await this.mailerService.sendMail({
        to: email,
        subject: 'תשובה לבקשת פתיחת מערך התנדבות',
        template: './aOrROfVolunteering.html',
        context:
        {
          name: name,
          nameA: nameA,
          message: "לא אושרה",
          m1: "ממליצים לבדוק אולי יש התנדבויות אחרו שיכולות להתאים לך",
        },
      });
    }
  }
}
