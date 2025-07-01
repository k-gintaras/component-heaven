import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TagMultipleItemsComponent } from '../../../shared-components/src/lib/tagging/tag-multiple-items/tag-multiple-items.component';
import {
  getTestItems,
  getTestTagMatrix,
} from '../../../shared-components/src/lib/tagging/test-data';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TagMultipleItemsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'demo';
  tagGroups = getTestTagMatrix(5, 10); // 5 groups, 10 tags each
  items = getTestItems(10, 3, this.tagGroups);
}
