import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FormBuilder, FormsModule } from '@angular/forms';
import { CommonAPIService } from '../../services/common-api.service';
import { ButtonModule } from 'primeng/button';

import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import {
  selectUser,
} from '@auth';
import { SelectModule } from 'primeng/select';
import { HelperSharedService } from '../../services/helper-shared.service';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'lib-shared-cashbook',
  templateUrl: './shared-cashbook.component.html',
  standalone: true,
  imports: [CommonModule, TableModule, BreadcrumbModule, MultiSelectModule, ButtonModule, SelectModule, FormsModule],
  styles: ``
})
export class SharedCashbookComponent implements OnInit {
  cashbookData: any;
  userTotalCashbookData: any;
  cashbookMergedData: any;
  breadcrumbItems: any[] = [];
  loading = false;
  userTotal = false;
  currentUser$: Observable<any | null> = of(null);
  userRole : string | null = null;
  office_locations: any[] = [];
  selectedOfficeLocations: number | null = null;
  loadingExport = false;

  selectedMonth!: number;
  selectedYear: number= new Date().getFullYear();
  years: {name: number}[] = []
  months: { number: number | string; month: string }[] = [];
  today: Date = new Date();

  constructor(
      private commonAPIService: CommonAPIService,
      private fb: FormBuilder,
      private store: Store,
      private helperSharedService: HelperSharedService
    ) {
      this.currentUser$ = this.store.select(selectUser);
      // this.amtReceivedFrom = this.fb.group({
      //   date: [null, [Validators.required]],
      //   amount: ['', [Validators.required, Validators.min(1)]],
      //   expense_head: ['', [Validators.required]],
      //   description: [''],
      // });
    }

  ngOnInit(){
    this.breadcrumbItems = [
      { label: 'Dashboard', routerLink: '/user' },
      { label: 'Cashbook' }
    ];

    this.months = this.helperSharedService.getAllMonths();
    this.selectedMonth = this.today.getMonth() + 1;
    this.selectedYear = this.today.getFullYear();
    this.years = [{name: this.selectedYear}];

    this.currentUser$.subscribe(user => {
      if (user) {
        console.log(user)
          this.userRole = user.role || null;
          if (user.role == 'SUPERADMIN'){
              this.getSiteList(user.priority_site);
          } else {
            this.loadCashbook();
          }
      } else {
          this.userRole = null;
          this.loadCashbook();
      }
    });
  }

  provideData(){
    const data: any = {month: this.selectedMonth, year: this.selectedYear};
    if(this.userRole === 'SUPERADMIN' && this.selectedOfficeLocations){
      data['office_location'] = this.selectedOfficeLocations;
    }
    return data;
  }

  loadCashbook(){
    this.loading = true;
    this.commonAPIService.getCashbook(this.provideData())
      .subscribe({
        next: (data) => {
          this.cashbookData = this.mergeCashbookAndExpense(data.cashbook_data, data.expense_data);
          this.cashbookMergedData = structuredClone(this.cashbookData);
          console.log(this.cashbookData);
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error in expense head:', err);
          this.loading = false;
        }
    });
  }

  getSiteList(site_data: {id: number, name: string} | null){
    this.commonAPIService.listSites()
    .subscribe({
        next: (data: any) => {
          this.office_locations = data;
          if(site_data){
            this.selectedOfficeLocations = site_data.id;
            this.loadCashbook();
          }
        },
        error: (err: any) => {
        console.error('Error fetching dashboard data:', err);
        }
    });
  }

