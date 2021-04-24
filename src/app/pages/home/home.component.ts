import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ItemsService } from '@my-everyday-lolita/mel-shared';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  gridColumns = '1fr 1fr';
  viewRatio = 1.5;
  view: [number, number] = [300 * 1.5, 300];
  brandScheme = {
    domain: [
      '#dc143c',
      '#ff8c00',
      '#ffd700',
      '#2e8b57',
      '#66cdaa',
      '#4169e1',
      '#87ceeb',
      '#9370db',
      '#ee82ee',
      '#a9a9a9',
    ]
  };
  brandStats: { value: number; name: string; }[] = [];
  categoryScheme = {
    domain: [
      '#dc143c',
      '#ff8c00',
      '#ffd700',
      '#2e8b57',
      '#66cdaa',
      '#4169e1',
      '#87ceeb',
      '#9370db',
      '#ee82ee',
      '#a9a9a9',
    ]
  };
  categoryStats: { value: number; name: string; }[] = [];
  colorScheme: { domain: string[]; } = { domain: [] };
  colorStats: { value: number; name: string; }[] = [];
  totalItemsScheme = {
    domain: [
      '#424242',
    ]
  };
  totalItemsStats: { value: number; }[] = [];

  private unsubscriber = new Subject();
  private gridColumnsMap: { [key: string]: string };
  private viewMap: { [key: string]: number };

  constructor(
    private itemsService: ItemsService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.gridColumnsMap = {};
    this.gridColumnsMap[Breakpoints.HandsetLandscape] = '1fr';
    this.gridColumnsMap[Breakpoints.HandsetPortrait] = '1fr';
    this.gridColumnsMap[Breakpoints.TabletLandscape] = '1fr';
    this.gridColumnsMap[Breakpoints.TabletPortrait] = '1fr';
    this.gridColumnsMap[Breakpoints.WebPortrait] = '1fr';
    this.gridColumnsMap[Breakpoints.WebLandscape] = '1fr 1fr';
    this.viewMap = {};
    this.viewMap[Breakpoints.HandsetLandscape] = 200;
    this.viewMap[Breakpoints.HandsetPortrait] = 200;
    this.viewMap[Breakpoints.TabletLandscape] = 300;
    this.viewMap[Breakpoints.TabletPortrait] = 250;
    this.viewMap[Breakpoints.WebPortrait] = 250;
    this.viewMap[Breakpoints.WebLandscape] = 300;
  }

  ngOnInit(): void {
    this.itemsService.stats().subscribe({
      next: result => {
        result.forEach(stats => {
          this.brandStats = stats.brands.slice(0, 10).map(stat => ({ value: stat.count, name: stat._id.name }));
          this.categoryStats = stats.categories.slice(0, 10).map(stat => ({ value: stat.count, name: stat._id.name }));
          const colors = stats.colors.slice(0, 10);
          this.colorScheme = { domain: colors.map(stat => stat._id.hex) };
          this.colorStats = colors.map(stat => ({ value: stat.count, name: stat._id.name }));
          this.totalItemsStats = stats.count_items.map(stat => ({ value: stat.total, name: 'Number of items' }));
        });
      }
    });
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Web])
      .pipe(takeUntil(this.unsubscriber))
      .subscribe({
        next: result => {
          const breakpoints = Object.entries(result.breakpoints).filter(([_, matches]) => matches).map(([key, _]) => key);
          this.gridColumns = this.gridColumnsMap[breakpoints[breakpoints.length - 1]] || '1fr';
          const viewHeight = this.viewMap[breakpoints[breakpoints.length - 1]] || 250;
          const viewWidth = viewHeight * this.viewRatio;
          this.view = [viewWidth, viewHeight];
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

}
