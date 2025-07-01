import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagMultipleItemsComponent } from './tag-multiple-items.component';

describe('TagMultipleItemsComponent', () => {
  let component: TagMultipleItemsComponent;
  let fixture: ComponentFixture<TagMultipleItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagMultipleItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagMultipleItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
