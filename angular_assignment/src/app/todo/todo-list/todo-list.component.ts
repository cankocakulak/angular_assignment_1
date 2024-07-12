import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { TodoService, Todo } from '../todo.service';
import { CategoryService, Category } from '../../category/category.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() todos: Todo[] = [];
  categories: Category[] = [];
  todosForm: FormGroup;
  removedTodos: number[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private categoryService: CategoryService
  ) {
    this.todosForm = this.fb.group({
      todos: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.categoryService.categories$
      .pipe(takeUntil(this.destroy$))
      .subscribe(categories => {
        this.categories = categories;
      });

    this.setTodos(this.todos);
  }

  ngOnChanges(): void {
    this.setTodos(this.todos);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get todosArray(): FormArray {
    return this.todosForm.get('todos') as FormArray;
  }

  setTodos(todos: Todo[]): void {
    const todoFGs = todos.map(todo => this.fb.group({
      id: [todo.id],
      title: [todo.title],
      categoryId: [todo.categoryId]
    }));
    const todoFormArray = this.fb.array(todoFGs);
    this.todosForm.setControl('todos', todoFormArray);
  }

  getCategoryName(categoryId: number): string {
    const category = this.categoryService.getCategoryById(categoryId);
    return category ? category.name : 'Unknown';
  }

  removeTodoItem(index: number): void {
    const todoId = this.todosArray.at(index).value.id;
    this.todosArray.removeAt(index);
    this.todosForm.markAsDirty();
    this.removedTodos.push(todoId);
  }

  saveChanges(): void {
    if (this.todosForm.valid) {
      const updatedTodos: Todo[] = this.todosForm.value.todos;
      // Filter out the removed todos from the updated list
      const finalTodos = updatedTodos.filter(todo => !this.removedTodos.includes(todo.id));
      this.todoService.updateTodos(finalTodos);
      this.todosForm.markAsPristine();
      this.removedTodos = [];
    }
  }
}
