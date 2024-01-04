import { TabLabel } from "@ballzo-ui/core";
import { environment } from "./environment";
import { ColorsUtility } from "@app/utils/main-utilities/colors-utility";

const logo = 'https://firebasestorage.googleapis.com/v0/b/football-platform-production.appspot.com/o/ballzoCustom%20Artbaord%202.png?alt=media&token=9b1d78d6-388b-46a5-ab84-debfa21b4c81';

export const environmentCommon = {
  version: '3.1.0',
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
  whatsAppCommunityLink: 'https://chat.whatsapp.com/H7HGv8f9LRz2xJsJbEQEDO',
  checkoutOptions: {
    key: environment.razorpay.keyId,
    currency: 'INR',
    name: 'Ballzo India Private Limited',
    image: logo,
    theme: {
      color: ColorsUtility.blue_primary,
      hide_topbar: true,
    },
    retry: {
      enabled: true,
    },
    modal: {
      escape: false,
      confirm_close: false,
      animation: false
    },
    send_sms_hash: true,
    allow_rotation: true,
    timeout: 300,
    remember_customer: true,
    readonly: {
      contact: true,
      email: true,
      name: true
    }
  }
};

export const common = {
  attributeFormatter: {
    tabDay: {
      [TabLabel.today]: 'Today',
      [TabLabel.tomorrow]: 'Tomorrow',
      [TabLabel.dayAfter]: 'Day After',
      [TabLabel.farAway]: TabLabel.farAway,
      [TabLabel.past]: 'Finished',
    }
  }
}
