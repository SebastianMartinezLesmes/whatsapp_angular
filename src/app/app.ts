import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import Swal from 'sweetalert2';

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
    { ownerUserId:"6931a81cbc6a1f597075db45", userId: "u1", alias: "María", phone: "+57300...", profileImage: "https://..." },
    { ownerUserId:"6931a81cbc6a1f597075db45", userId: "u2", alias: "Pedro", phone: "+57301...", profileImage: "https://..." },
    { ownerUserId:"6931a9a7bc6a1f597075db4a", userId: "u3", alias: "Lilit", phone: "+57302...", profileImage: "https://..." },
    { ownerUserId:"6931a9a7bc6a1f597075db4a", userId: "u4", alias: "Eva", phone: "+57303...", profileImage: "https://..." },
    { ownerUserId:"6931a9bebc6a1f597075db4c", userId: "u5", alias: "Alex", phone: "+57303...", profileImage: "https://..." },
  ];

  relations = [
    { ownerUserId: "6931a81cbc6a1f597075db45", type: "familia", personA: "user123", personB: "u1", relation: "sibling" },
    { ownerUserId: "6931a81cbc6a1f597075db45", type: "amistad", personA: "user123", personB: "u2", relation: "friend" },
    { ownerUserId: "6931a9a7bc6a1f597075db4a", type: "trabajo",  personA: "user123", entity: "empresa01", relation: "compañero" }
  ];

  filterType = "";

  filteredRelations() {
    return this.relations.filter(r =>
      r.ownerUserId === this.selectedUserId &&
      (!this.filterType || r.type === this.filterType)
    );
  }


  filteredContacts() {
    return this.contacts.filter(c => c.ownerUserId === this.selectedUserId);
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

  // add contactos
  addContact() {
    Swal.fire({
      title: 'Agregar contacto',
      html: `
        <input id="name" class="swal2-input" placeholder="Nombre">
        <input id="phone" class="swal2-input" placeholder="Teléfono">
      `,
      confirmButtonText: 'Guardar',
      showCancelButton: true,
      preConfirm: () => {
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const phone = (document.getElementById('phone') as HTMLInputElement).value;
        if (!name || !phone) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return false;
        }
        return { name, phone };
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        this.contacts.push({
          ownerUserId: this.selectedUserId,
          userId: crypto.randomUUID(), // id simple
          alias: result.value.name,
          phone: result.value.phone,
          profileImage: 'https://.../default.png'
        });
      }
    });
  }

}