  mergeCashbookAndExpense(cashbook_data: any[], expense_data: any[]): any[] {
    const groupedCashbook: Record<string, any[]> = {};
    const groupedExpense: Record<string, any[]> = {};

    // Grouping cashbook by email
    cashbook_data.forEach(cb => {
      const email = cb.cashbook_received_by.email;
      if (!groupedCashbook[email]) groupedCashbook[email] = [];
      groupedCashbook[email].push(cb);
    });

    // Grouping expense by email
    expense_data.forEach(exp => {
      const email = exp.expense_expense_by.email;
      if (!groupedExpense[email]) groupedExpense[email] = [];
      groupedExpense[email].push(exp);
    });

    const allEmails = new Set([...Object.keys(groupedCashbook), ...Object.keys(groupedExpense)]);
    const result: any[] = [];
    let SN = 1;
    let grandTotalReceived = 0;
    let grandTotalExpense = 0;

    for (const email of allEmails) {
      const cashbooks = (groupedCashbook[email] || []).sort((a, b) =>
        a.date_received.localeCompare(b.date_received)
      );
      const expenses = (groupedExpense[email] || []).sort((a, b) =>
        a.date.localeCompare(b.date)
      );

      const maxLen = Math.max(cashbooks.length, expenses.length);
      for (let i = 0; i < maxLen; i++) {
        const cb = cashbooks[i] || null;
        const exp = expenses[i] || null;

        const receivedAmt = cb?.cashbook_amount ? parseFloat(cb.cashbook_amount) : 0;
        const expenseAmt = exp?.expense_amount ? parseFloat(exp.expense_amount) : 0;

        grandTotalReceived += receivedAmt;
        grandTotalExpense += expenseAmt;

        result.push({
          SN: SN++,
          amtReceivedDate: cb?.date_received || null,
          receivedAmt: cb?.cashbook_amount || null,
          receivedBy: cb?.cashbook_received_by.first_name || null,
          receivedFrom: cb?.received_from_name || null,

          expenseDate: exp?.date || null,
          expenseAmt: exp?.expense_amount || null,
          expenseHead: exp?.expense_expense_head.name || null,
          descriptions: exp?.description || null,
          approvedBy: exp?.expense_approved_by?.first_name || null,
          remarks: exp?.remarks || null,
          vendorName: exp?.expense_vendor_name || null,
          approvedDate: exp?.date_approved || null,
        });
      }
    }

    // Add grand total at the end
    result.push({
      SN: null,
      amtReceivedDate: null,
      receivedAmt: grandTotalReceived.toFixed(2),
      receivedBy: 'Grand Total',
      receivedFrom: null,
      expenseDate: null,
      expenseAmt: grandTotalExpense.toFixed(2),
      expenseHead: null,
      descriptions: null,
      approvedBy: null,
      remarks: null,
      vendorName: null,
      approvedDate: null,
      isTotalRow: true,
    });

    return result;
  }



  toggleTotals(){
    if(this.userTotalCashbookData){
      this.cashbookData = structuredClone(this.cashbookMergedData);
      this.userTotalCashbookData = null;
    } else {
      this.userTotalCashbookData = structuredClone(this.cashbookMergedData);
      this.cashbookData = this.addUserTotalsToMergedData(this.userTotalCashbookData);
    }
    this.userTotal = !this.userTotal;
  }


  addUserTotalsToMergedData(data: any): any[] {
    const output: any[] = [];
    let currentUser = '';
    let userTotalReceived = 0;
    let userTotalExpense = 0;

    for (let i = 0; i < data.length; i++) {
      const row = data[i];

      // Skip grand total row
      if (row.receivedBy === 'Grand Total') {
        output.push(row);
        break;
      }

      if (row.receivedBy && row.receivedBy !== currentUser) {
        // Add total row for previous user if any
        if (currentUser) {
          output.push({
            SN: null,
            amtReceivedDate: null,
            receivedAmt: userTotalReceived.toFixed(2),
            receivedBy: `Total for ${currentUser}`,
            receivedFrom: null,
            expenseDate: null,
            expenseAmt: userTotalExpense.toFixed(2),
            expenseHead: null,
            descriptions: null,
            approvedBy: null,
            remarks: null,
            vendorName: null,
            approvedDate: null,
          });
        }

        // Reset for new user
        currentUser = row.receivedBy;
        userTotalReceived = 0;
        userTotalExpense = 0;
      }

      // Sum amounts
      userTotalReceived += row.receivedAmt ? parseFloat(row.receivedAmt) : 0;
      userTotalExpense += row.expenseAmt ? parseFloat(row.expenseAmt) : 0;

      output.push(row);
    }

    // Final user total row (after loop)
    if (currentUser) {
      output.splice(
        output.length - 1,
        0,
        {
          SN: null,
          amtReceivedDate: null,
          receivedAmt: userTotalReceived.toFixed(2),
          receivedBy: `Total for ${currentUser}`,
          receivedFrom: null,
          expenseDate: null,
          expenseAmt: userTotalExpense.toFixed(2),
          expenseHead: null,
          descriptions: null,
          approvedBy: null,
          remarks: null,
          vendorName: null,
          approvedDate: null,
        }
      );
    }

    return output;
  }

