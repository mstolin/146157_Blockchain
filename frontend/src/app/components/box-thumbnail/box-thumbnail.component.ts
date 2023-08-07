import { Component, Input } from '@angular/core';
import Box from 'src/app/models/box';

@Component({
  selector: 'app-box-thumbnail',
  templateUrl: './box-thumbnail.component.html',
  styleUrls: ['./box-thumbnail.component.css']
})
export class BoxThumbnailComponent {

  @Input() box!: Box;

}
