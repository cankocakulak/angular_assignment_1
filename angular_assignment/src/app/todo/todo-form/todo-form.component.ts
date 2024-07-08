import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService, Category } from '../../category/category.service';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent implements OnInit {
  todoForm: FormGroup;
  categories: Category[] = [];

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
    this.categoryService.categories$.subscribe(categories => this.categories = categories);
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      const newTodo = {
        id: Date.now(),
        title: this.todoForm.value.title,
        categoryId: this.todoForm.value.categoryId
      };
      this.todoService.addTodoItem(newTodo);
      this.todoForm.reset();
    }
  }
}
