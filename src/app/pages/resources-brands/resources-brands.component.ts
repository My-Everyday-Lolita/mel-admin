import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Brand, ItemsService, ResourcesBrandsService } from '@my-everyday-lolita/mel-shared';
import { rowAnimation } from 'src/app/features/animations/fix-mat-table-route-transition';
import { EditableExpandableItem, Item } from 'src/app/features/form/form.model';
import { ResourcesListPage, ResourcesListPageMixin } from 'src/app/features/resources/resources-list-page.abstract';

export class BrandResourcesListPage extends ResourcesListPage<Brand> {
  buildForm(resource?: Brand): FormGroup {
    const form = super.buildForm(resource);
    form.addControl('name', new FormControl(resource && resource.name || '', [Validators.required]));
    form.addControl('shortname', new FormControl(resource && resource.shortname || ''));
    if (resource && resource._id) {
      form.addControl('_id', new FormControl(resource._id || '', [Validators.required]));
    }
    return form;
  }

  onUpdate(item: EditableExpandableItem<Brand>, response: Brand): void {
    super.onUpdate(item, response);
    item.data = response;
    item.form.setValue({
      name: response.name,
      shortname: response.shortname,
      _id: response._id,
    });
    item.expanded = false;
  }

  onCreate(item: EditableExpandableItem<Brand>, response: Brand, dialogRef?: MatDialogRef<TemplateRef<any>>): void {
    if (dialogRef) {
      dialogRef.close();
    }
  }
}

@Component({
  templateUrl: './resources-brands.component.html',
  styleUrls: ['./resources-brands.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    rowAnimation,
    trigger('expandable', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class ResourcesBrandsComponent extends ResourcesListPageMixin<Brand>(BrandResourcesListPage) {

  displayedColumns: string[] = ['name', 'nbItems', 'actions'];
  pageSize = localStorage.getItem('pageSize') || 10;
  pageSizeOptions = [10, 20, 50];
  resources: Item<Brand>[];
  dataSource!: MatTableDataSource<Item<Brand>>;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('addResourceDialog', { static: true }) addResourceTemplate!: TemplateRef<any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    protected cdRef: ChangeDetectorRef,
    protected service: ResourcesBrandsService,
    protected dialog: MatDialog,
    protected itemsService: ItemsService
  ) {
    super();

    this.resources = this.toEditableExpandableItem(JSON.parse(JSON.stringify(this.activatedRoute.snapshot.data.brands)));


    // this.itemsService.stats().subscribe({
    //   next: (result) => {
    //     result.forEach(stats => {
    //       const resourceStats = ((stats as any)[this.service.resource] as Stats[]) || [];
    //       resourceStats.forEach(stat => {
    //         const resource = this.resources.find(r => r.data._id === stat._id._id);
    //         if (resource) {
    //           resource.nbItems = stat.count || 0;
    //         }
    //       });
    //     });
    //     this.cdRef.detectChanges();
    //   }
    // });
  }

}
