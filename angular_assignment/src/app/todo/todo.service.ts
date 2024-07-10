import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todosSubject = new BehaviorSubject<Todo[]>(this.getTodosFromLocalStorage());
  todos$: Observable<Todo[]> = this.todosSubject.asObservable();

  private getTodosFromLocalStorage(): Todo[] {
    return JSON.parse(localStorage.getItem('todos') || '[]');
  }

  private saveTodosToLocalStorage(todos: Todo[]): void {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  addTodoItem(todo: Todo): void {
    const todos = this.getTodosFromLocalStorage();
    todos.push(todo);
    this.saveTodosToLocalStorage(todos);
    this.todosSubject.next(todos);
  }

  removeTodoItem(todoId: number): void {
    const todos = this.getTodosFromLocalStorage().filter(todo => todo.id !== todoId);
    this.saveTodosToLocalStorage(todos);
    this.todosSubject.next(todos);
  }

  updateTodoItem(updatedTodo: Todo): void {
    const todos = this.getTodosFromLocalStorage().map(todo => todo.id === updatedTodo.id ? updatedTodo : todo);
    this.saveTodosToLocalStorage(todos);
    this.todosSubject.next(todos);
  }
}

export interface Todo {
  id: number;
  title: string;
  categoryId: number;
}
