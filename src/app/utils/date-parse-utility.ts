import { TabLabel } from "@app/shared-modules/ground-selection/models/ground-selection.model";

export class DateParseUtility {

  /**
   * Returns min-max range for a given day
   * @param day
   * @returns
   */
  static getMaxRange(day: TabLabel): { max: number, min: number } {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2);

    switch (day) {
      case TabLabel.today:
        return { min: today.getTime(), max: tomorrow.getTime() - 1 };
      case TabLabel.tomorrow:
        return { min: tomorrow.getTime(), max: dayAfter.getTime() - 1 };
      case TabLabel.dayAfter:
        return { min: dayAfter.getTime(), max: dayAfter.getTime() + 24 * 60 * 60 * 1000 - 1 };
      default:
        return { min: 0, max: 1 }; // Return undefined for invalid input
    }
  }

  /**
   * Formats timestamp to 12 hour format
   * @param timestamp
   * @returns
   */
  static formatTimestampTo12Hour(timestamp: number): string {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

    const formattedTime = `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    return formattedTime;
  }
}
