import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeGap'
})
export class TimeGapPipe implements PipeTransform {

  transform(value: Date): string {
    if (typeof value != "object") {
      value = new Date(value);
    }
    const currentTime = new Date();
    const timeGap = Math.abs(currentTime.getTime() - value.getTime());

    const minutes = Math.floor(timeGap / (1000 * 60));
    const hours = Math.floor(timeGap / (1000 * 60 * 60));
    const days = Math.floor(timeGap / (1000 * 60 * 60 * 24));

    if (days > 7) {
      return `${value.getDate()} ${this.getMonthName(value.getMonth())}, ${value.getFullYear()}`;
    } else if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes === 0) {
      return "Just now";
    } else {
      return `${minutes}m ago`;
    }
  }

  private getMonthName(month: number): string {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[month];
  }
}
