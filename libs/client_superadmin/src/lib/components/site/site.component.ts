import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';
import { ClientSuperAdminService } from '../../services/client-superadmin.service';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  standalone: true,
  providers: [ConfirmationService],
  imports: [CommonModule, BreadcrumbModule, TagModule, FormsModule, ConfirmDialogModule, ToggleSwitchModule, IconFieldModule, InputIconModule, InputTextModule, ReactiveFormsModule, DialogModule, ButtonModule, TableModule, RouterModule, SkeletonModule]
})
export class SiteComponent implements OnInit {
  siteData: any = null;
  loading = true;
  breadcrumbItems: any[] = [];
  visibleSiteManageDialog = false;
  selectedSite: any = null;
  siteForm: FormGroup;

  constructor(
    private clientSuperAdminService: ClientSuperAdminService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) {
    this.siteForm = this.fb.group({
      name:     ['', [Validators.required, Validators.maxLength(255)]],
    });
  }

  ngOnInit(): void {
    this.breadcrumbItems = [
        { label: 'Dashboard', routerLink: '/superadmin' },
        { label: 'Site List' }
    ];
    this.getSiteList();
  }

  getSiteList(){
    this.clientSuperAdminService.listSites()
      .subscribe({
        next: (data) => {
          this.siteData = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching dashboard data:', err);
          this.loading = false;
        }
      });
  }

  selectSite(selectedSite: any){
    this.selectedSite = selectedSite;
    this.siteForm.patchValue({
      name: selectedSite.name,
    });
    this.visibleSiteManageDialog = true;
  }

  onCloseSiteDetailsModel(){
    this.selectedSite = null;
    this.siteForm.reset();
    this.visibleSiteManageDialog = false;
  }

  addNewSite(){
    this.selectedSite = null;
    this.siteForm.reset();
    this.visibleSiteManageDialog = true;
  }

  onSubmitSiteManageForm(){
    if(this.selectedSite){
      this.clientSuperAdminService.updateSite(this.selectedSite.id, {name: this.siteForm.value.name})
        .subscribe({
          next: (response) => {
            console.log('Site updated successfully:', response);
            this.onCloseSiteDetailsModel();
            this.getSiteList(); // Refresh the site list
          },
          error: (error) => {
            console.error('Error updating site:', error);
          }
        });
    } else {
      this.clientSuperAdminService.addNewSite({name: this.siteForm.value.name})
        .subscribe({
          next: (response) => {
            console.log('New site added successfully:', response);
            this.onCloseSiteDetailsModel();
            this.getSiteList(); // Refresh the site list
          },
          error: (error) => {
            console.error('Error adding new site:', error);
          }
        });
    }
  }

  changeSitePriority(site: any){
    console.log(site)
    this.confirmationService.confirm({
        message: `Now ${site.name} is on priority. Are you sure want to change site priority?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon:"none",
        rejectIcon:"none",
        rejectButtonStyleClass:"p-button",
        acceptButtonStyleClass: 'p-button-outlined',
        accept: () => {
            this.clientSuperAdminService.updateSitePriority(site.id)
              .subscribe({
                next: (response) => {
                  console.log('Site priority updated successfully:', response);
                  this.getSiteList(); // Refresh the site list
                },
                error: (error) => {
                  console.error('Error updating site priority:', error);
                  // this.siteData = structuredClone(this.siteData);
                  // this.cdr.detectChanges();
                }
              });
        },
        reject: () => {
            // do nothing
        }
    });
  }
}
