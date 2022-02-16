import { Injectable } from '@angular/core';
import { Subject, ReplaySubject, Observable } from 'rxjs';

interface MathJaxConfig {
    source: string;
    integrity: string;
    id: string;
}

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        MathJax: {
            typesetPromise: () => void;
            startup: {
                promise: Promise<any>;
            };
        };
    }
}

@Injectable({
    providedIn: 'root',
})
export class MathService {
    private signal: Subject<boolean>;
    private mathJax: MathJaxConfig = {
        source: 'https://cdn.jsdelivr.net/npm/mathjax@3.0.5/es5/mml-chtml.js',
        integrity: 'sha256-CnzfCXjFj1REmPHgWvm/OQv8gFaxwbLKUi41yCU7N2s=',
        id: 'MathJaxScript',
    };
    private mathJaxFallback: MathJaxConfig = {
        source: 'assets/mathjax/mml-chtml.js',
        integrity: 'sha256-CnzfCXjFj1REmPHgWvm/OQv8gFaxwbLKUi41yCU7N2s=',
        id: 'MathJaxBackupScript',
    };

    constructor() {
        this.signal = new ReplaySubject<boolean>();
        void this.registerMathJaxAsync(this.mathJax)
            .then(() => this.signal.next())
            .catch((error) => {
                void this.registerMathJaxAsync(this.mathJaxFallback)
                    .then(() => this.signal.next())
                    // eslint-disable-next-line arrow-parens
                    .catch((err) => console.log(err));
            });
    }

    ready(): Observable<boolean> {
        return this.signal;
    }

    render(element: HTMLElement, math: string): void {
        // Take initial typesetting which MathJax performs into account
        window.MathJax.startup.promise.then(() => {
            element.innerHTML = math;
            window.MathJax.typesetPromise();
        });
    }

    private async registerMathJaxAsync(config: MathJaxConfig): Promise<any> {
        return new Promise<void>((resolve, reject) => {
            const script: HTMLScriptElement = document.createElement('script');
            script.id = config.id;
            script.type = 'text/javascript';
            script.src = config.source;
            script.integrity = config.integrity;
            script.crossOrigin = 'anonymous';
            script.async = true;
            script.onload = (): void => resolve();
            script.onerror = (error): void => reject(error);
            document.head.appendChild(script);
        });
    }
}