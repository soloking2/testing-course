import { fakeAsync, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe("Async Testing Example", () => {
  it("Asynchronous test example with Jasmine done()", (done:DoneFn) => {
    let test = false;

    setTimeout(() => {
      console.log("running assertions");
      test = true;
      expect(test).toBeTruthy();
      done()
    }, 1000)
  });
  it("Asynchronous test example - setTimeout()", fakeAsync(() => {
    let test = false;
    setTimeout(() => {
      console.log("running assertions");
      test = true;
      expect(test).toBeTruthy();

    }, 1000);

    tick(1000)
  }));
  it("Asynchronous test example with plain promise", fakeAsync(() => {
    let test = false;
    Promise.resolve()
    .then(() => {
      test = true;
      return Promise.resolve();
    })
    .then(() => {
      console.log('Promise second then() evaluated successfully');
    })

    flushMicrotasks();

      console.log("running assertions");

      expect(test).toBeTruthy();
  }));
  it("Asynchronous test example with promises + setTimeout()", fakeAsync(() => {
    let counter = 0;
    Promise.resolve()
    .then(() => {
      counter += 10;

      setTimeout(() => {
        counter += 1;
      }, 1000)
    })
    expect(counter).toBe(0);
    flushMicrotasks();
    expect(counter).toBe(10);
    tick(1000);
    expect(counter).toBe(11)
  }));

  it("Asynchronous test examples - Observable", fakeAsync(() => {
    let test = false;
    console.log("Creating observable");
    const test$ = of(test).pipe(delay(1000));
    test$.subscribe(() => {
      test = true;
    });

    tick(1000);
    expect(test).toBe(true)
  }))



})
