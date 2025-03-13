import { Repository } from "typeorm";
import { EmailTracking } from "../entities/email_tracking";
import { AppDataSource } from "../db";

export class EmailTrackingRepository {
  private repository: Repository<EmailTracking>;

  constructor() {
    this.repository = AppDataSource.getRepository(EmailTracking);
  }

  async create(): Promise<EmailTracking> {
    const newEmailTracking = new EmailTracking();
    newEmailTracking.Date = new Date();
    newEmailTracking.Date.setHours(0, 0, 0, 0);
    newEmailTracking.count = 1;
    return await this.repository.save(newEmailTracking);
  }

  async update(emailTracking: EmailTracking): Promise<EmailTracking> {
    return await this.repository.save(emailTracking);
  }

  async findByDate(date: Date): Promise<EmailTracking | undefined> {
    const result = await this.repository.findOne({ where: { Date: date } });
    return result === null ? undefined : result;
  }
}

export const emailTrackingRepository = new EmailTrackingRepository();
