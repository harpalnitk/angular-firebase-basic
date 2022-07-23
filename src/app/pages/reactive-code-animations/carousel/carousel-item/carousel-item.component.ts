
import { transition, trigger, useAnimation } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { fadeOutAnimation} from './../../../../shared/animations/fade.animation';
import { dropInAnimation} from './../../../../shared/animations/drop.animation';
import { CarouselState } from '../carousel/carousel.utils';

@Component({
  selector: 'carousel-item',
  templateUrl: './carousel-item.component.html',
  styleUrls: ['./carousel-item.component.scss'],
  animations: [
    trigger('fadeToCenter1', [
      transition(':enter', [
        useAnimation(dropInAnimation, {
          params: {
            startPos: '-50px, -50px',
            time: '500ms 600ms ease-out',
          },
        }),
      ]),
      transition(':leave', [useAnimation(fadeOutAnimation)]),
    ]),
    trigger('fadeToCenter2', [
      transition(':enter', [
        useAnimation(dropInAnimation, {
          params: {
            startPos: '50px, 50px',
            time: '500ms 800ms ease-out',
          },
        }),
      ]),
      transition(':leave', [useAnimation(fadeOutAnimation)]),
    ]),
    trigger('fadeToCenter3', [
      transition(':enter', [
        useAnimation(dropInAnimation, {
          params: {
            startPos: '50px, -50px',
            time: '500ms 1000ms ease-out',
          },
        }),
      ]),
      transition(':leave', [useAnimation(fadeOutAnimation)]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselItemComponent {
  @Input() state: CarouselState;
  @Input() activeState: CarouselState;
}
