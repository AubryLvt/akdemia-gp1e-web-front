import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxAwesomePopupModule, ConfirmBoxConfigModule } from "@costlydeveloper/ngx-awesome-popup";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxPaginationModule } from "ngx-pagination";
import { ToastrModule } from "ngx-toastr";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthInterceptor } from "./interceptor/auth.interceptor";
import { LoginComponent } from "./public/login/login.component";
import { ClientsComponent } from "./views/clients/clients.component";
import { InsertClientComponent } from "./views/clients/insert-client/insert-client.component";


@NgModule({
  declarations: [
    AppComponent,
    ClientsComponent,
    InsertClientComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    NgSelectModule,
    ToastrModule.forRoot(),
    NgxAwesomePopupModule.forRoot(), // Essential, mandatory main module.
    ConfirmBoxConfigModule.forRoot(),
    FormsModule,
    // Needed for instantiating confirm boxes.
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}