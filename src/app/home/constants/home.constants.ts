import { IconSelectionDataItem } from '@app/shared-modules/icon-selection-menu/models/icon-selection.model';
import { environmentCommon } from '@environments/environment.common';
import { environment } from 'src/environments/environment';

export class HomeConstants {
  static readonly salutation = 'Footballer';
  static readonly confirmed = 'Confirmed';
  static readonly GAME_ON = 'Game ON!';
  static readonly ONGOING = 'LIVE';
  static readonly FINISHED = 'Finished!';
  static readonly CANCELLED = 'Cancelled';
}

export const ACTIONS_MENU_NEW_USER: IconSelectionDataItem[] = [
  { icon: 'sports_soccer', route: '/games/discover', label: 'Book Match' },
  { icon: 'place', route: '/grounds-near-me', label: 'Find Grounds' },
  { icon: 'help_outline', route: '', externalLink: environmentCommon.whatsapp.support, label: 'Support' },
  { icon: 'settings', route: '/user', label: 'Profile' },
];
export const ACTIONS_MENU_EXISTING_USER: IconSelectionDataItem[] = [
  { icon: 'tour', route: '/challenges', label: 'Challenges' },
  { icon: 'bar_chart', route: '/rankings', label: 'Rankings' },
  {
    icon: 'record_voice_over',
    route: '',
    label: 'Organize Match',
    externalLink: environment.urls.admin,
  },
  { icon: 'emoji_events', route: '/rewards', label: 'Rewards' },
];
