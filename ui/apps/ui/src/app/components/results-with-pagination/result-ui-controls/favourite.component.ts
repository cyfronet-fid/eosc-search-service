import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UserProfileService } from '../../../auth/user-profile.service';
import { FavouriteService } from '@components/results-with-pagination/result-ui-controls/favourite.service';

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
  @Input() pid!: string;

  //one of those
  @Input() type!: string;
  @Input() resourceType!: string;

  isActive = false;

  private _svgAdd: SafeHtml = '';
  private _svgAdded: SafeHtml = '';

  svgContent: SafeHtml = '';
  isLogged: boolean = false;

  constructor(
    private _http: HttpClient,
    private _sanitizer: DomSanitizer,
    private _cdr: ChangeDetectorRef,
    private _userProfileService: UserProfileService,
    private _favouriteService: FavouriteService,
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
      .subscribe((profile) => {
        this.isLogged = !(profile.aai_id === '' || profile === null || profile === undefined)
        this.checkIfActiveOnInit();
        this.updateSvg();
      });
    console.log('pid: ', this.pid);
    console.log('resource_type: ', this.resourceType);
  };

  toggle() {
    if (this.isLogged) {
      this.updateFavourites();
      this.updateSvg();
    }
  }

  private updateSvg() {
    this.svgContent = this.isActive? this._svgAdded : this._svgAdd;
    this._cdr.markForCheck();
  }

  private updateFavourites() {
    if (this.isActive) {
      console.log('lets remove')
      this._favouriteService.deleteFromFavourites$(this.pid, this.resourceType).subscribe( response => {
        console.log("response delete: ", response.body);
        this.isActive = false
      });
      // this.isActive = false
    }
    else {
      console.log('lets add')
      this._favouriteService.addToFavourites$(this.pid, this.resourceType).subscribe( response => {
        console.log("response add: ", response.body);
        this.isActive = true
      });
      // this.isActive = true
    }
  }

  private checkIfActiveOnInit() {
    this._favouriteService.getFavourites$().subscribe(favs => {
      console.log("inside before getting if active");
      this.isActive = !!favs?.length &&
        favs.some(fav => fav.pid === this.pid && fav.resourceType === this.resourceType);
      console.log("favs: ", favs);
    });
    // this.isActive = true
    // console.log('active ', this.isActive)
  }
}
