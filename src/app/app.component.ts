import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';
import { PRIME_NG_MODULES } from '@core/utils';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ...PRIME_NG_MODULES
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'lead web';


  constructor(@Inject(PLATFORM_ID) private platformId: Object,
      private meta: Meta,
      private translate: TranslateService,
      private primengConfig: PrimeNG) {

    this.translate.addLangs(['en-US', 'pt-BR']);
    this.translate.setDefaultLang('pt-BR');
    this.translate.use('pt-BR');
  }

  ngOnInit(): void {
    this.primeNgLocaleTranslations();

    if (isPlatformBrowser(this.platformId)) {
      this.meta.addTags([
        { name: 'description', content: 'Interactive Leads'},
        { name: 'author', content: 'JS Desenvolvimento de Software Ltda.'}
      ]);
    }
  }

  /**
   * Translate the prime components text
   */
  private primeNgLocaleTranslations() : void {
    this.translate.get('primeng').subscribe(res => this.primengConfig.setTranslation(res));
  }
}
