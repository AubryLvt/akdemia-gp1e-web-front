import {Component, OnInit} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {Theme} from 'src/app/models/Theme';
import {Trainer} from 'src/app/models/Trainer';
import {Training} from 'src/app/models/Training';
import {ThemeService} from 'src/app/services/theme.service';
import {TrainerService} from 'src/app/services/trainer.service';
import {TrainingService} from 'src/app/services/training.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-content-dashboard',
  templateUrl: './content-dashboard.component.html',
  styleUrls: ['./content-dashboard.component.scss']
})
export class ContentDashboardComponent implements OnInit {

  constructor(
    private themeService: ThemeService, 
    private formationService: TrainingService, 
    private formateurSevice: TrainerService,private sanitizer: DomSanitizer,
    private router: Router,
    private utilsService: UtilsService){}

  listeTheme: Theme[] = [];
  listeFormation: Training[] = [];
  listeFormateur: Trainer[] = [];
  isLoading!: boolean;
      //for pagination
      page: number = 1;


  ngOnInit(): void {
    this.loadThemes();
    this.loadFormation();
    this.loadFormateur();
  }

  loadFormateur() {
    this.formateurSevice.getAll().subscribe({
      next: (data) => this.listeFormateur = data
    })
  }

  loadFormation() {
    this.formationService.getAll().subscribe({
      next: (data) => this.listeFormation = data
    })
  }

  loadThemes() {
    this.themeService.getAll().subscribe({
      next: (data) => this.listeTheme = data
    })
  }

  handlePageChange(event: number) {
    this.page = event;
  }

  getSubString(text: string) {
    return this.utilsService.getSubString(text, 30);
  }
}