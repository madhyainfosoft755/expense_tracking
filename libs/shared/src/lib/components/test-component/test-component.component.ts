import { Component } from '@angular/core';

@Component({
  selector: 'lib-test-component',
  template: `Test component works!`,
})
export class TestComponent {
    constructor(){
        console.log('Test compoentent loaded');
    }
}