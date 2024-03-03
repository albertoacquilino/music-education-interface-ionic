import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as pitchlite from 'src/app/services/pitchlite';


const worklet_chunk_size = 128;
const big_win = 4096;
const small_win = 512;
const min_pitch = 140; // lower pitch of mpm, 140 hz is close to trumpet
const use_yin = false; // use MPM by default

function scaleArrayToMinusOneToOne(array: number[]) {
    const maxAbsValue = Math.max(...array.map(Math.abs));
    return array.map((value) => value / maxAbsValue);
}

const audioContext = new AudioContext();
console.log("Sample rate:", audioContext.sampleRate);

let wasmModule: any;
let ptr: any;
let ptrPitches: any;
let stream: any;
let node: any;
let isStopped = false;

let nAccumulated = 0;

let n_pitches: number;



@Injectable({
    providedIn: 'root'
})
export class PitchService {
    pitch$ = new BehaviorSubject<number>(0);

    constructor() { }

    async addModule() {
        await audioContext.audioWorklet.addModule('audio-accumulator.js');
        // Create an instance of your custom AudioWorkletNode
        node = new AudioWorkletNode(audioContext, 'audio-accumulator', {
            numberOfInputs: 1,
            numberOfOutputs: 1,
            outputChannelCount: [2],
        });

        // Connect the microphone stream to the processor
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(node);

        // Connect to the destination
        node.connect(audioContext.destination);

        // In the onmessage event handler of your AudioWorkletNode.port
        // append received data to the ring buffer
        node.port.onmessage = (event: any) => {
            // Check if the "stop" button has been clicked
            if (isStopped) {
                return;
            }
            // event.data contains 128 samples of audio data from
            // the microphone through the AudioWorkletProcessor

            // scale event.data.data up to [-1, 1]
            const scaledData = scaleArrayToMinusOneToOne(event.data.data);

            // Calculate the offset in bytes based on naccumulated
            const offset = (nAccumulated * worklet_chunk_size) * Float32Array.BYTES_PER_ELEMENT;

            // store latest 128 samples into the WASM buffer
            wasmModule.HEAPF32.set(scaledData, (ptr + offset) / Float32Array.BYTES_PER_ELEMENT);
            nAccumulated += 1;

            // Check if we have enough data to calculate the pitch
            if (nAccumulated >= (big_win / worklet_chunk_size)) {
                console.log("Accumulated enough data, calculating pitch")
                nAccumulated = 0; // reset the accumulator

                // Call the WASM function
                wasmModule._pitchlitePitches(ptr, ptrPitches);

                // copy the results back into a JS array
                let wasmArrayPitches = new Float32Array(wasmModule.HEAPF32.buffer, ptrPitches, n_pitches);

                this.pitch$.next(wasmArrayPitches[n_pitches - 1]);

                // clear the entire buffer
                wasmModule._memset(ptr, 0, big_win * Float32Array.BYTES_PER_ELEMENT);
            }
        };
    }

    async connect() {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        this.addModule();

        const module = await pitchlite();
        wasmModule = module;
        n_pitches = (module as any)._pitchliteInit(
            big_win,
            small_win,
            audioContext.sampleRate, // use the actual sample rate of the audio context
            use_yin, // use yin
            min_pitch, // mpm low pitch cutoff
        );

        // Create WASM views of the buffers, do it once and reuse
        ptr = wasmModule._malloc(big_win * Float32Array.BYTES_PER_ELEMENT);
        ptrPitches = wasmModule._malloc(n_pitches * Float32Array.BYTES_PER_ELEMENT);

        console.log("Created pitches buffer of size", n_pitches);
        console.log("WASM module initialized, buffers allocated");
    }

    disconnect() {
        console.log("Stopping and disconnecting and cleaning up")
        isStopped = true;

        // disconnect the audio worklet node
        node.disconnect();

        // stop tracks
        stream.getTracks().forEach(function (track: any) {
            console.log('Stopping stream');
            // Here you can free the allocated memory
            track.stop();
        });

        // cleanup
        wasmModule._free(ptrPitches);
        wasmModule._free(ptr);
    }

}
