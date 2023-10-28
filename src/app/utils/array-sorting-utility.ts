export class ArraySorting {
  /**
   * Sort array of objects by key
   * @param key
   * @param order
   * @param isConvertNA
   * @returns
   */
  static sortObjectByKey(key: string, order = 'asc', isConvertNA = true) {
    return function innerSort(a: any, b: any) {
      const isTypescriptProperty = key in a || key in b;
      if (isTypescriptProperty || a.hasOwnProperty(key) || b.hasOwnProperty(key)) {
        if (Array.isArray(a[key])) {
          const valueA = a[key].join(', ').toUpperCase();
          const valueB = b[key].join(', ').toUpperCase();
          return ArraySorting.getSortedElement(valueA, valueB, order);
        } else {
          let valueA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
          let valueB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];
          if (isConvertNA) {
            valueA = !valueA || valueA === 'N/A' ? null : valueA;
            valueB = !valueB || valueB === 'N/A' ? null : valueB;
          } else {
            valueA = !valueA ? null : valueA;
            valueB = !valueB ? null : valueB;
          }
          return ArraySorting.getSortedElement(valueA, valueB, order);
        }
      }
      // property doesn't exist on either object
      return 0;
    };
  }

  /**
   * Get sorted element
   * @param valueA
   * @param valueB
   * @param order
   * @returns
   */
  static getSortedElement(valueA: any, valueB: any, order: string): number {
    let comparison = 0;
    if (valueB === null) {
      comparison = 1;
    } else if (valueA === null) {
      comparison = -1;
    } else if (valueA > valueB) {
      comparison = 1;
    } else if (valueA < valueB) {
      comparison = -1;
    }
    return order === 'desc' ? comparison * -1 : comparison;
  }
}
