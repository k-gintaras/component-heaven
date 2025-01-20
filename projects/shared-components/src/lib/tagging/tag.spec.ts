import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagManagerComponent } from './tag-manager/tag-manager.component';
import { Tag } from './tag.interface';
import { TagService } from './tag.service';
import { of } from 'rxjs';

describe('TagManagerComponent', () => {
  let component: TagManagerComponent;
  let fixture: ComponentFixture<TagManagerComponent>;
  let mockTagService: jasmine.SpyObj<TagService>;

  beforeEach(async () => {
    mockTagService = jasmine.createSpyObj('TagService', [
      'setCurrentItem',
      'setTagGroups',
    ]);

    // Mock observables used in TagDataComponent
    mockTagService.tagGroups$ = of([]);
    mockTagService.currentItem$ = of(null);

    await TestBed.configureTestingModule({
      imports: [TagManagerComponent],
      providers: [{ provide: TagService, useValue: mockTagService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TagManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct data', () => {
    component.items = [
      { id: '1', name: 'Item 1', tags: [] },
      { id: '2', name: 'Item 2', tags: [] },
    ];
    component.tagGroups = [{ id: 'group1', name: 'Group 1', tags: [] }];

    component.ngOnInit();

    expect(mockTagService.setTagGroups).toHaveBeenCalledWith([
      { id: 'group1', name: 'Group 1', tags: [] },
    ]);
    expect(mockTagService.setCurrentItem).toHaveBeenCalledWith({
      id: '1',
      name: 'Item 1',
      tags: [],
    });
  });

  it('should add a tag to the current item', () => {
    const mockTag: Tag = { id: '1', name: 'Test Tag', group: 'group1' };
    component.items = [
      { id: '1', name: 'Item 1', tags: [] },
      { id: '2', name: 'Item 2', tags: [] },
    ];
    component.currentIndex = 0;

    component.onTagAdded(mockTag);

    expect(component.items[0].tags).toContain(mockTag);
  });

  it('should remove a tag from the current item', () => {
    const mockTag: Tag = { id: '1', name: 'Test Tag', group: 'group1' };
    component.items = [
      { id: '1', name: 'Item 1', tags: [mockTag] },
      { id: '2', name: 'Item 2', tags: [] },
    ];
    component.currentIndex = 0;

    component.onTagRemoved(mockTag);

    expect(component.items[0].tags).not.toContain(mockTag);
  });

  it('should move to the next item', () => {
    component.items = [
      { id: '1', name: 'Item 1', tags: [] },
      { id: '2', name: 'Item 2', tags: [] },
    ];
    component.currentIndex = 0;

    component.moveToNextItem();

    expect(component.currentIndex).toBe(1);
    expect(mockTagService.setCurrentItem).toHaveBeenCalledWith({
      id: '2',
      name: 'Item 2',
      tags: [],
    });
  });

  it('should not move to the next item if at the last item', () => {
    component.items = [
      { id: '1', name: 'Item 1', tags: [] },
      { id: '2', name: 'Item 2', tags: [] },
    ];
    component.currentIndex = 1;

    component.moveToNextItem();

    expect(component.currentIndex).toBe(1);
    expect(mockTagService.setCurrentItem).not.toHaveBeenCalledWith({
      id: '2',
      name: 'Item 2',
      tags: [],
    });
  });

  it('should move to the previous item', () => {
    component.items = [
      { id: '1', name: 'Item 1', tags: [] },
      { id: '2', name: 'Item 2', tags: [] },
    ];
    component.currentIndex = 1;

    component.moveToPreviousItem();

    expect(component.currentIndex).toBe(0);
    expect(mockTagService.setCurrentItem).toHaveBeenCalledWith({
      id: '1',
      name: 'Item 1',
      tags: [],
    });
  });

  it('should not move to the previous item if at the first item', () => {
    component.items = [
      { id: '1', name: 'Item 1', tags: [] },
      { id: '2', name: 'Item 2', tags: [] },
    ];
    component.currentIndex = 0;

    component.moveToPreviousItem();

    expect(component.currentIndex).toBe(0);
    expect(mockTagService.setCurrentItem).not.toHaveBeenCalledWith({
      id: '1',
      name: 'Item 1',
      tags: [],
    });
  });
});
