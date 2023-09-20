import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

export class AnimationService {
  /**
   * Rotates the expand icon by 180 degrees based on element's state
   */
  static expandCollapseAnimationTrigger = trigger('iconState', [
    state('expanded', style({ transform: 'rotate(180deg)' })),
    state('collapsed', style({ transform: 'rotate(0deg)' })),
    transition('expanded <=> collapsed', animate('0.3s ease')),
  ]);

  /**
   * For fade in/out transition when element enters or leaves
   */
  static fadeInOutAnimation = trigger('fadeInOut', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('300ms', style({ opacity: 1 })),
    ]),
    transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
  ]);

  /**
   * For fade in/out transition when element enters or leaves
   */
  static fadeOutInAnimation = trigger('fadeOutIn', [
    transition(':leave', [animate('500ms', style({ opacity: 0 }))]),
    transition(':enter', [
      style({ opacity: 0.5 }),
      animate('300ms', style({ opacity: 1 })),
    ]),
  ]);

  /**
   * For slide-in animation when element enters
   */
  static slideInAnimation = trigger('slideIn', [
    transition(':enter', [
      style({ transform: 'translateY(100%)' }),
      animate('300ms ease-out', style({ transform: 'translateY(0)' })),
    ]),
  ]);
}
