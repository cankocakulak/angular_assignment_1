import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TodoService, Todo } from '../todo.service';
import { CategoryService, Category } from '../../category/category.service';
import { combineLatest, Observable, of } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  todos$: Observable<Todo[]> = of([]); // Başlatma
  categories: Category[] = [];
  filterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private categoryService: CategoryService
  ) {
    this.filterForm = this.fb.group({
      category: [''],
      search: ['']
    });
  }

  ngOnInit(): void {
    this.categoryService.categories$.subscribe(categories => this.categories = categories);

    const category$ = this.filterForm.get('category')!.valueChanges.pipe(startWith(''));
    const search$ = this.filterForm.get('search')!.valueChanges.pipe(
      startWith(''),
      debounceTime(500)
    );

    this.todos$ = combineLatest([this.todoService.todos$, category$, search$]).pipe(
      map(([todos, category, search]) => {
        return todos.filter(todo => {
          const matchesCategory = category ? todo.categoryId === +category : true;
          const matchesSearch = search ? todo.title.toLowerCase().includes(search.toLowerCase()) : true;
          return matchesCategory && matchesSearch;
        });
      })
    );
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    console.log('Category ID:', categoryId, 'Category:', category); // Debugging için ekleyin
    return category ? category.name : 'Unknown';
  }

  removeTodo(todoId: number): void {
    this.todoService.removeTodoItem(todoId);
  }
}
