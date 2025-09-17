import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FormBuilder } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-user-cashbook',
  templateUrl: './cashbook.component.html',
  standalone: true,
  imports: [CommonModule, TableModule, BreadcrumbModule, ButtonModule],
  styles: ``
})
export class CashbookComponent implements OnInit {
  cashbookData: any;
  userTotalCashbookData: any;
  cashbookMergedData: any;
  breadcrumbItems: any[] = [];
  loading = false;
  userTotal = false;

  constructor(
      private userService: UserService,
      private fb: FormBuilder
    ) {
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
    this.loadCashbook();
  }

  loadCashbook(){
    this.loading = true;
    this.userService.getCashbook()
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
          approvedDate: null,
        }
      );
    }

    return output;
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
