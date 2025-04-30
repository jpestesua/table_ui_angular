import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TableComponent } from './features/table/table.component';

@NgModule({
  imports: [BrowserModule, FormsModule, AppComponent, TableComponent],
  providers: [],
})
export class AppModule {}
