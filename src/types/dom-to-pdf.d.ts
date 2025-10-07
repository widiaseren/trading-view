declare module "dom-to-pdf" {
  export interface DomToPdfOptions {
    filename?: string;
    margin?: number;
    jsPDF?: {
      format?: string | string[];
      orientation?: "portrait" | "landscape";
    };
  }

  export default function domToPdf(
    element: HTMLElement,
    options?: DomToPdfOptions,
    callback?: () => void
  ): void;
}
