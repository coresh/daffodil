import { TestBed } from '@angular/core/testing';
import { InMemoryCache } from '@apollo/client/core';
import { addTypenameToDocument } from '@apollo/client/utilities';
import {
  ApolloTestingController,
  ApolloTestingModule,
  APOLLO_TESTING_CACHE,
} from 'apollo-angular/testing';
import { GraphQLError } from 'graphql';
import { catchError } from 'rxjs/operators';

import { DaffCart } from '@daffodil/cart';
import { schema } from '@daffodil/driver/magento';
import {
  DaffOrder,
  DaffOrderAddress,
  DaffOrderCoupon,
  DaffOrderInvoice,
  DaffOrderItem,
  DaffOrderShipmentItem,
  DaffOrderShipmentTracking,
  DaffOrderShipment,
  DaffOrderShippingMethod,
  DaffOrderTotal,
  DaffOrderPayment,
  DaffOrderTotalTypeEnum,
} from '@daffodil/order';
import {
  DaffOrderNotFoundError,
  DaffOrderInvalidAPIResponseError,
} from '@daffodil/order/driver';
import {
  MagentoGraycoreOrder,
  MagentoGraycoreOrderAddress,
  MagentoGraycoreOrderInvoice,
  MagentoGraycoreOrderPayment,
  MagentoGraycoreOrderItem,
  MagentoGraycoreOrderShipmentItem,
  MagentoGraycoreOrderShipmentTracking,
  MagentoGraycoreOrderShipment,
  getGuestOrders,
  MagentoGetGuestOrdersResponse,
} from '@daffodil/order/driver/magento/2.4.0';
import {
  DaffOrderFactory,
  DaffOrderAddressFactory,
  DaffOrderCouponFactory,
  DaffOrderInvoiceFactory,
  DaffOrderItemFactory,
  DaffOrderShipmentItemFactory,
  DaffOrderShipmentTrackingFactory,
  DaffOrderShipmentFactory,
  DaffOrderShippingMethodFactory,
  DaffOrderTotalFactory,
  DaffOrderPaymentFactory,
} from '@daffodil/order/testing';

import { DaffOrderMagentoService } from './order.service';

