import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  DaffCartItem,
  DaffCartItemInput,
  DaffCart,
} from '@daffodil/cart';
import { DaffCartItemServiceInterface } from '@daffodil/cart/driver';

/**
 * @inheritdoc
 */
@Injectable({
  providedIn: 'root',
})
export class DaffInMemoryCartItemService implements DaffCartItemServiceInterface<
  DaffCartItem,
  DaffCartItemInput,
  DaffCart
> {
  /**
   * The URL with which the driver makes calls to the backend.
   */
  readonly url = '/api/cart-items';

  constructor(private http: HttpClient) {}

  list(cartId: DaffCart['id']): Observable<DaffCartItem[]> {
    return this.http.get<DaffCartItem[]>(`${this.url}/${cartId}/`);
  }

  get(cartId: DaffCart['id'], itemId: DaffCartItem['id']): Observable<DaffCartItem> {
    return this.http.get<DaffCartItem>(`${this.url}/${cartId}/${itemId}`);
  }

  add(cartId: DaffCart['id'], input: DaffCartItemInput): Observable<Partial<DaffCart>> {
    return this.http.post<Partial<DaffCart>>(`${this.url}/${cartId}/`, input);
  }

  update(
    cartId: DaffCart['id'],
    itemId: DaffCartItem['id'],
    item: Partial<DaffCartItem>,
  ): Observable<Partial<DaffCart>> {
    return this.http.put<Partial<DaffCart>>(`${this.url}/${cartId}/${itemId}`, item);
  }

  delete(cartId: DaffCart['id'], itemId: DaffCartItem['id']): Observable<Partial<DaffCart>> {
    return this.http.delete<Partial<DaffCart>>(`${this.url}/${cartId}/${itemId}`);
  }
}
