import { Component, OnInit } from '@angular/core';
import { CategoryService, Category } from '../category.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories$: Observable<Category[]>;

  constructor(private categoryService: CategoryService) {
    this.categories$ = this.categoryService.categories$;
  }

  ngOnInit(): void {}

  removeCategory(categoryId: number): void {
    this.categoryService.removeCategory(categoryId);
  }
}
