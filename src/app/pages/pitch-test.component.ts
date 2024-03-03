import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, OnDestroy } from "@angular/core";
import { PitchService } from "../services/pitch.service";
import { Observable } from "rxjs";

@Component({
    selector: "app-test-pitch",
    template: `
    <button (click)="start()">start</button>
    <div> {{ pitch$ | async  }} </div>
    `,
    styles: [],
    standalone: true,
    imports: [CommonModule]
})
export class PitchTestComponent implements AfterViewInit, OnDestroy {
    public pitch$!: Observable<Uint8Array>;
    constructor(private pitchService: PitchService) { }

    async ngAfterViewInit() {

    }

    async ngOnDestroy() {
        // await this.pitchService.destroy();
    }

    async start() {
        // await this.pitchService.init();
        // this.pitch$ = this.pitchService.getPitch$();
    }

}