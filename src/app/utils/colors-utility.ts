export class ColorsUtility {
  static readonly yellow = '#ffdd55';
  static readonly grey_bg = '#e0e0e0';
  static readonly green = '#97e9b3';
  static readonly red = '#ff7f6f';
  static readonly white = '#ffffff';

  static getFillingGradient(primaryColor: string, secondaryColor: string, percentage: number): string {
    return `linear-gradient(90deg, ${primaryColor} ${percentage}%, ${secondaryColor} ${percentage}%, ${secondaryColor} 100%)`;
  }
}
