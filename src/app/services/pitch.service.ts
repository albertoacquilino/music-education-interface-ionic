import { Injectable } from '@angular/core';
import init, {
    AutocorrelationDetector,
    McLeodDetector,
} from 'pitch-detection-wasm';
import { interval, take } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PitchService {
    createDetector!: CallableFunction;
    getPitch!: CallableFunction;


    constructor() {
        this.init();
    }

    async init() {
        await init('./pitch_detection_wasm_bg.wasm');

        let detector:
            | AutocorrelationDetector
            | McLeodDetector
            | undefined = undefined;


        this.createDetector = (name: string, size: number, padding: number) => {
            if (detector) {
                detector.free();
                detector = undefined;
            }
            switch (name) {
                case 'autocorrelation': {
                    detector = AutocorrelationDetector.new(size, padding);
                    break;
                }
                case 'mcleod': {
                    detector = McLeodDetector.new(size, padding);
                    break;
                }
                default: {
                    throw new Error(`Detector type not recognized: ${name}`);
                }
            }
        }

        this.getPitch = (signal: Float32Array, sampleRate: number, powerThreshold: number, clarityThreshold: number) => {
            if (!detector) {
                throw new Error(`Detector not initialized`);
            }

            let result = new Float32Array(2);
            detector.get_pitch(
                signal,
                sampleRate,
                powerThreshold,
                clarityThreshold,
                result
            );

            return result;
        }
    }



    public test(){
        if (!this.getPitch) return;

        //@ts-ignore
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let source;

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;

        interval(100).pipe(
            take(1000)
        ).subscribe(() => {
            const dataArray = new Uint8Array(bufferLength);
            analyser.getByteTimeDomainData(dataArray);
            console.log(dataArray);
        });

    }
}
