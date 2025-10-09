import domtoPDF from "dom-to-pdf";

export async function exportDivToPDF(
  elementOrId: HTMLElement | string | null,
  filename: string
) {
  const element =
    typeof elementOrId === "string"
      ? document.getElementById(elementOrId)
      : elementOrId;

  if (!element) {
    console.warn("exportDivToPDF: element not found");
    return;
  }

  const overlay = document.createElement("div");
  overlay.id = "__export_overlay__";
  Object.assign(overlay.style, {
    position: "fixed",
    inset: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.6)",
    zIndex: "99999",
    pointerEvents: "none",
    fontSize: "18px",
    color: "#111",
  });
  overlay.textContent = "Preparing PDF…";
  document.body.appendChild(overlay);

  try {
    const clone = element.cloneNode(true) as HTMLElement;

    clone.querySelectorAll(".hide-on-export").forEach((el) => el.remove());

    const originals = element.querySelectorAll("canvas");
    const cloneCanvases = clone.querySelectorAll("canvas");
    const count = Math.min(originals.length, cloneCanvases.length);

    for (let i = 0; i < count; i++) {
      const orig = originals[i] as HTMLCanvasElement;
      const cloneCanvas = cloneCanvases[i] as HTMLCanvasElement;
      if (!orig || !cloneCanvas) continue;

      let dataUrl: string | null = null;
      try {
        dataUrl = orig.toDataURL("image/png");
      } catch (err) {
        console.log(err)
        dataUrl = null;
      }

      if (!dataUrl) {
        try {           
          const html2canvasModule = await import("html2canvas");
          const html2canvas = html2canvasModule.default ?? html2canvasModule;
          const snap = await html2canvas(orig as HTMLElement, {
            useCORS: true,
            backgroundColor: null,
            scale: 2,
          });
          dataUrl = snap.toDataURL("image/png");
        } catch (err) {
          console.error(
            "exportDivToPDF: failed to snapshot canvas with html2canvas",
            err
          );
          dataUrl = null;
        }
      }

      if (dataUrl) {
        const img = document.createElement("img");
        const rect = (orig as HTMLElement).getBoundingClientRect();
        img.src = dataUrl;
        img.style.width = `${rect.width}px`;
        img.style.height = `${rect.height}px`;
        img.style.display = getComputedStyle(cloneCanvas).display || "block";
        cloneCanvas.replaceWith(img);
      } else {
        cloneCanvas.remove();
      }
    }

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
      pagebreak: { mode: ["css", "legacy"] },
    };

    // domtoPDF accepts a callback when done 
    await new Promise<void>((resolve) => {
      domtoPDF(clone, opt as never, (pdf) => {
        // Add page numbers
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(10);
          pdf.text(
            `Page ${i} of ${totalPages}`,
            pdf.internal.pageSize.getWidth() - 60,
            pdf.internal.pageSize.getHeight() - 20
          );
        }
        pdf.save(filename);
        resolve();
      });
    });
  } finally {
    const el = document.getElementById("__export_overlay__");
    if (el) el.remove();
  }
}
