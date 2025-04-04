import { TestBed } from '@angular/core/testing';

import {
  DaffCategoryFilter,
  DaffCategoryFilterEqual,
  DaffCategoryUnknownFilterType,
} from '@daffodil/category';
import {
  DaffCategoryFilterEqualFactory,
  DaffCategoryFilterEqualOptionFactory,
  DaffCategoryFilterRangeNumericFactory,
} from '@daffodil/category/testing';

import { daffClearFilter } from './clear-filter';

describe('@daffodil/category | filters | behaviors | clear | daffClearFilter', () => {
  let categoryFilterEqualFactory: DaffCategoryFilterEqualFactory;
  let categoryFilterEqualOptionFactory: DaffCategoryFilterEqualOptionFactory;
  let categoryFilterRangeNumericFactory: DaffCategoryFilterRangeNumericFactory;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    categoryFilterEqualFactory = TestBed.inject(DaffCategoryFilterEqualFactory);
    categoryFilterEqualOptionFactory = TestBed.inject(DaffCategoryFilterEqualOptionFactory);
    categoryFilterRangeNumericFactory = TestBed.inject(DaffCategoryFilterRangeNumericFactory);
  });

  it('should clear a given range filter', () => {
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

    expect(daffClearFilter(filter)).toEqual(expected);
  });

  it('should clear a given equal filter', () => {
    const filter: DaffCategoryFilterEqual = categoryFilterEqualFactory.create({
      name: 'color',
      options: {
        red: categoryFilterEqualOptionFactory.create({
          applied: true,
          value: 'red',
        }),
        blue: categoryFilterEqualOptionFactory.create({
          applied: true,
          value: 'blue',
        }),
      },
    });
    const expected: DaffCategoryFilterEqual = {
      ...filter,
      options: {
        ...filter.options,
        red: {
          ...filter.options['red'],
          applied: false,
        },
        blue: {
          ...filter.options['blue'],
          applied: false,
        },
      },
    };

    expect(daffClearFilter(filter)).toEqual(expected);
  });

  it('should throw an error if given filter has an unknown type', () => {
    const filter: any = {
      type: 'some filter type',
      label: 'Color',
      name: 'color',
      options: {},
    };

    expect(() => {
      daffClearFilter(filter);
    }).toThrowMatching((e) => e instanceof DaffCategoryUnknownFilterType);
  });

  it('should be idempotent over filter', () => {
    const filter: DaffCategoryFilterEqual = categoryFilterEqualFactory.create({
      name: 'color',
      options: {
        red: categoryFilterEqualOptionFactory.create({
          applied: true,
          value: 'red',
        }),
        blue: categoryFilterEqualOptionFactory.create({
          applied: true,
          value: 'blue',
        }),
      },
    });

    expect((idempotentArg?: DaffCategoryFilter) => (daffClearFilter(idempotentArg || filter))).toBeIdempotent();
  });
});
