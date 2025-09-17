import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AbstractControl, FormControl } from '@angular/forms';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class HelperSharedService {
    constructor(private datePipe: DatePipe) {}

    getAllMonths(options?: { padZero?: boolean }): { number: number | string, month: string }[] {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        return monthNames.map((month, index) => {
            const monthNumber = index + 1;
            const formattedNumber = options?.padZero && monthNumber < 10
            ? `0${monthNumber}`
            : monthNumber;

            return {
            number: formattedNumber,
            month
            };
        });
    }

    replaceNullsWithEmpty(obj: Record<string, any>, convertDate = false): Record<string, any> {
        const updated: Record<string, any> = {};
        for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            
            if (value === null || value === undefined) {
            updated[key] = '';
            } else if (value instanceof Date) {
            if(convertDate){
                updated[key] = this.datePipe.transform(value, 'dd-MM-yyyy');
            }
            } else if (typeof value === 'string') {
            updated[key] = value.trim();
            } else {
            updated[key] = value;
            }
        }
        }
        return updated;
    }

    removeEmptyTrimmedStrings<T extends Record<string, any>>(obj: T, replaceNull=false, nullDate=false): Partial<T> {
        const result: Partial<T> = {};
        let newObj: any = obj;
        if(replaceNull){
            newObj = this.replaceNullsWithEmpty(obj, nullDate)
        }
        for (const [key, value] of Object.entries(newObj)) {
            if (typeof value === 'string') {
            const trimmed = value.trim();
            if (trimmed !== '') {
                (result as any)[key] = trimmed;
            }
            } else {
            (result as any)[key] = value;
            }
        }

        return result;
    }


    isTruthyObject(value: any): boolean {
        // Check for null, undefined, false, 0, ''
        if (!value) return false;

        // Check if it's an empty object
        if (typeof value === 'object' && !Array.isArray(value)) {
            return Object.keys(value).length > 0;
        }

        return true;
    }


    getPaginationText(data: any): string {
        const per_page = 50;
        try {
            if (!data || Number(data.count) === 0) {
                return '';
            }
            const startRecord: number = (Number(data.current_page) - 1) * per_page + 1;
            const endRecordNumber: number = startRecord + Number(per_page) - 1;
            const endRecord: number = Number(endRecordNumber) > Number(data.count) ? Number(data.count) : Number(endRecordNumber);
            const totalEntries: number = data.total_entries ?? data.count;

            return `Showing ${startRecord} to ${endRecord} records from ${totalEntries} | 
            Page ${data.current_page} of ${data.total_pages}`;
        } catch (error) {
            // In case of any error, return empty string
            return '';
        }
    }

    checkAmountInput(control: AbstractControl<any, any> | null): AbstractControl<any, any> | null {
        let value = control?.value;
        if (value !== null && value !== undefined) {
            // Convert to string
            value = value.toString();

            // Allow only digits and one decimal point
            const cleanedValue = value.replace(/[^0-9.]/g, '');

            // Handle multiple decimals: keep only the first one
            const parts = cleanedValue.split('.');
            const integerPart = parts[0].substring(0, 14); // Limit to 14 digits before decimal

            let formattedValue = integerPart;

            if (parts.length > 1) {
            // Limit to 2 digits after decimal
            const decimalPart = parts[1].substring(0, 2);
            formattedValue += '.' + decimalPart;
            }

            control?.setValue(formattedValue, { emitEvent: false });
            return control;
        }
        return control;
    }

    generateDisabledDates(selectedYear: number, selectedMonths: number[]): Date[] {
        const disabledDates: Date[] = [];
        const start = new Date(selectedYear, 0, 1); // Jan 1, 2025
        const end = new Date(selectedYear, 11, 31); // Dec 31, 2025

        const currentDate = new Date(start);

        while (currentDate <= end) {
            const month = currentDate.getMonth() + 1; // 1-12

            // If month is not in allowed list, disable the date
            if (!selectedMonths.includes(month)) {
                disabledDates.push(new Date(currentDate));
            }

            // Move to next day
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return disabledDates
    }


    exportToCSV(data: any[], fileName: string) {
        const csvContent = this.convertToCsv(data);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const dateStr = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
        saveAs(blob, `${fileName}_${dateStr}.csv`);
    }


    private convertToCsv(data: any[]): string {
        // Assuming data is an array of objects with keys as column names
        const header = Object.keys(data[0]).join(','); // Get header from the first object keys
        const rows = data.map(row => Object.values(row).join(',')); // Map each row's values as CSV row
        
        return [header, ...rows].join('\n'); // Join header and rows with new lines
    }

}