import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService, Category } from '../../category/category.service';
import { TodoService } from '../todo.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent implements OnInit, OnDestroy {
  todoForm: FormGroup;
  categories: Category[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private todoService: TodoService
  ) {
    this.todoForm = this.fb.group({
      title: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.categoryService.categories$
      .pipe(takeUntil(this.destroy$))
      .subscribe(categories => this.categories = categories);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      const newTodo = {
        id: Date.now(),
        title: this.todoForm.value.title,
        categoryId: Number(this.todoForm.value.categoryId) // Convert to number
      };
      console.log('Adding ToDo:', newTodo); // Debugging
      this.todoService.addTodoItem(newTodo);
      this.todoForm.reset();
    }
  }
}
