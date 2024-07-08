import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent {
  categoryForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private categoryService: CategoryService) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.categoryForm.valid) {
      const categoryName = this.categoryForm.value.name.trim();
      if (this.categoryService.categoryExists(categoryName)) {
        this.errorMessage = 'Category with the same name already exists!';
      } else {
        const newCategory = {
          id: Date.now(),
          name: categoryName
        };
        this.categoryService.addCategory(newCategory);
        this.categoryForm.reset();
      }
    }
  }
}
