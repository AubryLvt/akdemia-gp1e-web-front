import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmBoxEvokeService } from '@costlydeveloper/ngx-awesome-popup';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Trainer } from 'src/app/models/Trainer';
import { Session } from 'src/app/models/Session';
import { AlertService } from 'src/app/services/alert.service';
import { SessionService } from 'src/app/services/session.service';
import { UtilsService } from 'src/app/services/utils.service';
import { tap } from 'rxjs';
import { provideClientHydration } from '@angular/platform-browser';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent implements OnInit {
  convert(arg0: number) {
    return Math.ceil(arg0);
  }

  // -------------------------------------- //
  // Déclaration des propriétés nécessaires //
  // -------------------------------------- //
  sessionForm!: FormGroup;
  sessionValue!: Session;
  modalRef!: NgbModalRef;
  searchVisibility!: boolean;

  //for search
  sessionAll: Session[] = [];
  sessionAllReserved: Session[] = [];
  sessionSearch: Session[] = [];

  //for filter
  filterForm!: FormGroup;
  searchForm!: FormGroup;

  //for pagination
  page: number = 1;
  position: number = 1;

  sessionUpdateForm!: FormGroup;
  isLoading!: boolean;
  isFormSessionLoading!: boolean;

  constructor(
    private sessionService: SessionService, // Injection des services nécessaires
    private toastService: ToastrService,
    private utilsService: UtilsService,
    private alert: AlertService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: ConfirmBoxEvokeService
  ) {}

  ngOnInit(): void {
    this.innitForm(); // Initialisation du formulaire
    this.getAllSession(); // Récupération de toutes les Session
    this.searchVisibility = false; // Initialisation de la visibilité de la recherche
  }

  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1; // Sélection de la page actuelle
  }

  // Initialisation des formulaires
  innitForm() {
    // Formulaire d'ajout d'une session
    this.sessionForm = new FormGroup({
      description: new FormControl(''),
      duration: new FormControl(''),
      date: new FormControl(''),
      location: new FormControl(''),
      price: new FormControl(''),
    });

    // Création du formulaire pour la recherche
    this.searchForm = new FormGroup({
      keyWord: new FormControl(''),
    });

    // Création du formulaire pour le filtre
    this.filterForm = new FormGroup({
      filter: new FormControl(20),
    });

    // Formulaire de mise à jour de la session
    this.sessionUpdateForm = this.formBuilder.group({
      // Champs disponibles pour la mise à jour par les utilisateurs :
      description: ['', Validators.required],
      status: ['', Validators.required],
      duration: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required],
      price: ['', Validators.required],
    });
  }

  // Méthode de recherche par mot-clé
  searchBy() {
    this.sessionAll = this.sessionAllReserved;
    const keyword = this.searchForm.value.keyWord.toLowerCase().trim();
    if (keyword === '') {
      return;
    }
    this.sessionAll = this.sessionAll.filter((session: Session) =>
      Object.values(session).some(
        (value: any) =>
          typeof value === 'string' && value.toLowerCase().includes(keyword)
      )
    );
  }

  // Méthode pour changer la visibilité de la barre de recherche
  changeSearchVisibility() {
    this.searchVisibility = !this.searchVisibility;
  }

  // Méthode pour gérer le changement de page
  handlePageChange(event: number) {
    this.page = event;
  }

  // AUTRES METHODES

  // Récupération de toutes les session
  getAllSession() {
    this.isLoading = true;
    this.sessionService.getAll().subscribe(
      (data) => {
        this.sessionAll = data;
        this.sessionAllReserved = data;
        this.isLoading = false;
      },
      (err) => {
        this.alert.alertError(
          err.error !== null
            ? err.error.message
            : 'Impossible de récupérer les sessions'
        );
      }
    );
  }

  // Enregistrement d'une nouvelle session
  saveSession() {
    this.isFormSessionLoading = true;
    let sessionSave = this.createSession();
    this.sessionService.save(sessionSave).subscribe(
      (value) => {
        let sessionResponse = value;
        this.toastService.success('Enregistrement effectué avec succès !');
        this.isFormSessionLoading = false;
        this.sessionForm.reset();
        setTimeout(() => {
          this.sessionForm.reset();
          window.location.reload();
        }, 1000);
      },
      (error) => {
        console.log(error);
        if (error.error == null) {
          this.toastService.error(
            "Une erreur est survenue lors de l'enregistrement d'une session"
          );
          this.isFormSessionLoading = false;
        } else {
          this.toastService.error(error.error.message);
          this.isFormSessionLoading = false;
        }
      }
    );
  }

  // Création d'un objet session à partir du formulaire
  createSession(): Session {
    // Assignation des valeurs du formulaire à l'objet session
    this.sessionValue = this.sessionForm.value;
    this.sessionValue.description = this.sessionForm.value.description;
    this.sessionValue.duration = this.sessionForm.value.duration;
    this.sessionValue.date = this.sessionForm.value.date;
    this.sessionValue.location = this.sessionForm.value.location;
    this.sessionValue.price = this.sessionForm.value.price;
    this.sessionValue.creationDate = new Date();
    return this.sessionValue;
  }

  // Suppression d'une session
  sessionDelete(id: number) {
    this.alertService
      .customFour(
        'Etes-vous sûr de vouloir effectuer cette suppression?',
        'Cette action est irréversible!',
        'Confirmer',
        'Annuler'
      )
      .subscribe(
        (resp) => {
          if (resp.success) {
            this.sessionService.delete(id).subscribe(() => {
              this.getAllSession();
              this.toastService.success('Supprimé avec succès');
              this.toastService.success('Suppression effectuée avec succès');
            });
          }
        },
        (err) => {
          this.toastService.error(
            err.error !== null
              ? err.error.message
              : 'Impossible de supprimer la session'
          );
        }
      );
  }

  goToEdit(id: number) {
    this.router.navigateByUrl(`dashboard/InsertSessionComponent/${id}`);
  }

  // Mise à jour des informations d'une session
  updateSession() {
    this.isFormSessionLoading = true;
    let sessionUpdate = this.sessionUpdateForm.value;
    const sessionId = sessionUpdate.id;
    let creationDate = sessionUpdate.creationDate;
    sessionUpdate.updateDate = new Date();

    this.sessionService
      .edit(sessionId, sessionUpdate)
      .pipe(
        tap(
          (value) => {
            let sessionResponse = value;
            this.toastService.success('Modification effectuée avec succès !');
            this.isFormSessionLoading = false;
            this.sessionUpdateForm.reset();

            setTimeout(() => {
              this.sessionUpdateForm.reset();
              window.location.reload();
            }, 10);
          },
          (error) => {
            if (error.error == null) {
              this.toastService.error(
                "Une erreur est survenue lors de l'enregistrement de la session"
              );
              this.isFormSessionLoading = false;
            } else {
              this.toastService.error(error.error.message);
              this.isFormSessionLoading = false;
            }
          }
        )
      )
      .subscribe();
  }

  // Obtention d'une sous-chaîne de texte
  getSubString(text: string) {
    return this.utilsService.getSubString(text, 30);
  }
}
