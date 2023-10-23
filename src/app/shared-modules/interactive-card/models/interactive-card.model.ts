export class InteractiveCardData {
  id: string = '';
  imgSrc: string = '';
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
