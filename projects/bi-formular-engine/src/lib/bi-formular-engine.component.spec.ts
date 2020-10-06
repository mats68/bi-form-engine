import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiFormularEngineComponent } from './bi-formular-engine.component';

describe('BiFormularEngineComponent', () => {
  let component: BiFormularEngineComponent;
  let fixture: ComponentFixture<BiFormularEngineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiFormularEngineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiFormularEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
