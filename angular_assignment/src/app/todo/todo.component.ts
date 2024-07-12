import { Component, OnDestroy } from '@angular/core';
import { Todo, TodoService } from './todo.service';
import { Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnDestroy {
  filteredTodos: Todo[] = [];
  private filterSubject = new Subject<{ category: string, search: string }>();
  private destroy$ = new Subject<void>();

  constructor(private todoService: TodoService) {
    this.filterSubject.pipe(
      debounceTime(300),
      map(filter => {
        const searchLower = filter.search.toLowerCase();
        return (todos: Todo[]) => todos.filter(todo => {
          const matchesCategory = filter.category ? todo.categoryId === +filter.category : true;
          const matchesSearch = searchLower ? todo.title.toLowerCase().includes(searchLower) : true;
          return matchesCategory && matchesSearch;
        });
      }),
      takeUntil(this.destroy$)
    ).subscribe(filterFn => {
      this.todoService.todos$.pipe(
        map(todos => filterFn(todos))
      ).subscribe(filteredTodos => {
        this.filteredTodos = filteredTodos;
        console.log('Filtered todos:', this.filteredTodos);
      });
    });
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
