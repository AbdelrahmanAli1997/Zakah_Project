import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-zakah-guide',
  templateUrl: './zakah-guide.html',
  styleUrls: ['./zakah-guide.css'],
})
export class ZakahGuide {
  guideSections = signal([
    { id: 'what-is-zakah', title: 'ما هي الزكاة؟' },
    { id: 'what-is-nisab', title: 'ما هو النصاب؟' },
    { id: 'what-is-hawl', title: 'ما هو الحول؟' },
    { id: 'what-assets-are-zakatable', title: 'ما هي الأصول التي تجب فيها الزكاة؟' },
  ]);

  activeSectionId = signal(this.guideSections()[0].id);

  selectSection(id: string) {
    this.activeSectionId.set(id);
    const element = document.getElementById('guide-content-top');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