describe('Order | Driver | Magento | 2.4.0 | OrderService', () => {
  let service: DaffOrderMagentoService;
  let controller: ApolloTestingController;

  let daffOrderFactory: DaffOrderFactory;
  let daffOrderAddressFactory: DaffOrderAddressFactory;
  let daffOrderCouponFactory: DaffOrderCouponFactory;
  let daffOrderInvoiceFactory: DaffOrderInvoiceFactory;
  let daffOrderPaymentFactory: DaffOrderPaymentFactory;
  let daffOrderItemFactory: DaffOrderItemFactory;
  let daffOrderShipmentItemFactory: DaffOrderShipmentItemFactory;
  let daffOrderShipmentTrackingFactory: DaffOrderShipmentTrackingFactory;
  let daffOrderShipmentFactory: DaffOrderShipmentFactory;
  let daffOrderShippingMethodFactory: DaffOrderShippingMethodFactory;
  let daffOrderTotalFactory: DaffOrderTotalFactory;

  let cartId: DaffCart['id'];
  let orderId: DaffOrder['id'];
  let mockDaffOrder: DaffOrder;
  let mockDaffOrderAddress: DaffOrderAddress;
  let mockDaffOrderCoupon: DaffOrderCoupon;
  let mockDaffOrderInvoice: DaffOrderInvoice;
  let mockDaffOrderPayment: DaffOrderPayment;
  let mockDaffOrderItem: DaffOrderItem;
  let mockDaffOrderShipmentItem: DaffOrderShipmentItem;
  let mockDaffOrderShipmentTracking: DaffOrderShipmentTracking;
  let mockDaffOrderShipment: DaffOrderShipment;
  let mockDaffOrderShippingMethod: DaffOrderShippingMethod;
  let mockDaffOrderGrandTotal: DaffOrderTotal;
  let mockDaffOrderSubTotal: DaffOrderTotal;
  let mockDaffOrderShippingTotal: DaffOrderTotal;
  let mockDaffOrderTax: DaffOrderTotal;
  let mockDaffOrderDiscount: DaffOrderTotal;

  let mockMagentoOrder: MagentoGraycoreOrder;
  let mockMagentoOrderAddress: MagentoGraycoreOrderAddress;
  let mockMagentoOrderInvoice: MagentoGraycoreOrderInvoice;
  let mockMagentoOrderPayment: MagentoGraycoreOrderPayment;
  let mockMagentoOrderItem: MagentoGraycoreOrderItem;
  let mockMagentoOrderShipmentItem: MagentoGraycoreOrderShipmentItem;
  let mockMagentoOrderShipmentTracking: MagentoGraycoreOrderShipmentTracking;
  let mockMagentoOrderShipment: MagentoGraycoreOrderShipment;

  let mockGetOrdersResponse: MagentoGetGuestOrdersResponse;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ApolloTestingModule,
      ],
      providers: [
        DaffOrderMagentoService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
            addTypename: true,
            possibleTypes: schema.possibleTypes,
          }),
        },
      ],
    });

    service = TestBed.inject(DaffOrderMagentoService);
    controller = TestBed.inject(ApolloTestingController);

    daffOrderFactory = TestBed.inject(DaffOrderFactory);
    daffOrderAddressFactory = TestBed.inject(DaffOrderAddressFactory);
    daffOrderCouponFactory = TestBed.inject(DaffOrderCouponFactory);
    daffOrderInvoiceFactory = TestBed.inject(DaffOrderInvoiceFactory);
    daffOrderPaymentFactory = TestBed.inject(DaffOrderPaymentFactory);
    daffOrderItemFactory = TestBed.inject(DaffOrderItemFactory);
    daffOrderShipmentItemFactory = TestBed.inject(DaffOrderShipmentItemFactory);
    daffOrderShipmentTrackingFactory = TestBed.inject(DaffOrderShipmentTrackingFactory);
    daffOrderShipmentFactory = TestBed.inject(DaffOrderShipmentFactory);
    daffOrderShippingMethodFactory = TestBed.inject(DaffOrderShippingMethodFactory);
    daffOrderTotalFactory = TestBed.inject(DaffOrderTotalFactory);

    mockDaffOrderAddress = daffOrderAddressFactory.create({
      order_id: '2',
    });
    mockDaffOrderCoupon = daffOrderCouponFactory.create();
    mockDaffOrderPayment = daffOrderPaymentFactory.create({
      created_at: null,
      order_id: '2',
      id: '6',
      payment_id: '6',
      updated_at: null,
    });
    mockDaffOrderItem = daffOrderItemFactory.create({
      image: {
        url: 'url',
        id: null,
        label: null,
      },
      parent_item_id: null,
      product_id: '4',
      order_id: '2',
      item_id: null,
      id: null,
    });
    mockDaffOrderShipmentItem = daffOrderShipmentItemFactory.create({
      item: mockDaffOrderItem,
    });
    mockDaffOrderShipmentTracking = daffOrderShipmentTrackingFactory.create({
      tracking_url: null,
      carrier_logo: null,
    });
    mockDaffOrderShipment = daffOrderShipmentFactory.create({
      carrier: null,
      carrier_title: null,
      code: null,
      method: null,
      method_description: null,
      tracking: [mockDaffOrderShipmentTracking],
      items: [mockDaffOrderShipmentItem],
    });
    mockDaffOrderShippingMethod = daffOrderShippingMethodFactory.create();
    mockDaffOrderGrandTotal = daffOrderTotalFactory.create({
      label: 'Grand Total',
      type: DaffOrderTotalTypeEnum.GrandTotal,
      sort_order: 1,
    });
    mockDaffOrderSubTotal = daffOrderTotalFactory.create({
      label: 'Subtotal',
      type: DaffOrderTotalTypeEnum.Subtotal,
      sort_order: 0,
    });
    mockDaffOrderShippingTotal = daffOrderTotalFactory.create({
      label: 'Shipping',
      type: DaffOrderTotalTypeEnum.Shipping,
      sort_order: 2,
    });
    mockDaffOrderTax = daffOrderTotalFactory.create({
      label: 'Tax',
      type: DaffOrderTotalTypeEnum.Tax,
      sort_order: 3,
    });
    mockDaffOrderDiscount = daffOrderTotalFactory.create({
      label: 'Discount',
      type: DaffOrderTotalTypeEnum.Discount,
      sort_order: 4,
    });
    mockDaffOrderInvoice = daffOrderInvoiceFactory.create({
      totals: [
        mockDaffOrderGrandTotal,
        mockDaffOrderSubTotal,
        mockDaffOrderShippingTotal,
        mockDaffOrderTax,
        mockDaffOrderDiscount,
      ],
      billing_address: mockDaffOrderAddress,
      shipping_address: mockDaffOrderAddress,
      payment: mockDaffOrderPayment,
      items: [mockDaffOrderShipmentItem],
      shipping_method: null,
    });
    mockDaffOrder = daffOrderFactory.create({
      id: '2',
      customer_id: '1',
      totals: [
        mockDaffOrderGrandTotal,
        mockDaffOrderSubTotal,
        mockDaffOrderShippingTotal,
        mockDaffOrderTax,
        mockDaffOrderDiscount,
      ],
      applied_codes: [mockDaffOrderCoupon],
      items: [mockDaffOrderItem],
      billing_addresses: [mockDaffOrderAddress],
      shipping_addresses: [mockDaffOrderAddress],
      shipments: [mockDaffOrderShipment],
      payment: mockDaffOrderPayment,
      invoices: [mockDaffOrderInvoice],
      credits: [mockDaffOrderInvoice],
    });
    orderId = mockDaffOrder.id;
    cartId = 'cartId';

    mockMagentoOrderItem = {
      __typename: 'GraycoreOrderItem',
      qty_ordered: mockDaffOrderItem.qty_ordered,
      qty_canceled: mockDaffOrderItem.qty_canceled,
      qty_fulfilled: mockDaffOrderItem.qty_fulfilled,
      image: mockDaffOrderItem.image.url,
      order_id: String(mockDaffOrderItem.order_id),
      created_at: mockDaffOrderItem.created_at,
      updated_at: mockDaffOrderItem.updated_at,
      product_id: Number(mockDaffOrderItem.product_id),
      sku: mockDaffOrderItem.sku,
      name: mockDaffOrderItem.name,
      weight: mockDaffOrderItem.weight,
      qty: mockDaffOrderItem.qty,
      price: mockDaffOrderItem.price,
      discount_percent: mockDaffOrderItem.discount_percent,
      discount_amount: mockDaffOrderItem.discount_amount,
      tax_percent: mockDaffOrderItem.tax_percent,
      tax_amount: mockDaffOrderItem.tax_amount,
      row_total: mockDaffOrderItem.row_total,
      row_total_with_discount: mockDaffOrderItem.row_total_with_discount,
      row_weight: mockDaffOrderItem.row_weight,
      tax_before_discount: mockDaffOrderItem.tax_before_discount,
    };
    mockMagentoOrderAddress = {
      __typename: 'GraycoreOrderAddress',
      order_id: Number(mockDaffOrderAddress.order_id),
      prefix: mockDaffOrderAddress.prefix,
      suffix: mockDaffOrderAddress.suffix,
      firstname: mockDaffOrderAddress.firstname,
      middlename: mockDaffOrderAddress.middlename,
      lastname: mockDaffOrderAddress.lastname,
      telephone: mockDaffOrderAddress.telephone,
      email: mockDaffOrderAddress.email,
      street: [mockDaffOrderAddress.street, mockDaffOrderAddress.street2],
      city: mockDaffOrderAddress.city,
      region_id: String(mockDaffOrderAddress.region),
      region: String(mockDaffOrderAddress.region),
      country_code: mockDaffOrderAddress.country,
      postcode: mockDaffOrderAddress.postcode,
    };
    mockMagentoOrderShipmentTracking = {
      __typename: 'GraycoreOrderShipmentTracking',
      tracking_number: mockDaffOrderShipmentTracking.tracking_number,
      carrier: mockDaffOrderShipmentTracking.carrier,
      title: mockDaffOrderShipmentTracking.title,
    };
    mockMagentoOrderShipmentItem = {
      __typename: 'GraycoreOrderShipmentItem',
      item: mockMagentoOrderItem,
      qty: mockDaffOrderShipmentItem.qty,
    };
    mockMagentoOrderShipment = {
      __typename: 'GraycoreOrderShipment',
      tracking: [mockMagentoOrderShipmentTracking],
      items: [mockMagentoOrderShipmentItem],
    };
    mockMagentoOrderPayment = {
      __typename: 'GraycoreOrderPayment',
      payment_id: Number(mockDaffOrderPayment.id),
      order_id: Number(mockDaffOrderPayment.order_id),
      method: mockDaffOrderPayment.method,
      cc_type: mockDaffOrderPayment.cc_type,
      cc_last4: mockDaffOrderPayment.cc_last4,
      cc_owner: mockDaffOrderPayment.cc_owner,
      cc_exp_month: mockDaffOrderPayment.cc_exp_month,
      cc_exp_year: mockDaffOrderPayment.cc_exp_year,
    };
    mockMagentoOrderInvoice = {
      __typename: 'GraycoreOrderInvoice',
      items: [mockMagentoOrderShipmentItem],
      grand_total: mockDaffOrderGrandTotal.value,
      subtotal: mockDaffOrderSubTotal.value,
      shipping: mockDaffOrderShippingTotal.value,
      discount: mockDaffOrderDiscount.value,
      tax: mockDaffOrderTax.value,
      billing_address: mockMagentoOrderAddress,
      shipping_address: mockMagentoOrderAddress,
      payment: mockMagentoOrderPayment,
    };
    mockMagentoOrder = {
      __typename: 'GraycoreOrder',
      id: Number(mockDaffOrder.id),
      order_number: mockDaffOrder.id,
      customer_id: Number(mockDaffOrder.customer_id),
      created_at: mockDaffOrder.created_at,
      updated_at: mockDaffOrder.updated_at,
      grand_total: mockDaffOrderGrandTotal.value,
      subtotal: mockDaffOrderSubTotal.value,
      shipping: mockDaffOrderShippingTotal.value,
      discount: mockDaffOrderDiscount.value,
      tax: mockDaffOrderTax.value,
      status: mockDaffOrder.status,
      applied_codes: [mockDaffOrderCoupon.code],
      items: [mockMagentoOrderItem],
      billing_address: mockMagentoOrderAddress,
      shipping_address: mockMagentoOrderAddress,
      shipments: [mockMagentoOrderShipment],
      payment: mockMagentoOrderPayment,
      invoices: [mockMagentoOrderInvoice],
      credits: [mockMagentoOrderInvoice],
    };
    mockDaffOrder.extra_attributes = mockMagentoOrder;
    mockGetOrdersResponse = {
      graycoreGuestOrders: {
        __typename: 'GraycoreGuestOrders',
        orders: [mockMagentoOrder],
      },
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get | getting a single order by ID', () => {
    describe('when the call to the Magento API is successful', () => {
      describe('and the response fails validation', () => {
        beforeEach(() => {
          mockGetOrdersResponse.graycoreGuestOrders.orders = null;
        });

        it('should throw a DaffOrderInvalidAPIResponseError', done => {
          service.list(cartId).pipe(
            catchError(err => {
              expect(err).toEqual(jasmine.any(DaffOrderInvalidAPIResponseError));
              done();
              return [];
            }),
          ).subscribe();

          const op = controller.expectOne(addTypenameToDocument(getGuestOrders([])));

          op.flush({
            data: mockGetOrdersResponse,
          });
        });
      });

      describe('and the response passes validation', () => {

        describe('and the order is found', () => {
          it('should return the correct Daffodil order', done => {
            service.get(orderId, cartId).subscribe(result => {
              expect(result).toEqual(jasmine.objectContaining(mockDaffOrder));
              done();
            });

            const op = controller.expectOne(addTypenameToDocument(getGuestOrders([])));

            op.flush({
              data: mockGetOrdersResponse,
            });
          });
        });

        describe('and the order is not found', () => {
          let notOrderId;

          beforeEach(() => {
            notOrderId = 'notOrderId';
          });

          it('should throw a DaffOrderNotFoundError', done => {
            const expected = new DaffOrderNotFoundError(`Could not find an order with ID ${notOrderId}`);

            service.get(notOrderId, cartId).subscribe(result => {
              fail();
              done();
            }, error => {
              expect(error).toEqual(expected);
              done();
            });

            const op = controller.expectOne(addTypenameToDocument(getGuestOrders([])));

            op.flush({
              data: mockGetOrdersResponse,
            });
          });
        });
      });
    });

    describe('when the call to the Magento API is unsuccessful', () => {
      it('should throw an Error', done => {
        service.get(orderId, cartId).pipe(
          catchError(err => {
            expect(err).toEqual(jasmine.any(Error));
            done();
            return [];
          }),
        ).subscribe();

        const op = controller.expectOne(addTypenameToDocument(getGuestOrders([])));

        op.graphqlErrors([new GraphQLError(
          'Can\'t find a cart with that ID.',
          null,
          null,
          null,
          null,
          null,
          { category: 'graphql-no-such-entity' },
        )]);
      });
    });
  });

  describe('list | listing the available orders', () => {
    describe('when the call to the Magento API is successful', () => {
      describe('and the response passes validation', () => {

        it('should return the list of Daffodil orders', done => {
          service.list(cartId).subscribe(result => {
            expect(result).toEqual([jasmine.objectContaining(mockDaffOrder)]);
            done();
          });

          const op = controller.expectOne(addTypenameToDocument(getGuestOrders([])));

          op.flush({
            data: mockGetOrdersResponse,
          });
        });
      });

      describe('and the response fails validation', () => {
        beforeEach(() => {
          mockGetOrdersResponse.graycoreGuestOrders.orders = null;
        });

        it('should throw a DaffOrderInvalidAPIResponseError', done => {
          service.list(cartId).pipe(
            catchError(err => {
              expect(err).toEqual(jasmine.any(DaffOrderInvalidAPIResponseError));
              done();
              return [];
            }),
          ).subscribe();

          const op = controller.expectOne(addTypenameToDocument(getGuestOrders([])));

          op.flush({
            data: mockGetOrdersResponse,
          });
        });
      });
    });

    describe('when the call to the Magento API is unsuccessful', () => {
      it('should throw an Error', done => {
        service.list(cartId).pipe(
          catchError(err => {
            expect(err).toEqual(jasmine.any(Error));
            done();
            return [];
          }),
        ).subscribe();

        const op = controller.expectOne(addTypenameToDocument(getGuestOrders([])));

        op.graphqlErrors([new GraphQLError(
          'Can\'t find a cart with that ID.',
          null,
          null,
          null,
          null,
          null,
          { category: 'graphql-no-such-entity' },
        )]);
      });
    });

    afterEach(() => {
      controller.verify();
    });
  });
});
