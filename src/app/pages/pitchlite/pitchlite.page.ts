import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { ScrollImageComponent } from '../../components/scroll-image-selector/scroll-image-selector.component';
import { ChromaticTunerComponent } from 'src/app/components/chromatic-tuner/chromatic-tuner.component';
import { RefFreqService } from 'src/app/services/ref-freq.service';

@Component({
  selector: 'app-pitchlite',
  templateUrl: 'pitchlite.page.html',
  styleUrls: ['pitchlite.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonicModule, FontAwesomeModule, ScrollImageComponent, CommonModule, ChromaticTunerComponent],
})
export class PitchComponent implements OnInit{
  refFrequencyValue$!: number

  constructor(private refFreqService: RefFreqService) { }

  ngOnInit(): void {
    this.refFreqService.getRefFrequency().subscribe(value => {
      this.refFrequencyValue$ = value;
    });
  }
}
