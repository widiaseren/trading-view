declare module "dom-to-pdf" {
  export interface DomToPdfOptions {
    filename?: string;
    margin?: number;
    image?: {
      type?: string;
      quality?: number;
    };
    html2canvas?: {
      scale?: number;
      backgroundColor?: string;
      useCORS?: boolean;
    };
    jsPDF?: {
      unit?: string;
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
