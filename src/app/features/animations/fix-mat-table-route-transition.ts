import { trigger, transition, animate, style } from '@angular/animations';

export const rowAnimation = trigger('rowAnimation', [transition('* => void', [animate('0ms', style({ display: 'none' }))])]);
