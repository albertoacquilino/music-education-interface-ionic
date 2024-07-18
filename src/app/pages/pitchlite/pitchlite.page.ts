import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
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
export class PitchComponent implements OnInit {
  @ViewChild(ChromaticTunerComponent) private chromaticTuner!: ChromaticTunerComponent;

  refFrequencyValue$!: number;
  display: boolean = true;
  constructor(
    private refFreqService: RefFreqService
  ) {

  }

  ngOnInit(): void {
    this.refFreqService.getRefFrequency().subscribe(value => {
      this.refFrequencyValue$ = value;
    });
  }

  ionViewDidLeave(): void {
    this.chromaticTuner.stop();
  }
  ionViewWillLeave() {
    // const ele = document.getElementById('keer');
    // if (ele) {
    //   ele.innerHTML = '';
    // } else {
    //   console.error("Element with ID 'keer' not found.");
    // }

    console.log("Looks like I'm about to leave :(");
    this.display = false;
  }
  ionViewDidEnter(): void {

    this.display = false;

  }

  startStop() {
    this.chromaticTuner.start();
  }
}
