import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('whatsapp');

  users: any[] = [];
  user: any = null;      // usuario activo
  selectedUserId: string = "";  // id seleccionado en el select

  ngOnInit() {
    fetch('/data/TREE_simulate.users.json')
      .then(res => res.json())
      .then(data => {
        this.users = data;

        // por defecto, el primero
        this.user = this.users[0];
        this.selectedUserId = this.user._id.$oid;
      });
  }

  changeUser() {
    this.user = this.users.find(u => u._id.$oid === this.selectedUserId);
  }

  contacts = [
    { userId: "u1", alias: "María", phone: "+57300...", profileImage: "https://..." },
    { userId: "u2", alias: "Pedro", phone: "+57301...", profileImage: "https://..." }
  ];

  relations = [
    { type: "familia", personA: "user123", personB: "u1", relation: "sibling" },
    { type: "amistad", personA: "user123", personB: "u2", relation: "friend" },
    { type: "trabajo",  personA: "user123", entity: "empresa01", relation: "compañero" }
  ];

  filterType = "";

  filteredRelations() {
    if (!this.filterType) return this.relations;
    return this.relations.filter(r => r.type === this.filterType);
  }

  getLabel(r: any) {
    if (r.personB) {
      const contact = this.contacts.find(c => c.userId === r.personB);
      return contact ? contact.alias : r.personB;
    }

    if (r.entity) {
      return `Empresa: ${r.entity}`;
    }

    return "(sin datos)";
  }
}