  onOfficeLocationChange(value: number) {
    this.cashbookData = null;
    this.selectedOfficeLocations = value;
    this.loadCashbook();
  }

  onMonthChange(value: number) {
    this.selectedMonth = value;
    this.loadCashbook();
  }
  onYearChange(value: number) {
    this.selectedYear = value;
    this.loadCashbook();
  }

  exportToCSV() {
    const data = structuredClone(this.cashbookData || []);
    const csvRows: any[] = [];
    data.forEach((row: any, index: number) => {
      const data: any = {
        'SN': index + 1,
        'Amt Received Date': row.amtReceivedDate,
        'Received Amt': row.receivedAmt,
        'Received From': row.receivedFrom,
        'Expense Date': row.expenseDate,
        'Expense Amt': row.expenseAmt,
        'Expense Head': row.expenseHead,
        'Vendor Name': row.vendorName,
        'Descriptions': row.descriptions,
        'Approved By': row.approvedBy,
        'Remarks': row.remarks,
        'Approved Date': row.approvedDate,
      };
      if(this.userRole !== "USER"){
        data['Received By'] = row.receivedBy;
      }
      csvRows.push(data);
    });
    this.helperSharedService.exportToCSV(csvRows, 'cashbook');

  }
}






// type Cashbook = {
//   date_received: string;
//   cashbook_amount: string;
//   cashbook_received_by: {
//     first_name: string;
//     email: string;
//   };
//   received_from_name: string;
// };

// type Expense = {
//   date: string;
//   expense_amount: string;
//   expense_expense_head: {
//     name: string;
//   };
//   description: string;
//   expense_expense_by: {
//     first_name: string;
//     email: string;
//   };
//   expense_approved_by: {
//     first_name: string;
//   } | null;
//   remarks: string | null;
//   date_approved: string | null;
// };

// type MergedRow = {
//   SN: number;
//   amtReceivedDate: string | null;
//   receivedAmt: string | null;
//   receivedBy: string | null;
//   receivedFrom: string | null;
//   expenseDate: string | null;
//   expenseAmt: string | null;
//   expenseHead: string | null;
//   descriptions: string | null;
//   approvedBy: string | null;
//   remarks: string | null;
//   approvedDate: string | null;
// };

// function mergeCashbookAndExpense(cashbook_data: Cashbook[], expense_data: Expense[]): MergedRow[] {
//   const groupedCashbook: Record<string, Cashbook[]> = {};
//   const groupedExpense: Record<string, Expense[]> = {};

//   // Grouping cashbook by email
//   cashbook_data.forEach(cb => {
//     const email = cb.cashbook_received_by.email;
//     if (!groupedCashbook[email]) groupedCashbook[email] = [];
//     groupedCashbook[email].push(cb);
//   });

//   // Grouping expense by email
//   expense_data.forEach(exp => {
//     const email = exp.expense_expense_by.email;
//     if (!groupedExpense[email]) groupedExpense[email] = [];
//     groupedExpense[email].push(exp);
//   });

//   const allEmails = new Set([...Object.keys(groupedCashbook), ...Object.keys(groupedExpense)]);
//   const result: MergedRow[] = [];
//   let SN = 1;

//   for (const email of allEmails) {
//     const cashbooks = (groupedCashbook[email] || []).sort((a, b) =>
//       a.date_received.localeCompare(b.date_received)
//     );
//     const expenses = (groupedExpense[email] || []).sort((a, b) =>
//       a.date.localeCompare(b.date)
//     );

//     const maxLen = Math.max(cashbooks.length, expenses.length);
//     for (let i = 0; i < maxLen; i++) {
//       const cb = cashbooks[i] || null;
//       const exp = expenses[i] || null;

//       result.push({
//         SN: SN++,
//         amtReceivedDate: cb?.date_received || null,
//         receivedAmt: cb?.cashbook_amount || null,
//         receivedBy: cb?.cashbook_received_by.first_name || null,
//         receivedFrom: cb?.received_from_name || null,

//         expenseDate: exp?.date || null,
//         expenseAmt: exp?.expense_amount || null,
//         expenseHead: exp?.expense_expense_head.name || null,
//         descriptions: exp?.description || null,
//         approvedBy: exp?.expense_approved_by?.first_name || null,
//         remarks: exp?.remarks || null,
//         approvedDate: exp?.date_approved || null,
//       });
//     }
//   }

//   return result;
// }
