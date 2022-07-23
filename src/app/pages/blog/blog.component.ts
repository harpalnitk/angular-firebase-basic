import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  constructor() { }
  links = [
    {url:'posts', name:'Posts By Category'},
  {url:'user',name: 'Posts By User'},
  {url:'grouped', name: 'Posts Grouped By Category'}];
  activeLink = this.links[0].url;
  ngOnInit(): void {
  }

}
