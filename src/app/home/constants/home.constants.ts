import { IconSelectionDataItem } from '@app/shared-modules/icon-selection-menu/models/icon-selection.model';
import { environment } from 'src/environments/environment';

export class HomeConstants {
  static readonly salutation = 'Footballer';
}

export const ACTIONS_MENU_NEW_USER: IconSelectionDataItem[] = [
  { icon: 'sports_soccer', route: '/main/book-match', label: 'Book Match' },
  { icon: 'place', route: '/main/grounds-near-me', label: 'Find Grounds' },
  { icon: 'help_outline', route: '/main/support', label: 'Support' },
  { icon: 'settings', route: '/main/user', label: 'Settings' },
];
export const ACTIONS_MENU_EXISTING_USER: IconSelectionDataItem[] = [
  { icon: 'tour', route: '/main/challenges', label: 'Challenges<br>(LTP)' },
  { icon: 'bar_chart', route: '/main/rankings', label: 'Rankings' },
  {
    icon: 'record_voice_over',
    route: '',
    label: 'Organize Match',
    externalLink: environment.urls.admin,
  },
  { icon: 'emoji_events', route: '/main/rewards', label: 'Rewards' },
];
