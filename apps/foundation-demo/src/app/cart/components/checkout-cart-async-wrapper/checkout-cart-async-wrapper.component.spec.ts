import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable ,  of } from 'rxjs';

import { Cart } from '@daffodil/core';
import { DaffCartFactory } from '@daffodil/core/testing';

import { CheckoutCartAsyncWrapperComponent } from './checkout-cart-async-wrapper.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

let cartFactory = new DaffCartFactory();
let cart = cartFactory.create();
let stubCartTitle = 'cartTitle';

@Component({template: '<demo-checkout-cart-async-wrapper [cartTitle]="cartTitleValue" [cart]="cartValue$ | async" [loading]="loadingValue$ | async"><div class="transcluded-content"></div></demo-checkout-cart-async-wrapper>'})
class TestCheckoutCartAsyncWrapper {
  cartValue$: Observable<Cart>;
  loadingValue$: Observable<boolean>;
  cartTitleValue: string;
}

@Component({
  selector: 'demo-checkout-cart',
  template: ''
})
class MockCheckoutCartComponent { 
  @Input() cart: Cart;
  @Input() subtitle: string;
}

@Component({
  selector: 'demo-cart-totals',
  template: ''
})
class MockCartTotalsComponent {
  @Input() cart: Cart;
}

@Component({
  selector: 'demo-help-box',
  template: ''
})
class MockHelpBoxComponent {}

@Component({ selector: 'demo-loading-icon', template: ''})
class MockLoadingIconComponent {}

describe('CheckoutCartAsyncWrapper', () => {
  let component: TestCheckoutCartAsyncWrapper;
  let fixture: ComponentFixture<TestCheckoutCartAsyncWrapper>;
  let checkoutCartAsyncWrapperComponent: CheckoutCartAsyncWrapperComponent;
  let checkoutCartComponent: MockCheckoutCartComponent;
  let cartTotalsComponent: MockCartTotalsComponent;
  let helpBoxComponent: MockHelpBoxComponent;
  let router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [ 
        TestCheckoutCartAsyncWrapper,
        MockCheckoutCartComponent,
        MockCartTotalsComponent,
        MockHelpBoxComponent,
        MockLoadingIconComponent,
        CheckoutCartAsyncWrapperComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCheckoutCartAsyncWrapper);
    router = TestBed.get(Router);
    spyOn(router, 'navigateByUrl');
    component = fixture.componentInstance;
    component.cartValue$ = of(cart);
    component.loadingValue$ = of(false);
    component.cartTitleValue = stubCartTitle;
    
    checkoutCartAsyncWrapperComponent = fixture.debugElement.query(By.css('demo-checkout-cart-async-wrapper')).componentInstance;

    fixture.detectChanges();

    checkoutCartComponent = fixture.debugElement.query(By.css('demo-checkout-cart')).componentInstance;
    cartTotalsComponent = fixture.debugElement.query(By.css('demo-cart-totals')).componentInstance;
    helpBoxComponent = fixture.debugElement.query(By.css('demo-help-box')).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to take cart as input', () => {
    expect(checkoutCartAsyncWrapperComponent.cart).toEqual(cart);
  });

  it('should be able to take loading as input', () => {
    expect(checkoutCartAsyncWrapperComponent.loading).toEqual(false);
  });

  it('should be able to take cartTitle as input', () => {
    expect(checkoutCartAsyncWrapperComponent.cartTitle).toEqual(stubCartTitle);
  });

  it('should be able to take transcluded content', () => {
    expect(fixture.debugElement.query(By.css('.transcluded-content'))).not.toBeNull();
  });

  describe('on <demo-checkout-cart>', () => {
    
    it('should set cart to value passed by cart-container directive', () => {
      expect(checkoutCartComponent.cart).toEqual(cart);
    });

    it('should set subtitle', () => {
      expect(checkoutCartComponent.subtitle).toEqual(stubCartTitle);
    });
  });

  describe('on <demo-cart-totals>', () => {
    
    it('should set cart to value passed by the cart-container directive', () => {
      expect(cartTotalsComponent.cart).toEqual(cart);
    });
  });

  describe('when CartContainer.$loading is false', () => {
    
    it('should render <demo-checkout-cart>', () => {
      expect(checkoutCartComponent).not.toBeNull();
    });

    it('should render <demo-cart-totals>', () => {
      let cartTotalsComponent = fixture.debugElement.query(By.css('demo-cart-totals'))
      expect(cartTotalsComponent).not.toBeNull();
    });

    it('should render <demo-help-box>', () => {
      expect(helpBoxComponent).not.toBeNull();
    });

    it('should not render loading-icon', () => {
      let loadingIcon = fixture.debugElement.query(By.css('.cart-container__loading-icon'));
      
      expect(loadingIcon).toBeNull();
    });
  });

  describe('when CartContainer.$loading is true', () => {

    beforeEach(() => {
      component.loadingValue$ = of(true);
      fixture.detectChanges();
    });
    
    it('should not render <demo-checkout-cart>', () => {
      let checkoutCartComponent = fixture.debugElement.query(By.css('demo-checkout-cart'));

      expect(checkoutCartComponent).toBeNull();
    });

    it('should not render <demo-cart-totals>', () => {
      let cartTotalsComponent = fixture.debugElement.query(By.css('demo-cart-totals'));
      expect(cartTotalsComponent).toBeNull();
    });

    it('should not render <demo-help-box>', () => {
      let helpBoxComponent = fixture.debugElement.query(By.css('demo-help-box'));
      expect(helpBoxComponent).toBeNull();
    });

    it('should render loading-icon', () => {
      let loadingIcon = fixture.debugElement.query(By.css('.checkout-cart-async-wrapper__loading-icon'));
      
      expect(loadingIcon).not.toBeNull();
    });
  });
});
