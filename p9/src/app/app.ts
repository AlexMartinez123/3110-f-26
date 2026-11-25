import { Component, signal } from '@angular/core';
import { P1Console } from './p1-console/p1-console';
import { P2Dom } from './p2-dom/p2-dom';
import { P3Form } from './p3-form/p3-form';
import { P4Delete } from './p4-delete/p4-delete';

@Component({
  selector: 'app-root',
  imports: [P1Console, P2Dom, P3Form, P4Delete],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Company Directory - Angular Phase 1');
}
