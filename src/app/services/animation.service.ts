import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

export class AnimationsList {

  static expandCollapseAnimationTrigger = trigger('iconState', [
    state('expanded', style({ transform: 'rotate(180deg)' })),
    state('collapsed', style({ transform: 'rotate(0deg)' })),
    transition('expanded <=> collapsed', animate('0.3s ease')),
  ]);

  static fadeInOutAnimation = trigger('fadeInOut', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('300ms', style({ opacity: 1 })),
    ]),
    transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
  ]);

  static fadeOutInAnimation = trigger('fadeOutIn', [
    transition(':leave', [animate('500ms', style({ opacity: 0 }))]),
    transition(':enter', [
      style({ opacity: 0.5 }),
      animate('300ms', style({ opacity: 1 })),
    ]),
  ]);

  static sliderSidewayAnimation = trigger('slideSideways', [
    state('0', style({ transform: 'translateX(50%)' })),
    state('1', style({ transform: 'translateX(-50%)' })),
    state('2', style({ transform: 'translateX(-150%)' })),
    state('3', style({ transform: 'translateX(-250%)' })),
    state('4', style({ transform: 'translateX(-350%)' })),
    state('5', style({ transform: 'translateX(0)' })),
    transition('* => *', animate('0.5s ease-in-out')),
  ]);

  static fadeAppear = trigger('fadeAppear', [
    state('void', style({ opacity: 0 })),
    state('default', style({ opacity: 1 })),
    transition('void => *', animate('0.3s ease-in-out')),
  ]);

  static sliderSidewayVoid = trigger('sliderSidewayVoid', [
    state('void', style({ opacity: 0 })),
    state('default', style({ opacity: 1 })),
    transition('void => *', animate('0.3s ease-in-out')),
  ]);

  static fadeAppearSideways = trigger('fadeAppearSideways', [
    state('void', style({ opacity: 0, transform: 'translateX(-30%)' })),
    state('default', style({ opacity: 1, transform: 'translateX(0%)' })),
    transition('void => *', animate('0.3s ease-out')),
  ]);

  static fadeAppearBottomTop = trigger('fadeAppearBottomTop', [
    state('void', style({ opacity: 0, transform: 'translateY(30%)' })),
    state('default', style({ opacity: 1, transform: 'translateY(0%)' })),
    transition('void => *', animate('0.3s ease-out')),
  ]);
}
