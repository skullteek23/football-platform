export class DetailsContainerData {
  title: string = '';
  actionIcon: string = 'edit';
  detailData: IDetailData[] = [];
}

export interface IDetailData {
  icon: string;
  label: string;
}
