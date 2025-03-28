import { TestBed } from '@angular/core/testing';

import {
  DaffCategoryFilterEqual,
  DaffCategoryFilterEqualRequest,
  DaffCategoryFilterRangeNumericRequest,
  DaffCategoryFilter,
  DaffCategoryFilterRequestNameMismatch,
  DaffCategoryFilterRequestTypeMismatch,
  DaffCategoryUnknownFilterType,
} from '@daffodil/category';
import {
  DaffCategoryFilterEqualFactory,
  DaffCategoryFilterEqualOptionFactory,
  DaffCategoryFilterRangeNumericFactory,
  DaffCategoryFilterRequestEqualFactory,
  DaffCategoryFilterRequestRangeNumericFactory,
} from '@daffodil/category/testing';

import { daffRemoveFilter } from './remove-filter';

describe('@daffodil/category | filters | behaviors | remove | daffRemoveFilter', () => {

  let categoryFilterEqualFactory: DaffCategoryFilterEqualFactory;
  let categoryFilterEqualOptionFactory: DaffCategoryFilterEqualOptionFactory;
  let categoryFilterRangeNumericFactory: DaffCategoryFilterRangeNumericFactory;
  let categoryFilterRequestEqualFactory: DaffCategoryFilterRequestEqualFactory;
  let categoryFilterRequestRangeNumericFactory: DaffCategoryFilterRequestRangeNumericFactory;
  let colorFilter: DaffCategoryFilterEqual;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    categoryFilterEqualFactory = TestBed.inject(DaffCategoryFilterEqualFactory);
    categoryFilterEqualOptionFactory = TestBed.inject(DaffCategoryFilterEqualOptionFactory);
    categoryFilterRangeNumericFactory = TestBed.inject(DaffCategoryFilterRangeNumericFactory);
    categoryFilterRequestEqualFactory = TestBed.inject(DaffCategoryFilterRequestEqualFactory);
    categoryFilterRequestRangeNumericFactory = TestBed.inject(DaffCategoryFilterRequestRangeNumericFactory);

    colorFilter = categoryFilterEqualFactory.create({
      name: 'color',
      options: {
        red: categoryFilterEqualOptionFactory.create({
          applied: true,
          value: 'red',
        }),
        blue: categoryFilterEqualOptionFactory.create({
          applied: false,
          value: 'blue',
        }),
      },
    });
  });

  it('should remove an equal request', () => {
    const request: DaffCategoryFilterEqualRequest = categoryFilterRequestEqualFactory.create({
      name: 'color',
      value: ['red'],
    });
    const expected: DaffCategoryFilterEqual = {
      ...colorFilter,
      options: {
        ...colorFilter.options,
        red: {
          ...colorFilter.options['red'],
          applied: false,
        },
      },
    };

    expect(daffRemoveFilter(request, colorFilter)).toEqual(expected);
  });

  it('should remove a range request', () => {
    const request: DaffCategoryFilterRangeNumericRequest = categoryFilterRequestRangeNumericFactory.create({
      name: 'price',
      value: {
        min: 0,
        max: 20,
      },
    });

    const filter: DaffCategoryFilter = categoryFilterRangeNumericFactory.create({
      name: 'price',
      min: 0,
      max: 200,
      options: {
        '0-20': {
          applied: true,
          min: {
            label: '0',
            value: 0,
          },
          max: {
            label: '20',
            value: 20,
          },
        },
      },
    });

    const expected: DaffCategoryFilter = {
      ...filter,
      options: {},
    };

    expect(daffRemoveFilter(request, filter)).toEqual(expected);
  });

  it('should throw an error if a request has a different name than the filter', () => {
    const request: DaffCategoryFilterEqualRequest = categoryFilterRequestEqualFactory.create({
      name: 'not color',
      value: ['clear'],
    });

    expect(() => {
      daffRemoveFilter(request, colorFilter);
    }).toThrowMatching((e) => e instanceof DaffCategoryFilterRequestNameMismatch);

  });

  it('should throw an error if a request has a different type than the filter', () => {
    const request: DaffCategoryFilterRangeNumericRequest = categoryFilterRequestRangeNumericFactory.create({
      name: 'color',
      value: {
        min: 0,
        max: 20,
      },
    });

    expect(() => {
      daffRemoveFilter(request, colorFilter);
    }).toThrowMatching((e) => e instanceof DaffCategoryFilterRequestTypeMismatch);
  });

  it('should throw an error if the request is an unknown type', () => {
    const filter: any = {
      type: 'some other type',
      label: 'Color',
      name: 'color',
      options: {
        red: {
          applied: false,
          value: 'red',
          label: 'Red',
          count: 2,
        },
        blue: {
          applied: false,
          value: 'blue',
          label: 'Blue',
          count: 2,
        },
      },
    };
    const request: any = {
      type: 'some other type',
      name: 'color',
      value: ['red'],
    };

    expect(() => {
      daffRemoveFilter(request, filter);
    }).toThrowMatching((e) => e instanceof DaffCategoryUnknownFilterType);
  });

  it('should be idempotent over filter', () => {
    const request = categoryFilterRequestRangeNumericFactory.create({
      name: 'price',
      value: {
        min: 0,
        max: 20,
      },
    });

    const filter = categoryFilterRangeNumericFactory.create({
      name: 'price',
      min: 0,
      max: 200,
      options: {
        '0-20': {
          applied: true,
          min: {
            label: '0',
            value: 0,
          },
          max: {
            label: '20',
            value: 20,
          },
        },
      },
    });

    expect((idempotentArg?: DaffCategoryFilter) => (daffRemoveFilter(request, idempotentArg || filter))).toBeIdempotent();
  });
});
