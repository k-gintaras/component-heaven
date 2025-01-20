import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TagManagerComponent } from '../../../shared-components/src/lib/tagging/tag-manager/tag-manager.component';
import { getTestTagMatrix, getTestItems } from 'shared-components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TagManagerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'demo';
  tagGroups = getTestTagMatrix(5, 10); // 5 groups, 10 tags each
  items = getTestItems(10, 3, this.tagGroups);
}
