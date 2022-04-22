import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticlesPageComponent } from './articles-page/articles-page.component';
import { MarketplacePageComponent } from './marketplace-page/marketplace-page.component';
import { TrainingCatalogPageComponent } from './training-catalog-page/training-catalog-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'marketplace' },
  { path: 'marketplace', component: MarketplacePageComponent },
  { path: 'articles', component: ArticlesPageComponent },
  { path: 'training-catalog', component: TrainingCatalogPageComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' }, // TODO: Create Error page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
