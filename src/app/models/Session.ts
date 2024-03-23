import { Requirement } from './Requirement';
import { Trainer } from './Trainer';
import { Training } from './Training';
export interface Session {
  id: number;
  code: number;
  duration: number;
  price: number;
  description: string;
  status: string;
  date: Date;
  location: string;
  sessionScore: number;
  creationDate: Date;
  updateDate: Date;
  trainers: Trainer[];
  trainings: Training[];
  //   type: string;
  //   nbinscriptionmini: number;
  //   trainer: string;
  //   lastName: string;
  //   training: string;
}
