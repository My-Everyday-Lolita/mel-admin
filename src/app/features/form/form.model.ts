import { FormGroup } from '@angular/forms';
import { Resource } from '@my-everyday-lolita/mel-shared';

export interface Item<T extends Resource> {
  data: T;
  nbItems?: number;
}

export interface ExpandableItem<T extends Resource> extends Item<T> {
  expanded: boolean;
}

export interface EditableItem<T extends Resource> extends Item<T> {
  form: FormGroup;
}

export type EditableExpandableItem<T extends Resource> = ExpandableItem<T> & EditableItem<T>;
