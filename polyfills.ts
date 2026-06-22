if (typeof Promise !== "undefined") {
  const promiseCtor = Promise as any;

  if (typeof promiseCtor.withResolvers !== "function") {
    promiseCtor.withResolvers = function () {
      let resolve: (value?: unknown) => void;
      let reject: (reason?: unknown) => void;

      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });

      return {
        promise,
        resolve: resolve!,
        reject: reject!,
      };
    };
  }
}
