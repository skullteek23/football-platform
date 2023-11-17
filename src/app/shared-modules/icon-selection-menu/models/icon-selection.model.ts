export class IconSelectionData {
  items: IconSelectionDataItem[] = [];
  extraItems: IconSelectionDataItem[] = [];
}

export class IconSelectionDataItem {
  label = 'Label';
  route = '/';
  icon = 'help';
  externalLink?: string = '';
}
