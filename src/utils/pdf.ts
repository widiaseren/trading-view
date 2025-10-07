import domtoPDF from "dom-to-pdf";

export const exportDivToPDF = (div: HTMLDivElement | null, filename: string) => {
  if (!div) return;

  const opt = {
    filename,
    margin: 0.2,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  const hiddenEls = div.querySelectorAll(".hide-on-export");
  hiddenEls.forEach((el) => ((el as HTMLElement).style.display = "none"));

  domtoPDF(div, opt, () => {
    hiddenEls.forEach((el) => ((el as HTMLElement).style.display = ""));
  });
};
