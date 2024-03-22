import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemesComponent } from './themes.component';

// Ce fichier est un fichier de test unitaire pour le composant ThemesComponent d'Angular. 
// Il vérifie si le composant est créé avec succès.

describe('ThemesComponent', () => {
  // Déclaration des variables du composant et du fixture
  let component: ThemesComponent;
  let fixture: ComponentFixture<ThemesComponent>;

  beforeEach(() => {
    // Configuration du module de test
    TestBed.configureTestingModule({
      declarations: [ThemesComponent]
    });
    
    // Création du composant et du fixture
    fixture = TestBed.createComponent(ThemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test de création du composant
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
