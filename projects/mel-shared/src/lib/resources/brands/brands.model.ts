import { Resource } from '../resource.model';

export interface Brand extends Resource {
  name: string;
  shortname?: string;
}
