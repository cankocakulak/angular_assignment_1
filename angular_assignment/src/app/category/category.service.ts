import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesSubject = new BehaviorSubject<Category[]>(this.getCategoriesFromLocalStorage());
  categories$: Observable<Category[]> = this.categoriesSubject.asObservable();

  private getCategoriesFromLocalStorage(): Category[] {
    return JSON.parse(localStorage.getItem('categories') || '[]');
  }

  private saveCategoriesToLocalStorage(categories: Category[]): void {
    localStorage.setItem('categories', JSON.stringify(categories));
  }

  addCategory(category: Category): void {
    const categories = this.getCategoriesFromLocalStorage();
    categories.push(category);
    this.saveCategoriesToLocalStorage(categories);
    this.categoriesSubject.next(categories);
  }

  removeCategory(categoryId: number): void {
    const categories = this.getCategoriesFromLocalStorage().filter(category => category.id !== categoryId);
    this.saveCategoriesToLocalStorage(categories);
    this.categoriesSubject.next(categories);
  }

  categoryExists(name: string): boolean {
    const categories = this.getCategoriesFromLocalStorage();
    return categories.some(category => category.name.toLowerCase() === name.toLowerCase());
  }
}

export interface Category {
  id: number;
  name: string;
}

