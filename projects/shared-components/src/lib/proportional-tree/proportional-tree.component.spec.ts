import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProportionalTreeComponent } from './proportional-tree.component';

describe('ProportionalTreeComponent', () => {
  let component: ProportionalTreeComponent;
  let fixture: ComponentFixture<ProportionalTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProportionalTreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProportionalTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
