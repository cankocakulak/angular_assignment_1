import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
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
  todosForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private categoryService: CategoryService
  ) {
    this.filterForm = this.fb.group({
      category: [''],
      search: ['']
    });

    this.todosForm = this.fb.group({
      todos: this.fb.array([])
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

    this.todos$.subscribe(todos => this.setTodos(todos));
  }

  get todos(): FormArray {
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
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  removeTodoItem(index: number): void {
    this.todos.removeAt(index);
  }

  saveChanges(): void {
    if (this.todosForm.valid) {
      const updatedTodos: Todo[] = this.todosForm.value.todos;
      updatedTodos.forEach((todo: Todo) => {
        this.todoService.updateTodoItem(todo);
      });
      this.todosForm.markAsPristine(); // Mark form as pristine after save
    }
  }
}
