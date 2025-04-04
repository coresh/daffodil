import {
  Injectable,
  Inject,
} from '@angular/core';
import { Apollo } from 'apollo-angular';
import { DocumentNode } from 'graphql';
import { Observable } from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

import {
  DaffCartShippingRate,
  DaffCart,
} from '@daffodil/cart';
import { DaffCartShippingInformationServiceInterface } from '@daffodil/cart/driver';
import { DaffQueuedApollo } from '@daffodil/core/graphql';

import { DAFF_MAGENTO_CART_MUTATION_QUEUE } from './injection-tokens/cart-mutation-queue.token';
import { DAFF_CART_MAGENTO_EXTRA_CART_FRAGMENTS } from './injection-tokens/public_api';
import {
  getSelectedShippingMethod,
  setSelectedShippingMethod,
  listShippingMethods,
} from './queries/public_api';
import {
  MagentoGetSelectedShippingMethodResponse,
  MagentoSetSelectedShippingMethodResponse,
  MagentoListShippingMethodsResponse,
} from './queries/responses/public_api';
import { DaffMagentoShippingMethodInputTransformer } from './transforms/inputs/shipping-method.service';
import { DaffMagentoCartShippingRateTransformer } from './transforms/outputs/cart-shipping-rate.service';
import { DaffMagentoCartTransformer } from './transforms/outputs/cart.service';

/**
 * A service for making Magento GraphQL queries for carts.
 *
 * @inheritdoc
 */
@Injectable({
  providedIn: 'root',
})
export class DaffMagentoCartShippingInformationService implements DaffCartShippingInformationServiceInterface {
  constructor(
    private apollo: Apollo,
    @Inject(DAFF_MAGENTO_CART_MUTATION_QUEUE) private mutationQueue: DaffQueuedApollo,
    @Inject(DAFF_CART_MAGENTO_EXTRA_CART_FRAGMENTS) private extraCartFragments: DocumentNode[],
    private cartTransformer: DaffMagentoCartTransformer,
    private shippingRateTransformer: DaffMagentoCartShippingRateTransformer,
    private shippingMethodInputTransformer: DaffMagentoShippingMethodInputTransformer,
  ) {}

  get(cartId: DaffCart['id']): Observable<DaffCartShippingRate> {
    return this.apollo.query<MagentoGetSelectedShippingMethodResponse>({
      query: getSelectedShippingMethod(this.extraCartFragments),
      variables: { cartId },
    }).pipe(
      map(result => result.data.cart.shipping_addresses[0]
        ? this.shippingRateTransformer.transform(result.data.cart.shipping_addresses[0].selected_shipping_method)
        : null,
      ),
    );
  }

  update(cartId: DaffCart['id'], shippingInfo: Partial<DaffCartShippingRate>): Observable<Partial<DaffCart>> {
    return this.mutationQueue.mutate<MagentoSetSelectedShippingMethodResponse>({
      mutation: setSelectedShippingMethod(this.extraCartFragments),
      variables: {
        cartId,
        method: this.shippingMethodInputTransformer.transform(shippingInfo),
      },
    }).pipe(
      switchMap(result =>
        // because Magento only returns the selected shipping method for the mutation
        // we have to manually refetch the available shipping methods
        // with fetchPolicy: 'network-only' in order to skip the cache
        this.apollo.query<MagentoListShippingMethodsResponse>({
          query: listShippingMethods(this.extraCartFragments),
          variables: { cartId },
          fetchPolicy: 'network-only',
        }).pipe(
          map(shippingMethods => ({
            ...this.cartTransformer.transform(result.data.setShippingMethodsOnCart.cart),
            available_shipping_methods: shippingMethods.data.cart.shipping_addresses[0].available_shipping_methods.map(item =>
              this.shippingRateTransformer.transform(item),
            ),
          })),
        ),
      ),
    );
  }

  delete(cartId: DaffCart['id'], id?: DaffCartShippingRate['id']): Observable<Partial<DaffCart>> {
    return this.mutationQueue.mutate<MagentoSetSelectedShippingMethodResponse>({
      mutation: setSelectedShippingMethod(this.extraCartFragments),
      variables: {
        cartId,
        method: {
          carrier_code: '',
          method_code: '',
        },
      },
    }).pipe(
      map(result => this.cartTransformer.transform(result.data.setShippingMethodsOnCart.cart)),
    );
  }
}
