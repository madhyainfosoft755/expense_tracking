import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppTitleService {

  constructor(
    private meta: Meta,
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      mergeMap(route => route.data)
    ).subscribe(event => {
      const title = "Expense Tracking : Smart Expense Reporting for IT, Construction, and All Professionals";
      const appTitle = event['title'] ? 
        event['title'] + ' | ' + title: title;
      this.titleService.setTitle(appTitle);
      this.meta.updateTag({ name: 'description', content: event['description'] || "Easily track and report expenses tailored to your profession — whether you're in IT, construction, or any other industry. Upload receipts, categorize costs, and stay on top of reimbursements." });
      this.meta.updateTag({ name: 'keywords', content: event['keywords'] || 'expense tracker, expense reporting, construction expense app, IT expense manager, professional expense tracker, upload receipts, business expenses, reimbursement app' });
    });
  }
}
