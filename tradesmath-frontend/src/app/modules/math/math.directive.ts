import {
    Directive,
    OnChanges,
    OnInit,
    Input,
    ElementRef,
    OnDestroy,
    SimpleChanges,
} from '@angular/core';
import { Subject } from 'rxjs';
import { MathService } from './math.service';
import { take, takeUntil } from 'rxjs/operators';

@Directive({
    selector: '[appMath]',
})
export class MathDirective implements OnInit, OnChanges, OnDestroy {
    @Input() public appMath: string | undefined;
    private alive$ = new Subject<boolean>();
    private readonly el: HTMLElement;

    constructor(
        private mathService: MathService,
        private elementRef: ElementRef
    ) {
        this.el = elementRef.nativeElement;
    }

    ngOnInit(): void {
        this.render();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes['appMath'] && changes['appMath'].currentValue) {
            this.render();
        }
    }

    ngOnDestroy(): void {
        this.alive$.next(false);
    }

    private render(): void {
        this.mathService
            .ready()
            .pipe(take(1), takeUntil(this.alive$))
            .subscribe(() =>
                this.mathService.render(this.el, this.appMath ?? '')
            );
    }
}
