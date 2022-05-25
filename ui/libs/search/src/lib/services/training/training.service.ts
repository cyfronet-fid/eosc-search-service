import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import * as trainingsJSON from './trainings.data.json';
import { ITraining } from '../../collections/trainings/training.model';
import Fuse from 'fuse.js';
import { trainingsCollection } from '../../collections/trainings/tranings.collection';
import {IResult} from "../../state/results/results.model";

@Injectable({providedIn: 'root'})
export class TrainingService {
  getByQuery$(q: string): Observable<IResult[]> {
    const all = (trainingsJSON as unknown as { default: unknown })
      .default as ITraining[];
    const fuse = new Fuse(all, { keys: ['title'] });
    const found =
      q === '*'
        ? all
        : fuse.search(q).map((item: { item: ITraining }) => item.item);
    return of(found.map(trainingsCollection.inputAdapter))
  }
}
