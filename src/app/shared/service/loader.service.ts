import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private static loaderSubject = new BehaviorSubject<boolean>(false);
  public static isLoading: Observable<boolean> = LoaderService.loaderSubject.asObservable();

  constructor() {}

  static toggle(params: { show: boolean }): void {
    LoaderService.loaderSubject.next(params.show);
  }
}
