import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  hot,
  cold,
} from 'jasmine-marbles';
import {
  Observable,
  of,
} from 'rxjs';

import { DaffStateError } from '@daffodil/core/state';
import { DaffProduct } from '@daffodil/product';
import {
  DaffProductDriver,
  DaffProductServiceInterface,
} from '@daffodil/product/driver';
import { DaffProductTestingDriverModule } from '@daffodil/product/driver/testing';
import {
  DaffProductGridLoad,
  DaffProductGridLoadSuccess,
  DaffProductGridLoadFailure,
} from '@daffodil/product/state';
import { DaffProductFactory } from '@daffodil/product/testing';

import { DaffProductGridEffects } from './product-grid.effects';

describe('DaffProductGridEffects', () => {
  let actions$: Observable<any>;
  let effects: DaffProductGridEffects<DaffProduct>;
  let productFactory: DaffProductFactory;
  let daffProductDriver: DaffProductServiceInterface;
  let mockProductGrid: DaffProduct[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        DaffProductTestingDriverModule.forRoot(),
      ],
      providers: [
        DaffProductGridEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(DaffProductGridEffects);
    productFactory = TestBed.inject(DaffProductFactory);
    daffProductDriver = TestBed.inject(DaffProductDriver);

    mockProductGrid = new Array(productFactory.create());
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('when ProductGridLoadAction is triggered', () => {

    let expected;
    const productGridLoadAction = new DaffProductGridLoad();

    describe('and the call to ProductService is successful', () => {

      beforeEach(() => {
        spyOn(daffProductDriver, 'getAll').and.returnValue(of(mockProductGrid));
        const productGridLoadSuccessAction = new DaffProductGridLoadSuccess(mockProductGrid);
        actions$ = hot('--a', { a: productGridLoadAction });
        expected = cold('--b', { b: productGridLoadSuccessAction });
      });

      it('should dispatch a ProductGridLoadSuccess action', () => {
        expect(effects.loadAll$).toBeObservable(expected);
      });
    });

    describe('and the call to ProductService fails', () => {

      beforeEach(() => {
        const error: DaffStateError = { code: 'code', message: 'Failed to load product grid' };
        const response = cold('#', {}, error);
        spyOn(daffProductDriver, 'getAll').and.returnValue(response);
        const productGridLoadFailureAction = new DaffProductGridLoadFailure(error);
        actions$ = hot('--a', { a: productGridLoadAction });
        expected = cold('--b', { b: productGridLoadFailureAction });
      });

      it('should dispatch a ProductGridLoadFailure action', () => {
        expect(effects.loadAll$).toBeObservable(expected);
      });
    });
  });
});
