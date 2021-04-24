import { trigger, state, style, transition, animate } from '@angular/animations';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Color, ItemsService, ResourcesColorsService, Stats } from '@my-everyday-lolita/mel-shared';
import { Observable, Subject } from 'rxjs';
import { startWith, map, takeUntil, filter, switchMap } from 'rxjs/operators';
import { ConfirmDeleteComponent } from 'src/app/features/form/confirm-delete/confirm-delete.component';
import { EditableExpandableItem } from 'src/app/features/form/form.model';

@Component({
  templateUrl: './resources-colors.component.html',
  styleUrls: ['./resources-colors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('expandable', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class ResourcesColorsComponent implements AfterViewInit, OnDestroy {

  resources: EditableExpandableItem<Color>[];
  displayedColumns: string[] = ['name', 'hex', 'nbItems', 'actions'];
  resultsLength: number;
  pagedItems!: Observable<EditableExpandableItem<Color>[]>;
  pageSize = localStorage.getItem('pageSize') || 10;
  pageSizeOptions = [10, 20, 50];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private unsubscriber = new Subject();

  constructor(
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private service: ResourcesColorsService,
    private dialog: MatDialog,
    private itemsService: ItemsService
  ) {
    this.resources = JSON.parse(JSON.stringify(this.activatedRoute.snapshot.data.colors)).map((brand: Color) => {
      return {
        data: brand,
        expanded: false,
        form: this.fb.group({
          name: [brand.name, Validators.required],
          hex: [brand.hex],
          _id: [brand._id, Validators.required],
        }),
      };
    });

    this.resultsLength = this.resources.length;

    this.itemsService.stats().subscribe({
      next: (result) => {
        result.forEach(stats => {
          const resourceStats = ((stats as any)[this.service.resource] as Stats[]) || [];
          resourceStats.forEach(stat => {
            const resource = this.resources.find(r => r.data._id === stat._id._id);
            if (resource) {
              resource.nbItems = stat.count || 0;
            }
          });
        });
        this.cdRef.detectChanges();
      }
    });
  }

  ngAfterViewInit(): void {
    this.pagedItems = this.paginator.page.pipe(
      startWith({}),
      map(() => {
        localStorage.setItem('pageSize', this.paginator.pageSize.toString());
        const start = this.paginator.pageIndex * this.paginator.pageSize;
        const end = start + this.paginator.pageSize;
        return this.resources.slice(start, end);
      }),
      takeUntil(this.unsubscriber)
    );
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  delete(item: EditableExpandableItem<Color>): void {
    this.dialog.open(ConfirmDeleteComponent, {
      data: { token: item.data._id },
    }).afterClosed().pipe(
      filter(shouldDelete => shouldDelete === true),
      switchMap(() => this.service.delete(item.data._id as string, true))
    ).subscribe({
      next: () => { }
    });
  }

  update(item: EditableExpandableItem<Color>): void {
    this.service.update(item.form.value, true).subscribe({
      next: response => {
        item.data = response;
        item.form.setValue({
          name: response.name,
          hex: response.hex,
          _id: response._id,
        });
        item.expanded = false;
      }
    });
  }

}
