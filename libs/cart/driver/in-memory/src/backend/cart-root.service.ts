import { Injectable } from '@angular/core';
import {
  InMemoryDbService,
  RequestInfo,
  STATUS,
} from 'angular-in-memory-web-api';

import { DaffCart } from '@daffodil/cart';
import { DaffInMemoryDataServiceInterface } from '@daffodil/core/testing';

import { DaffInMemoryBackendCartAddressService } from './cart-address/cart-address.service';
import { DaffInMemoryBackendCartBillingAddressService } from './cart-billing-address/cart-billing-address.service';
import { DaffInMemoryBackendCartCouponService } from './cart-coupon/cart-coupon.service';
import { DaffInMemoryBackendCartItemsService } from './cart-items/cart-items.service';
import { DaffInMemoryBackendCartOrderService } from './cart-order/cart-order.service';
import { DaffInMemoryBackendCartPaymentMethodsService } from './cart-payment-methods/cart-payment-methods.service';
import { DaffInMemoryBackendCartPaymentService } from './cart-payment/cart-payment.service';
import { DaffInMemoryBackendCartShippingAddressService } from './cart-shipping-address/cart-shipping-address.service';
import { DaffInMemoryBackendCartShippingInformationService } from './cart-shipping-information/cart-shipping-information.service';
import { DaffInMemoryBackendCartShippingMethodsService } from './cart-shipping-methods/cart-shipping-methods.service';
import { DaffInMemoryBackendCartService } from './cart/cart.service';

/**
 * The root cart in-memory backend.
 * Creates the database and delegates requests to child backends.
 */
@Injectable({
  providedIn: 'root',
})
export class DaffInMemoryBackendCartRootService implements InMemoryDbService, DaffInMemoryDataServiceInterface {
  /**
   * The collections that the root service manages.
   * Useful for a higher-level backend that delegates to this one based on collection name.
   */
  public static readonly COLLECTION_NAMES = [
    'cart',
    'cart-items',
    'cart-order',
    'cart-coupon',
    'cart-address',
    'cart-shipping-address',
    'cart-billing-address',
    'cart-payment-methods',
    'cart-shipping-methods',
    'cart-payment',
    'cart-shipping-information',
  ];

  /**
   * The collection of carts in the backend.
   */
  public carts: DaffCart[] = [];

  constructor(
    private cartService: DaffInMemoryBackendCartService,
    private cartItemsService: DaffInMemoryBackendCartItemsService,
    private cartOrderService: DaffInMemoryBackendCartOrderService,
    private cartCouponService: DaffInMemoryBackendCartCouponService,
    private cartAddressService: DaffInMemoryBackendCartAddressService,
    private cartShippingAddressService: DaffInMemoryBackendCartShippingAddressService,
    private cartBillingAddressService: DaffInMemoryBackendCartBillingAddressService,
    private cartPaymentMethodsService: DaffInMemoryBackendCartPaymentMethodsService,
    private cartShippingMethodsService: DaffInMemoryBackendCartShippingMethodsService,
    private cartPaymentService: DaffInMemoryBackendCartPaymentService,
    private cartShippingInformationService: DaffInMemoryBackendCartShippingInformationService,
  ) {}

  createDb(reqInfo: RequestInfo) {
    if (reqInfo) {
      const seedData = reqInfo.utils.getJsonBody(reqInfo.req).carts;
      if (seedData) {
        this.carts = seedData;
      }
    }

    return {
      cart: this.carts,
    };
  }

  get(reqInfo: RequestInfo) {
    return this.delegateRequest(reqInfo);
  }

  post(reqInfo: RequestInfo) {
    return this.delegateRequest(reqInfo);
  }

  put(reqInfo: RequestInfo) {
    return this.delegateRequest(reqInfo);
  }

  delete(reqInfo: RequestInfo) {
    return this.delegateRequest(reqInfo);
  }

  private delegateRequest(reqInfo: RequestInfo) {
    reqInfo.collection = this.carts;

    switch (reqInfo.collectionName) {
      case 'cart':
        return this.cartService[reqInfo.method](reqInfo);

      case 'cart-items':
        return this.cartItemsService[reqInfo.method](reqInfo);

      case 'cart-order':
        return this.cartOrderService[reqInfo.method](reqInfo);

      case 'cart-coupon':
        return this.cartCouponService[reqInfo.method](reqInfo);

      case 'cart-address':
        return this.cartAddressService[reqInfo.method](reqInfo);

      case 'cart-shipping-address':
        return this.cartShippingAddressService[reqInfo.method](reqInfo);

      case 'cart-billing-address':
        return this.cartBillingAddressService[reqInfo.method](reqInfo);

      case 'cart-payment-methods':
        return this.cartPaymentMethodsService[reqInfo.method](reqInfo);

      case 'cart-shipping-methods':
        return this.cartShippingMethodsService[reqInfo.method](reqInfo);

      case 'cart-payment':
        return this.cartPaymentService[reqInfo.method](reqInfo);

      case 'cart-shipping-information':
        return this.cartShippingInformationService[reqInfo.method](reqInfo);

      default:
        return reqInfo.utils.createResponse$(() => ({
          body: {},
          status: STATUS.OK,
        }));
    }
  }
}
