export {};

// Ambient declaration so TypeScript can resolve side-effect CSS imports
// (e.g. react-pdf and react-datepicker stylesheets). Next.js handles the
// actual bundling of these at build time.
declare module "*.css";

declare global {
  interface Window {
    Digit: any;
    globalConfigs: {
      getConfig: (key: string) => string;
    };
  }
}