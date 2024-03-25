import { Injectable } from '@angular/core';
import { Theme } from '../models/Theme';
import { CrudService } from './crud.service';
import { HttpClient } from '@angular/common/http'; // Import du module HttpClient pour effectuer des requêtes HTTP
import { URL_BASE } from '../conf/constant';
import { Observable } from 'rxjs'; // Import de Observable depuis RxJS pour gérer les flux de données asynchrones

// Décorateur Injectable pour indiquer que ce service peut être injecté dans d'autres composants
@Injectable({
  providedIn: 'root' 
  // Déclaration du service en tant que service racine, ce qui permet à Angular
  // de le fournir automatiquement à toute l'application
})

export class ThemeService extends CrudService<Theme> {

  constructor(private http: HttpClient) {
    const url: string = URL_BASE;
    super(http, `${url}/themes`);
  }
}

// Ici, on utilise le module HttpClient pour envoyer des requêtes HTTP au serveur, 
// notamment pour récupérer des données de thèmes à partir de l'API 
// et pour effectuer des opérations CRUD (Create, Read, Update, Delete).