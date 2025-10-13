import { Component, OnInit, ChangeDetectorRef, signal  } from '@angular/core';
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
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  standalone: true,
  providers: [ConfirmationService],
  imports: [CommonModule, BreadcrumbModule, MessageModule, TagModule, FormsModule, ConfirmDialogModule, ToggleSwitchModule, IconFieldModule, InputIconModule, InputTextModule, ReactiveFormsModule, DialogModule, ButtonModule, TableModule, RouterModule, SkeletonModule]
})
export class SiteComponent implements OnInit {
  siteData: any = null;
  loading = true;
  addUpdateLoading = false;
  updatingPriorityLoading = false;
  breadcrumbItems: any[] = [];
  visibleSiteManageDialog = false;
  selectedSite: any = null;
  siteForm: FormGroup;
  messages = signal<any[]>([]);

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

  addMessages(message: { severity: string, content: string, life: number }) {
      this.messages.set([message]);
      // this.messages.set([ ...this.messages(), message]);
  }

  getSiteList(){
    this.clientSuperAdminService.listSites()
      .subscribe({
        next: (data) => {
          this.siteData = data;
          this.loading = false;
        },
        error: (err) => {
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
      this.addUpdateLoading = true;
      this.clientSuperAdminService.updateSite(this.selectedSite.id, {name: this.siteForm.value.name})
        .subscribe({
          next: (response: any) => {
            this.onCloseSiteDetailsModel();
            this.addMessages({ severity: 'success', content: response?.message ?? 'Site Updated Successfully.', life: 30000 });
            this.addUpdateLoading = false;
            this.getSiteList(); // Refresh the site list
          },
          error: (error) => {
            this.addMessages({ severity: 'error', content: error?.error?.error ?? 'Unable to update site.', life: 30000 });
            this.addUpdateLoading = false;
          }
        });
    } else {
      this.addUpdateLoading = true;
      this.clientSuperAdminService.addNewSite({name: this.siteForm.value.name})
        .subscribe({
          next: (response: any) => {
            this.onCloseSiteDetailsModel();
            this.addMessages({ severity: 'success', content: response?.message ?? 'Site Added Successfully.', life: 30000 });
            this.addUpdateLoading = false;
            this.getSiteList(); // Refresh the site list
          },
          error: (error) => {
            this.addMessages({ severity: 'error', content: error?.error?.error ?? 'Unable to add site.', life: 30000 });
            this.addUpdateLoading = false;
          }
        });
    }
  }

  changeSitePriority(site: any){
    if(site.priority){ return; }
    this.confirmationService.confirm({
      message: `Now ${site.name} is on priority. Are you sure want to change site priority?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon:"none",
        rejectIcon:"none",
        rejectButtonStyleClass:"p-button",
        acceptButtonStyleClass: 'p-button-outlined',
        accept: () => {
            this.loading = true;
            this.clientSuperAdminService.updateSitePriority(site.id)
              .subscribe({
                next: (response: any) => {
                  this.loading = false;
                  this.addMessages({ severity: 'success', content: response?.message ?? 'Site Priority Changed Successfully.', life: 30000 });
                  this.getSiteList(); // Refresh the site list
                },
                error: (error) => {
                  this.addMessages({ severity: 'error', content: error?.error?.error ?? 'Unable to update site priority.', life: 30000 });
                  this.loading = false
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
