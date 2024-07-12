import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todosMap: Map<number, Todo>;
  private todosSubject: BehaviorSubject<Todo[]>;
  todos$: Observable<Todo[]>;

  constructor() {
    this.todosMap = this.getTodosFromLocalStorage();
    this.todosSubject = new BehaviorSubject<Todo[]>(Array.from(this.todosMap.values()));
    this.todos$ = this.todosSubject.asObservable();
  }

  private getTodosFromLocalStorage(): Map<number, Todo> {
    const todosArray = JSON.parse(localStorage.getItem('todos') || '[]');
    return new Map(todosArray.map((todo: Todo) => [todo.id, todo]));
  }

  private saveTodosToLocalStorage(): void {
    const todosArray = Array.from(this.todosMap.values());
    localStorage.setItem('todos', JSON.stringify(todosArray));
  }

  addTodoItem(todo: Todo): void {
    this.todosMap.set(todo.id, todo);
    this.saveTodosToLocalStorage();
    this.todosSubject.next(Array.from(this.todosMap.values()));
  }

  removeTodoItem(todoId: number): void {
    this.todosMap.delete(todoId);
    this.saveTodosToLocalStorage();
    this.todosSubject.next(Array.from(this.todosMap.values()));
  }

  updateTodoItem(updatedTodo: Todo): void {
    this.todosMap.set(updatedTodo.id, updatedTodo);
    this.saveTodosToLocalStorage();
    this.todosSubject.next(Array.from(this.todosMap.values()));
  }

  updateTodos(updatedTodos: Todo[]): void {
    this.todosMap.clear();
    updatedTodos.forEach(todo => this.todosMap.set(todo.id, todo));
    this.saveTodosToLocalStorage();
    this.todosSubject.next(Array.from(this.todosMap.values()));
  }
}

export interface Todo {
  id: number;
  title: string;
  categoryId: number;
}
