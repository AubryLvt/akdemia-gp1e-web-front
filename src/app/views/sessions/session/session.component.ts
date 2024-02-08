import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Route } from '@angular/router';
import { Employee } from 'src/app/models/Employee';
import { EmployeeSubscription } from 'src/app/models/EmployeeSubscription';
import { InterSession } from 'src/app/models/InterSession';
import { IntraSession } from 'src/app/models/IntraSession';
import { Particular } from 'src/app/models/Particular';
import { ParticularSubscription } from 'src/app/models/ParticularSubscription';
import { User } from 'src/app/models/User';
import { AlertService } from 'src/app/services/alert.service';
import { EmployeeSubscriptionService } from 'src/app/services/employee-subscription.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { InterSessionService } from 'src/app/services/inter-session.service';
import { IntraSessionService } from 'src/app/services/intra-session.service';
import { ParticularSubscriptionService } from 'src/app/services/particular-subscription.service';
import { ParticularService } from 'src/app/services/particular.service';
import { SessionService } from 'src/app/services/session.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {


  id!: number;
  //for search
  allUsers: User[] = [];
  UserAllReserved: User[] = [];
  UserSearch: User[] = [];
  allEmployeeSubcriptionReserved: EmployeeSubscription[] = [];
  allParticularSubscriptionReserved: ParticularSubscription[] = [];
  allEmployeeSubcriptionSearch: EmployeeSubscription[] = [];
  allParticularSubscriptionSearch: ParticularSubscription[] = [];
  searchVisibility!: boolean;
  //for filter
  filterForm!: FormGroup;
  searchForm!: FormGroup;
  //for pagination
  page: number = 1;
  position: number = 1;
  date!: Date;

  interSessionDetail!: InterSession;
  intraSessionDetail!: IntraSession;
  allEmployeeSubcriptions: EmployeeSubscription[] = [];
  allParticularSubscriptions: ParticularSubscription[] = [];
  allEmployees!: Employee[];
  allParticular!: Particular[];
  formSubscription!: FormGroup;
  particularSubscription!: ParticularSubscription;
  employeeSubscription!: EmployeeSubscription;


  isLoading!: boolean;
  currentSegment!: string;
  isInterSession!: boolean;
  isIntraSession!: boolean;
  progression!: string;

  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private alert: AlertService,
    private interSessionService: InterSessionService,
    private intraSessionService: IntraSessionService,
    private employeeService: EmployeeService,
    private particularService: ParticularService,
    private particularSuscriptionService: ParticularSubscriptionService,
    private employeeSubscriptionService: EmployeeSubscriptionService,
    private alertService: AlertService

  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.currentSegment = this.route.snapshot.url[1]?.path || '';

    if (this.currentSegment == "inter") {
      this.isInterSession = true;
      this.isIntraSession = false;

      this.getInterById();
      this.getAllParticulars();
    }
    else {
      this.isInterSession = false;
      this.isIntraSession = true;

      this.getIntraById();
      this.getAllEmployees();

    }

    // this.getAllUsers();
    this.innitForm();

    this.searchVisibility = false;
  }

  getAllEmployees() {
    this.employeeService.getAll().subscribe({
      next: (result) => {
        this.allEmployees = result;
      },
      error: (err) => {
        this.alert.alertError(err.error.message ? err.error.message : 'Impossible de récupérer les employés');
      }
    })
  }

  handlePageChange(event: number) {
    this.page = event;
  }

  changeSearchVisibility() {
    this.searchVisibility = !this.searchVisibility;
  }

  getAllParticulars() {
    this.particularService.getAll().subscribe({
      next: (result) => {
        this.allParticular = result;
      },
      error: (err) => {
        this.alert.alertError(err.error !== null ? err.error.message : 'Impossible de récupérer les particuliers');
      }
    })
  }

  innitForm() {
    this.formSubscription = new FormGroup({
      participants: new FormControl([])
    });

    this.searchForm = new FormGroup({
      keyWord: new FormControl('')
    });

    this.filterForm = new FormGroup({
      filter: new FormControl(20)
    })
  }

  getInterById() {
    this.isLoading = true;
    this.interSessionService.getById(this.id).subscribe({
      next: (result) => {
        this.interSessionDetail = result;
        this.allParticularSubscriptions = result.particularSubscriptions;
        this.allParticularSubscriptionReserved = result.particularSubscriptions;
        this.date = this.interSessionDetail.date;
        this.progression = this.getProgression() + '%';
        this.isLoading = false;
      },
      error: (err) => {
        if (err.error != null) {
          this.alert.alertError(err.error.message);
        } else {
          this.alert.alertError("la session n'a pas pu être chargé veillez réessayer plustard");
          this.isLoading = false;
        }
      },
      complete: () => {
        this.getProgression()
      }
    })
  }

  getIntraById() {
    this.isLoading = true;
    this.intraSessionService.getById(this.id).subscribe({
      next: (result) => {

        this.intraSessionDetail = result;
        this.allEmployeeSubcriptions = result.employeeSubscriptions;
        this.allEmployeeSubcriptionReserved = result.employeeSubscriptions;
        this.date = this.intraSessionDetail.date;
        this.progression = this.getProgression() + '%';
        this.isLoading = false;
      },
      error: (err) => {
        if (err.error != null) {
          this.alert.alertError(err.error.message);
        } else {
          this.alert.alertError("la session n'a pas pu être chargé veillez réessayer plustard");
          this.isLoading = false;
        }
      },
      complete: () => {
        this.getProgression()
      }
    })
  }

  searchByName() {

    if (this.isInterSession) {
      this.allParticularSubscriptions = this.allParticularSubscriptionReserved;
      let table: ParticularSubscription[] = [];
      for (let i = 0; i < this.allParticularSubscriptions.length; i++) {
        if (this.allParticularSubscriptions[i].particular.firstname.toLowerCase().includes(this.searchForm.value.keyWord.toLowerCase())
          || this.allParticularSubscriptions[i].particular.lastname.toLowerCase().includes(this.searchForm.value.keyWord.toLowerCase())
          || this.allParticularSubscriptions[i].particular.email.toLowerCase().includes(this.searchForm.value.keyWord.toLowerCase())) {
          table.push(this.allParticularSubscriptions[i]);
        }
      }
      if (this.searchForm.value.keyWord.trim() == "") {
        this.allParticularSubscriptions = this.allParticularSubscriptionReserved;
      } else {
        this.allParticularSubscriptions = table;
      }
    }
    //for intra session
    else {
      this.allEmployeeSubcriptions = this.allEmployeeSubcriptionReserved;
      let table: EmployeeSubscription[] = [];
      for (let i = 0; i < this.allEmployeeSubcriptions.length; i++) {
        if (this.allEmployeeSubcriptions[i].employee.firstname.toLowerCase().includes(this.searchForm.value.keyWord.toLowerCase())
          || this.allEmployeeSubcriptions[i].employee.lastname.toLowerCase().includes(this.searchForm.value.keyWord.toLowerCase())
          || this.allEmployeeSubcriptions[i].employee.email.toLowerCase().includes(this.searchForm.value.keyWord.toLowerCase())) {
          table.push(this.allEmployeeSubcriptions[i]);
        }
      }
      if (this.searchForm.value.keyWord.trim() == "") {
        this.allEmployeeSubcriptions = this.allEmployeeSubcriptionReserved;
      } else {
        this.allEmployeeSubcriptions = table;
      }
    }
  }

  onSubscribe() {
    this.isLoading = true;
    if (this.isInterSession) {
      this.particularSuscriptionService.attach(this.interSessionDetail.id, this.formSubscription.value.participants).subscribe({
        next: (value) => {
          this.alertService.alertSuccess("vous avez bien inscrit les utilisateurs à la session " + this.interSessionDetail.code);
          this.getInterById()
          this.isLoading = false;
        },
        error: (err) => {
          this.alertService.alertError(this.getMessage(err))
          this.isLoading = false;
        }
      })
    }
    else {
      this.employeeSubscriptionService.attach(this.intraSessionDetail.id, this.formSubscription.value.participants).subscribe({
        next: (value) => {
          this.alertService.alertSuccess("vous avez bien inscrit les utilisateurs à la session " + this.intraSessionDetail.code);
          this.getIntraById();
          this.isLoading = false;
        },
        error: (err) => {
          this.alertService.alertError(this.getMessage(err))
          this.isLoading = false;
        }
      })
    }
  }

  removeUserToSession(user: string, souscriptionId: string | number) {
    Swal.fire({
      title: user + ' sera supprimé de cette session voulez vous quand même poursuivre l\'opération?',
      text: 'Cette action est irréversible!',
      icon: 'warning',
      cancelButtonText: 'Annuler',
      showCancelButton: true,
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, Poursuivre',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.isInterSession) {
          this.particularSuscriptionService.delete(souscriptionId).subscribe({
            next: () => {
              this.getInterById();
              Swal.fire(
                'Effectué',
                'L\'utilsateur a été supprimé de la session.',
                'success'
              )
            },
            error: (err) => {
              Swal.fire(
                'échec',
                this.getMessage(err),
                'warning'
              )
            }
          })
        }
        else {
          this.employeeSubscriptionService.delete(souscriptionId).subscribe({
            next: () => {
              this.getIntraById();
              Swal.fire(
                'Effectué',
                'L\'utilsateur a été enlevé de la session.',
                'success'
              );
            },
            error: (err) => {
              Swal.fire(
                'échec',
                this.getMessage(err),
                'warning'
              )
            }
          })
        }

      }
    })

  }

  getMessage(err: any): string {
    if (err.error != null)
      return err.error.message;
    else
      return "échec lors de la suppression"
  }

  getProgression(): number {
    const date2 = new Date();
    const todayDate = new Date(this.date);
    const diffMillis = todayDate.getTime() - date2.getTime();
    const diffDays = Math.floor(diffMillis / (1000 * 60 * 60 * 24));
    const percentage = 100 - diffDays;
    return percentage >= 0 ? percentage : 1;
  }
}