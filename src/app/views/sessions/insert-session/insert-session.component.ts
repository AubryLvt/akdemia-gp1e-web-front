import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Session } from 'src/app/models/Session';
import { AlertService } from 'src/app/services/alert.service';
import { SessionService } from 'src/app/services/session.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-insert-session',
  templateUrl: './insert-session.component.html',
  styleUrls: ['./insert-session.component.scss'],
})
export class InsertSessionComponent implements OnInit {
  constructor(
    private sessionService: SessionService,
    private router: Router,
    private route: ActivatedRoute,
    private alert: AlertService,
    private datePipe: DatePipe
  ) {}

  sessionForm!: FormGroup; // Formulaire réactif pour les données de l'entité
  isLoading: boolean = false; // Indicateur de chargement
  idSession: any; // Identifiant de l'entité à éditer

  ngOnInit(): void {
    // Initialisation du formulaire
    this.initForm();
    // Récupération de l'identifiant du formateur depuis l'URL
    this.idSession = this.route.snapshot.paramMap.get('id');
    // Récupération des données de l'entité à éditer
    this.getById(this.idSession);
  }

  // Méthode d'initialisation du formulaire
  initForm() {
    this.sessionForm = new FormGroup({
      // Champs du formulaire
      id: new FormControl(),
      description: new FormControl(),
      duration: new FormControl(),
      date: new FormControl(),
      location: new FormControl(),
      price: new FormControl(),
    });
  }

  // Méthode pour récupérer les données de l'entité à partir de son identifiant
  getById(id: any) {
    this.sessionService.getById(id).subscribe({
      next: (data: Session) => {
        this.sessionForm.patchValue(data); // Remplissage du formulaire avec les données déjà existantes
      },
      error: (err) => {
        this.alert.alertError("Impossible de récupérer l'identifiant"); // Affichage d'une alerte en cas d'erreur
      },
    });
  }

  // Méthode pour annuler et retourner à l'adresse indiqué
  cancel() {
    this.router.navigate(['dashboard/sessions']);
  }

  saveOrUpdate() {
    // Activation de l'indicateur de chargement
    this.isLoading = true;
    // Récupération des données du formulaire
    const form = this.sessionForm.value;

    // Mise à jour de la date de modification
    this.sessionForm.patchValue({
      updateDate: this.getCurrentDate(),
    });

    this.sessionService.edit(this.idSession, form).subscribe(
      () => {
        // Désactivation de l'indicateur de chargement après la modification réussie
        this.isLoading = false;
        // Affichage d'une notification de succès
        Swal.fire('Modifié!', 'Modification effectuée avec succès.', 'success');
        // Redirection après la fin de la modification
        this.router.navigate(['dashboard/sessions']);
      },
      (err) => {
        // Désactivation de l'indicateur de chargement en cas d'erreur
        this.isLoading = false;
        // Affichage d'une alerte en cas d'erreur
        this.alert.alertError("Une erreur s'est produite");
      }
    );
  } // END SaveOrUpdate Method

  getCurrentDate(): string {
    const currentDate = new Date();
    return this.datePipe.transform(currentDate, 'dd-MM-yyyy') || '';
  }
} // END InsertSessionComponent Class
