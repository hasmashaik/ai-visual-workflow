// This file tells TypeScript that CSS files can be imported
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}