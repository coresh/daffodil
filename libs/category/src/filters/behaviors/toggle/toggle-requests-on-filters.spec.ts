import { TestBed } from '@angular/core/testing';

import {
  DaffCategoryFilterEqual,
  DaffCategoryFilter,
  DaffCategoryFilterToggleRequest,
  DaffCategoryFilterNotFound,
} from '@daffodil/category';
import {
  DaffCategoryFilterEqualFactory,
  DaffCategoryFilterEqualOptionFactory,
  DaffCategoryFilterToggleRequestEqualFactory,
} from '@daffodil/category/testing';
import { Dict } from '@daffodil/core';

import { daffToggleRequestsOnFilters } from './toggle-requests-on-filters';

describe('@daffodil/category | filters | behaviors | toggle | daffToggleRequestsOnFilters', () => {
  let categoryFilterEqualFactory: DaffCategoryFilterEqualFactory;
  let categoryFilterEqualOptionFactory: DaffCategoryFilterEqualOptionFactory;
  let categoryFilterToggleRequestEqualFactory: DaffCategoryFilterToggleRequestEqualFactory;
  let colorFilter: DaffCategoryFilterEqual;
  let sizeFilter: DaffCategoryFilterEqual;
  let filters: Dict<DaffCategoryFilter>;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    categoryFilterEqualFactory = TestBed.inject(DaffCategoryFilterEqualFactory);
    categoryFilterEqualOptionFactory = TestBed.inject(DaffCategoryFilterEqualOptionFactory);
    categoryFilterToggleRequestEqualFactory = TestBed.inject(DaffCategoryFilterToggleRequestEqualFactory);

    colorFilter = categoryFilterEqualFactory.create({
      name: 'color',
      options: {
        red: categoryFilterEqualOptionFactory.create({
          applied: false,
          value: 'red',
        }),
        blue: categoryFilterEqualOptionFactory.create({
          applied: false,
          value: 'blue',
        }),
      },
    });
    sizeFilter = categoryFilterEqualFactory.create({
      name: 'size',
      options: {
        small: categoryFilterEqualOptionFactory.create({
          applied: false,
          value: 'small',
        }),
        medium: categoryFilterEqualOptionFactory.create({
          applied: false,
          value: 'medium',
        }),
      },
    });
    filters	= {
      color: colorFilter,
      size: sizeFilter,
    };
  });

  it('should not toggle any filters if there are no filter requests', () => {
    const requests: DaffCategoryFilterToggleRequest[] = [];

    expect(daffToggleRequestsOnFilters(requests, filters)).toEqual(filters);
  });

  it('should throw an error if there are no requests that match', () => {
    const requests: DaffCategoryFilterToggleRequest[] = [
      categoryFilterToggleRequestEqualFactory.create({
        name: 'someFilter',
        value: 'someFilter value',
      }),
    ];

    expect(() => {
      daffToggleRequestsOnFilters(requests, filters);
    }).toThrowMatching((e) => e instanceof DaffCategoryFilterNotFound);
  });

  it('should toggle a filter if there is a request that matches', () => {
    const requests: DaffCategoryFilterToggleRequest[] = [
      categoryFilterToggleRequestEqualFactory.create({
        name: 'color',
        value: 'red',
      }),
    ];
    const expected: Dict<DaffCategoryFilter> = {
      ...filters,
      color: {
        ...colorFilter,
        options: {
          ...colorFilter.options,
          red: {
            ...colorFilter.options['red'],
            applied: true,
          },
        },
      },
    };

    expect(daffToggleRequestsOnFilters(requests, filters)).toEqual(expected);
  });

  it('should toggle multiple filters if there are multiple requests that match', () => {
    const requests: DaffCategoryFilterToggleRequest[] = [
      categoryFilterToggleRequestEqualFactory.create({
        name: 'color',
        value: 'red',
      }),
      categoryFilterToggleRequestEqualFactory.create({
        name: 'size',
        value: 'small',
      }),
    ];
    const expected: Dict<DaffCategoryFilter> = {
      ...filters,
      color: {
        ...colorFilter,
        options: {
          ...colorFilter.options,
          red: {
            ...colorFilter.options['red'],
            applied: true,
          },
        },
      },
      size: {
        ...sizeFilter,
        options: {
          ...sizeFilter.options,
          small: {
            ...sizeFilter.options['small'],
            applied: true,
          },
        },
      },
    };

    expect(daffToggleRequestsOnFilters(requests, filters)).toEqual(expected);
  });
});
