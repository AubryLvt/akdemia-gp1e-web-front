import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  dashboardLink: string = "/dashboard"
  themesLink: string = '/dashboard/catalogues/themes';
  formationsLink: string ="/dashboard/catalogues/formations";
  formateursLink: string = "/dashboard/formateurs";
  clientsLink: string = "/dashboard/clients";
  sessionsLink: string = "/dashboard/sessions"
  catalogueLink: string = "/dashboard/catalogues";

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

  }

  logout() {
    Swal.fire({
      title: 'voulez vous vraiment vous déconnecter?',
      text: 'vous allez perdre votre session!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, Poursuivre',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.router.navigateByUrl('/public/login');
      }
    });
  }
}
