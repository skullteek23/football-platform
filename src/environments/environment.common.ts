import { TabLabel } from "@app/shared-modules/ground-selection/models/ground-selection.model";

export const environmentCommon = {
  socials: {
    instagram: 'https://www.instagram.com/ballzo.india',
    youtube: 'https://www.instagram.com/ballzo.india',
    linkedin: 'https://www.instagram.com/ballzo.india',
    facebook: 'https://www.instagram.com/ballzo.india',
  },
  support: {
    email: `admin@ballzo.in`,
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
