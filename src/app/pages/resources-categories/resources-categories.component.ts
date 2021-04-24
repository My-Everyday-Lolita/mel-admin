import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Brand, Category } from '@my-everyday-lolita/mel-shared';
import { Observable, Subject } from 'rxjs';
import { startWith, map, takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: './resources-categories.component.html',
  styleUrls: ['./resources-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourcesCategoriesComponent implements AfterViewInit, OnDestroy {

  categories: Category[];
  displayedColumns: string[] = ['name', 'actions'];
  resultsLength: number;
  pagedItems!: Observable<Category[]>;
  pageSize = localStorage.getItem('pageSize') || 10;
  pageSizeOptions = [10, 20, 50];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private unsubscriber = new Subject();

  constructor(
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {
    this.categories = this.activatedRoute.snapshot.data.categories;
    this.resultsLength = this.categories.length;
  }

  ngAfterViewInit(): void {
    this.pagedItems = this.paginator.page.pipe(
      startWith({}),
      map(() => {
        localStorage.setItem('pageSize', this.paginator.pageSize.toString());
        const start = this.paginator.pageIndex * this.paginator.pageSize;
        const end = start + this.paginator.pageSize;
        return this.categories.slice(start, end);
      }),
      takeUntil(this.unsubscriber)
    );
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  delete(item: Brand): void {
    console.log(item);
  }

}
