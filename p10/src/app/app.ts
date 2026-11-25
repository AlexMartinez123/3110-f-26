import { Component, signal } from '@angular/core';
import { P1Console } from './p1-console/p1-console';
import { P2Dom } from './p2-dom/p2-dom';
import { P3Form } from './p3-form/p3-form';
import { P4Delete } from './p4-delete/p4-delete';
import { P5Modal } from './p5-modal/p5-modal';
import { P6Crud } from './p6-crud/p6-crud';

@Component({
  selector: 'app-root',
  imports: [P1Console, P2Dom, P3Form, P4Delete, P5Modal, P6Crud],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Company Directory - Angular Phase 2');
}
