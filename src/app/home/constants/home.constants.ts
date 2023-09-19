import { IconSelectionDataItem } from '@app/shared-modules/icon-selection-menu/models/icon-selection.model';
import { environment } from 'src/environments/environment';

export class HomeConstants {
  static readonly salutation = 'Footballer';
}

export const ACTIONS_MENU_NEW_USER: IconSelectionDataItem[] = [
  { icon: 'sports_soccer', route: '/book-match', label: 'Book Match' },
  { icon: 'place', route: '/grounds-near-me', label: 'Find Grounds' },
  { icon: 'help_outline', route: '/support', label: 'Support' },
  { icon: 'settings', route: '/user/account', label: 'Settings' },
];
export const ACTIONS_MENU_EXISTING_USER: IconSelectionDataItem[] = [
  { icon: 'tour', route: '/challenges', label: 'Challenges<br>(LTP)' },
  { icon: 'bar_chart', route: '/rankings', label: 'Rankings' },
  {
    icon: 'record_voice_over',
    route: '',
    label: 'Organize Match',
    externalLink: environment.urls.admin,
  },
  { icon: 'emoji_events', route: '/rewards', label: 'Rewards' },
];
