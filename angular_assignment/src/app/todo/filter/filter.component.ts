import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, startWith, takeUntil } from 'rxjs/operators';
import { CategoryService, Category } from '../../category/category.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {
  @Output() filterChange = new EventEmitter<{ category: string, search: string }>();
  filterForm: FormGroup;
  categories: Category[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.filterForm = this.fb.group({
      category: [''],
      search: ['']
    });
  }

  ngOnInit(): void {
    this.categoryService.categories$
      .pipe(takeUntil(this.destroy$))
      .subscribe(categories => this.categories = categories);

    this.filterForm.valueChanges
      .pipe(
        startWith(this.filterForm.value),
        debounceTime(500),
        takeUntil(this.destroy$)
      )
      .subscribe(value => this.filterChange.emit(value));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
