import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesMap = new Map<number, Category>();
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$: Observable<Category[]> = this.categoriesSubject.asObservable();

  constructor() {
    this.loadCategoriesFromLocalStorage();
  }

  private loadCategoriesFromLocalStorage() {
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    categories.forEach((category: Category) => this.categoriesMap.set(category.id, category));
    this.categoriesSubject.next(Array.from(this.categoriesMap.values()));
  }

  private saveCategoriesToLocalStorage() {
    localStorage.setItem('categories', JSON.stringify(Array.from(this.categoriesMap.values())));
  }

  addCategory(category: Category) {
    this.categoriesMap.set(category.id, category);
    this.saveCategoriesToLocalStorage();
    this.categoriesSubject.next(Array.from(this.categoriesMap.values()));
  }

  removeCategory(categoryId: number) {
    this.categoriesMap.delete(categoryId);
    this.saveCategoriesToLocalStorage();
    this.categoriesSubject.next(Array.from(this.categoriesMap.values()));
  }

  categoryExists(name: string): boolean {
    return Array.from(this.categoriesMap.values()).some(category => category.name.toLowerCase() === name.toLowerCase());
  }

  getCategoryById(id: number): Category | undefined {
    return this.categoriesMap.get(id);
  }
}

export interface Category {
  id: number;
  name: string;
}
