import Dexie, { type Table } from 'dexie';
import { Activity, UserProfile, Goal, AppNotification } from '../types';

export class ThePulseDB extends Dexie {
  activities!: Table<Activity>;
  userProfile!: Table<UserProfile>;
  goals!: Table<Goal>;
  notifications!: Table<AppNotification>;

  constructor() {
    super('ThePulseDB');
    this.version(2).stores({
      activities: '++id, type, date',
      userProfile: '++id',
      goals: '++id, type, metric',
      notifications: '++id, date, read'
    });
  }
}

export const db = new ThePulseDB();
