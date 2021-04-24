import { AfterViewInit, ChangeDetectorRef, OnDestroy, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Resource, ResourceBaseService } from '@my-everyday-lolita/mel-shared';
import { Subject } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { ConfirmDeleteComponent } from '../form/confirm-delete/confirm-delete.component';
import { EditableExpandableItem, EditableItem, Item } from '../form/form.model';

export class ResourcesListPage<T extends Resource> {
  buildForm(resource?: T): FormGroup {
    return new FormGroup({});
  }

  onUpdate(item: EditableItem<T>, response: T): void { }
  onCreate(item: EditableItem<T>, response: T, dialogRef?: MatDialogRef<TemplateRef<any>>): void { }
}

export type Constructor<T = {}> = new (...args: any[]) => T;

export interface ResourcesListPageTypeDef<T extends Resource> extends ResourcesListPage<T> {
  resultsLength: number;
  resources: Item<T>[];
  addResourceTemplate?: TemplateRef<any>;
  paginator: MatPaginator;
  dataSource: MatTableDataSource<Item<T>>;
  delete(item: Item<T>): void;
  add(): void;
  update(item: Item<T>): void;
  create(item: Item<T>, dialogRef?: MatDialogRef<TemplateRef<any>>): void;
  toEditableExpandableItem(items: T[]): EditableExpandableItem<T>[];
  resetPaging(): void;
}

export function ResourcesListPageMixin<T extends Resource>(
  BaseClass: Constructor<ResourcesListPage<T>>
): Constructor<ResourcesListPageTypeDef<T> & OnDestroy & AfterViewInit> {
  return class extends BaseClass implements ResourcesListPageTypeDef<T>, OnDestroy, AfterViewInit {
    resources: Item<T>[] = [];
    resultsLength = 0;
    addResourceTemplate?: TemplateRef<any>;
    paginator!: MatPaginator;
    sort!: MatSort;
    dataSource!: MatTableDataSource<Item<T>>;

    protected unsubscriber = new Subject();
    protected dialog!: MatDialog;
    protected service!: ResourceBaseService<T>;
    protected cdRef!: ChangeDetectorRef;

    ngOnDestroy(): void {
      this.unsubscriber.next();
      this.unsubscriber.complete();
    }

    ngAfterViewInit(): void {
      this.dataSource = new MatTableDataSource();
      this.resultsLength = this.resources.length;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item, sortHeaderId) => {
        if (sortHeaderId in item) {
          return (item as any)[sortHeaderId];
        } else if (sortHeaderId in item.data) {
          return (item.data as any)[sortHeaderId];
        }
        throw new Error(`Sort header identifier ${sortHeaderId} not found`);
      };
      this.dataSource.sortData = (data, sort) => {
        const active = sort.active;
        const direction = sort.direction;
        if (!active || direction === '') { return data; }

        return data.sort((a, b) => {
          let valueA = this.dataSource.sortingDataAccessor(a, active);
          let valueB = this.dataSource.sortingDataAccessor(b, active);

          const valueAType = typeof valueA;
          const valueBType = typeof valueB;

          if (valueAType !== valueBType) {
            if (valueAType === 'number') { valueA += ''; }
            if (valueBType === 'number') { valueB += ''; }
          }

          let comparatorResult = 0;
          if (valueA != null && valueB != null) {
            valueA = (valueA as string).toLowerCase();
            valueB = (valueB as string).toLowerCase();
            // Check if one value is greater than the other; if equal, comparatorResult should remain 0.
            if (valueA > valueB) {
              comparatorResult = 1;
            } else if (valueA < valueB) {
              comparatorResult = -1;
            }
          } else if (valueA != null) {
            comparatorResult = 1;
          } else if (valueB != null) {
            comparatorResult = -1;
          }
          return comparatorResult * (direction === 'asc' ? 1 : -1);
        });
      };
      this.dataSource.data = this.resources;
      this.cdRef.detectChanges();
    }

    delete(item: Item<T>): void {
      this.dialog.open(ConfirmDeleteComponent, {
        data: { token: item.data._id },
      }).afterClosed().pipe(
        filter(shouldDelete => shouldDelete === true),
        switchMap(() => this.service.delete(item.data._id as string, true))
      ).subscribe({
        next: () => {
          this.resources = this.resources.filter(resource => resource.data._id !== item.data._id);
          this.dataSource.data = this.resources;
        }
      });
    }

    add(): void {
      if (this.addResourceTemplate) {
        this.dialog.open(this.addResourceTemplate, {
          data: {
            form: this.buildForm(),
          },
          disableClose: true
        });
      }
    }

    update(item: EditableItem<T>): void {
      this.service.update(item.form.value, true).subscribe({
        next: response => {
          this.onUpdate(item, response);
        }
      });
    }

    create(item: EditableItem<T>, dialogRef?: MatDialogRef<TemplateRef<any>>): void {
      this.service.create(item.form.value).subscribe({
        next: response => {
          item.data = item.data = response;
          item.nbItems = 0;
          this.resources.push(item);
          // Update table display.
          this.dataSource.data = this.resources;
          this.onCreate(item, response, dialogRef);
        }
      });
    }

    toEditableExpandableItem(items: T[]): EditableExpandableItem<T>[] {
      return items.map((resource: T) => {
        return {
          data: resource,
          expanded: false,
          form: this.buildForm(resource),
        };
      });
    }

    resetPaging(): void {
      this.paginator.pageIndex = 0;
    }
  };
}
