/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EmeiComponent } from './emei.component';

describe('EmeiComponent', () => {
  let component: EmeiComponent;
  let fixture: ComponentFixture<EmeiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmeiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmeiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
