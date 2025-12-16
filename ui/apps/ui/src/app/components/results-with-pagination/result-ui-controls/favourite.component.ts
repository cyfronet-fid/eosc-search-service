import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UserProfileService } from '../../../auth/user-profile.service';
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

// @UntilDestroy()
@Component({
  selector: 'ess-favourite',
  template: `
    <button (click)="toggle()" class="fav-btn">
      <span class="fav-icon" [innerHTML]="svgContent"></span>
      <span class="fav-text">{{ isActive ? 'Added to favourites' : 'Add to favourites' }}</span>
    </button>
  `,
  styles: [`
    .fav-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      border: none;
      background: none;
      padding: 4px 8px;
    }

    .fav-icon svg {
      width: 18px;
      height: 18px;
      stroke: currentColor;
      fill: none;
    }

    .fav-text {
      font-size: 14px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FavouriteComponent implements OnInit{
  isActive = false;

  private _svgAdd: SafeHtml = '';
  private _svgAdded: SafeHtml = '';

  svgContent: SafeHtml = '';
  isLogged: boolean;

  constructor(
    private _http: HttpClient,
    private _sanitizer: DomSanitizer,
    private _cdr: ChangeDetectorRef,
    private _userProfileService: UserProfileService
  ) {
    this.isLogged = false;
  }

  ngOnInit() {
    this._http.get('assets/add-to-favourites.svg', {responseType: 'text'}).subscribe(svg => {
      this._svgAdd = this._sanitizer.bypassSecurityTrustHtml(svg);
      this.updateSvg();
    });
    this._http.get('assets/added-to-favourites.svg', {responseType: 'text'}).subscribe(svg => {
      this._svgAdded = this._sanitizer.bypassSecurityTrustHtml(svg);
      this.updateSvg();
    });
    this._userProfileService
      .get$()
      // .pipe(untilDestroyed(this))
      .subscribe((profile) => (
            this.isLogged = !(profile.aai_id === '' || profile === null || profile === undefined)
      ));

  };

  toggle() {
    if (this.isLogged) {
      this.isActive = !this.isActive;
      this.updateSvg();
      this.updateFavourites();
    }

    console.log(this.isActive);
    console.log(this.svgContent);

    console.log(this.isLogged)
  }
  private updateSvg() {
    this.svgContent = this.isActive? this._svgAdded : this._svgAdd;
    this._cdr.markForCheck();
  }

  private updateFavourites() {
    if (this.isActive) {
      // remove from favourites
      console.log('lets remove')
    }
    else {
      // add to favourites
      console.log('lets add')
    }
  }
}
