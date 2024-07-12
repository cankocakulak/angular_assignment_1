import { Component, OnDestroy, OnInit } from '@angular/core';
import { Todo, TodoService } from './todo.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit, OnDestroy {
  filteredTodos: Todo[] = [];
  private filterSubject = new BehaviorSubject<{ category: string, search: string }>({ category: '', search: '' });
  private destroy$ = new Subject<void>();
  private todos: Todo[] = [];
  private categoryMap: Map<number, Todo[]> = new Map();

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.todos$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(todos => {
      this.todos = todos;
      this.initializeCategoryMap();
      this.applyFilter(this.filterSubject.getValue());
    });

    this.filterSubject.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe(filter => {
      this.applyFilter(filter);
    });
  }

  initializeCategoryMap(): void {
    this.categoryMap.clear();
    for (const todo of this.todos) {
      if (!this.categoryMap.has(todo.categoryId)) {
        this.categoryMap.set(todo.categoryId, []);
      }
      this.categoryMap.get(todo.categoryId)?.push(todo);
    }
  }

  applyFilter(filter: { category: string, search: string }): void {
    let filteredTodos = this.todos;
    if (filter.category) {
      const categoryId = +filter.category;
      filteredTodos = this.categoryMap.get(categoryId) || [];
    }
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filteredTodos = filteredTodos.filter(todo => todo.title.toLowerCase().includes(searchLower));
    }
    this.filteredTodos = filteredTodos;
    console.log('Filtered todos:', this.filteredTodos);
  }

  onFilterChange(filter: { category: string, search: string }) {
    this.filterSubject.next(filter);
    console.log('Filter changed:', filter);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
