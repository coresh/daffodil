import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';

import { DaffodilAddress } from '@daffodil/core';
import { DaffAddressFactory } from '@daffodil/core/testing';

import { ShippingSummaryComponent } from './shipping-summary.component';
import { ShippingOptionsService } from '../shipping-options/components/services/shipping-options.service';
import { ShippingOptionsFactory } from '../shipping-options/components/factories/shipping-options.factory';

let daffodilAddressFactory = new DaffAddressFactory();
let stubDaffodilAddress = daffodilAddressFactory.create();

@Component({
  template: '<demo-shipping-summary [selectedShippingOptionId]="selectedShippingOptionIdValue" ' + 
              '[shippingAddress]="shippingAddressValue" ' + 
              '(editShippingInfo)="editShippingInfoFunction()"></demo-shipping-summary>'})
class TestShippingSummaryWrapper {
  shippingAddressValue: DaffodilAddress = stubDaffodilAddress;
  selectedShippingOptionIdValue: string = '0';
  editShippingInfoFunction: Function = () => {};
}

@Component({selector: 'demo-address-summary', template: ''})
class MockAddressSummaryComponent {
  @Input() address: DaffodilAddress;
}

describe('ShippingSummaryComponent', () => {
  let component: TestShippingSummaryWrapper;
  let fixture: ComponentFixture<TestShippingSummaryWrapper>;
  let shippingSummaryComponent: ShippingSummaryComponent;
  let addressSummaryComponent: MockAddressSummaryComponent;
  let shippingOptionsService: ShippingOptionsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestShippingSummaryWrapper,
        ShippingSummaryComponent,
        MockAddressSummaryComponent
      ],
      providers: [
        ShippingOptionsService,
        ShippingOptionsFactory
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestShippingSummaryWrapper);
    shippingOptionsService = TestBed.get(ShippingOptionsService);
    component = fixture.componentInstance;
    fixture.detectChanges();

    shippingSummaryComponent = fixture.debugElement.query(By.css('demo-shipping-summary')).componentInstance;
    addressSummaryComponent = fixture.debugElement.query(By.css('demo-address-summary')).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to take shippingAddress', () => {
    expect(shippingSummaryComponent.shippingAddress).toEqual(stubDaffodilAddress);
  });

  it('should be able to take selectedShippingOptionId', () => {
    expect(shippingSummaryComponent.selectedShippingOptionId).toEqual(component.selectedShippingOptionIdValue);
  });

  it('should set shippingOptions', () => {
    expect(shippingSummaryComponent.shippingOptions).toEqual(shippingOptionsService.getShippingOptions());
  });

  describe('on <demo-address-summary>', () => {

    it('should set address', () => {
      expect(addressSummaryComponent.address).toEqual(stubDaffodilAddress);
    });
  });

  describe('when edit anchor tag is clicked', () => {
    
    it('should call onEdit', () => {
      spyOn(shippingSummaryComponent, 'onEdit');

      fixture.debugElement.query(By.css('a')).nativeElement.click();

      expect(shippingSummaryComponent.onEdit).toHaveBeenCalled();
    });
  });

  describe('onEdit', () => {
    
    it('should call editShippingInfo.emit', () => {
      spyOn(shippingSummaryComponent.editShippingInfo, 'emit');

      shippingSummaryComponent.onEdit();

      expect(shippingSummaryComponent.editShippingInfo.emit).toHaveBeenCalled();
    });
  });

  describe('when editShippingInfo is emitted', () => {

    it('should call editShippingInfoFunction', () => {
      spyOn(component, 'editShippingInfoFunction');

      shippingSummaryComponent.editShippingInfo.emit();

      expect(component.editShippingInfoFunction).toHaveBeenCalled();
    });
  });
});
