import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule,
} from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/button',
    pathMatch: 'full',
  },
  { path: 'accordion', loadChildren: () => import('./accordion/accordion.module').then(m => m.DesignLandAccordionModule) },
  { path: 'article', loadChildren: () => import('./article/article.module').then(m => m.DesignLandArticleModule) },
  { path: 'button', loadChildren: () => import('./button/button.module').then(m => m.DesignLandButtonModule) },
  { path: 'callout', loadChildren: () => import('./callout/callout.module').then(m => m.DesignLandCalloutModule) },
  { path: 'card', loadChildren: () => import('./card/card.module').then(m => m.DesignLandCardModule) },
  { path: 'checkbox', loadChildren: () => import('./checkbox/checkbox.module').then(m => m.DesignLandCheckboxModule) },
  { path: 'color', loadChildren: () => import('./foundations/color/color.module').then(m => m.DesignLandColorModule) },
  { path: 'container', loadChildren: () => import('./container/container.module').then(m => m.DesignLandContainerModule) },
  { path: 'feature', loadChildren: () => import('./feature/feature.module').then(m => m.DesignLandFeatureModule) },
  { path: 'form', loadChildren: () => import('./form/form.module').then(m => m.DesignLandFormModule) },
  { path: 'hero', loadChildren: () => import('./hero/hero.module').then(m => m.DesignLandHeroModule) },
  { path: 'link-set', loadChildren: () => import('./link-set/link-set.module').then(m => m.DesignLandLinkSetModule) },
  { path: 'list', loadChildren: () => import('./list/list.module').then(m => m.DesignLandListModule) },
  { path: 'loading-icon', loadChildren: () => import('./loading-icon/loading-icon.module').then(m => m.DesignLandLoadingIconModule) },
  { path: 'image', loadChildren: () => import('./image/image.module').then(m => m.DesignLandImageModule) },
  { path: 'image-gallery', loadChildren: () => import('./image-gallery/image-gallery.module').then(m => m.DesignLandImageGalleryModule) },
  { path: 'navbar', loadChildren: () => import('./navbar/navbar.module').then(m => m.DesignLandNavbarModule) },
  { path: 'media-gallery', loadChildren: () => import('./media-gallery/media-gallery.module').then(m => m.DesignLandMediaGalleryModule) },
  { path: 'modal', loadChildren: () => import('./modal/modal.module').then(m => m.DesignLandModalModule) },
  { path: 'paginator', loadChildren: () => import('./paginator/paginator.module').then(m => m.DesignLandPaginatorModule) },
  { path: 'progress-indicator', loadChildren: () => import('./progress-indicator/progress-indicator.module').then(m => m.DesignLandProgressIndicatorModule) },
  { path: 'qty-dropdown', loadChildren: () => import('./qty-dropdown/qty-dropdown.module').then(m => m.DesignLandQtyDropdownModule) },
  { path: 'quantity-field', loadChildren: () => import('./quantity-field/quantity-field.module').then(m => m.DesignLandQuantityFieldModule) },
  { path: 'sidebar', loadChildren: () => import('./sidebar/sidebar.module').then(m => m.DesignLandSidebarModule) },
  { path: 'radio', loadChildren: () => import('./radio/radio.module').then(m => m.DesignLandRadioModule) },
  { path: 'typography', loadChildren: () => import('./typography/typography.module').then(m => m.DesignLandTypographyModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'enabled',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [
    RouterModule,
  ],
})
export class DesignLandAppRoutingModule { }
