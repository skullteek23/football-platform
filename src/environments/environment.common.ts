import { TabLabel } from "@app/shared-modules/ground-selection/models/ground-selection.model";

export const environmentCommon = {
  version: '1.0.2',
  socials: {
    instagram: 'https://www.instagram.com/ballzo.india',
    youtube: 'https://www.youtube.com',
    linkedin: 'https://linkedin.com/company/ballzo',
    facebook: 'https://www.facebook.com',
  },
  support: {
    email: 'admin@ballzo.in',
    address: `2-A/3 S/F Front Side Asaf Ali Road Turkman Gate New Delhi 110002`,
  },
};

export const common = {
  attributeFormatter: {
    tabDay: {
      [TabLabel.today]: 'Today',
      [TabLabel.tomorrow]: 'Tomorrow',
      [TabLabel.dayAfter]: 'Day After',
    }
  }
}
