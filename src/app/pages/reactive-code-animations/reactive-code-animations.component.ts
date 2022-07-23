import { Component, OnInit } from '@angular/core';


interface MenuItem {
  name: string;
  path: string;
}

@Component({
  selector: 'reactive-code-animations',
  templateUrl: './reactive-code-animations.component.html',
  styleUrls: ['./reactive-code-animations.component.scss']
})
export class ReactiveCodeAnimationsComponent implements OnInit {
  menuItems: MenuItem[] = [
    { name: 'Click Counter', path: 'click-counter' },
    { name: 'Series', path: 'series' },
    { name: 'Carousel', path: 'carousel' },
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
