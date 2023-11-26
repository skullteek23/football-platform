import { Constants } from '@ballzo-ui/core';

export class InteractiveCardData {
  id: string = '';
  imgSrc: string = Constants.DEFAULT_IMG;
  title: string = 'Title';
  subtitle: string = 'Subtitle';
  descriptionHtml: string = 'Description line 1 <br> line 2';
  actionBtn = {
    type: 'chip',
    label: 'Action',
    isSelectable: true,
    customContent: '',
    customStyle: {}
  };
}
