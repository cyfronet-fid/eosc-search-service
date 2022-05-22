import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import * as trainingsJSON from './trainings.data.json';
import { ITraining } from '../../collections/trainings/training.model';
import Fuse from 'fuse.js';
import { IResult } from '../../result.model';
import { trainingsCollection } from '../../collections/trainings/tranings.collection';

@Injectable({providedIn: 'root'})
export class TrainingService {
  async getByQuery$(q: string): Promise<IResult[]> {
    const all = (trainingsJSON as unknown as { default: unknown })
      .default as ITraining[];
    const fuse = new Fuse(all, { keys: ['title'] });
    const found =
      q === '*'
        ? all
        : fuse.search(q).map((item: { item: ITraining }) => item.item);
    return (
      (await of(found.map(trainingsCollection.inputAdapter)).toPromise()) || []
    );
  }
}
