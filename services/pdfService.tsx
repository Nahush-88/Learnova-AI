import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

export const exportElementAsPDF = async (elementId: string, fileName: string) => {
  const input = document.getElementById(elementId);
  if (!input) {
    console.error(`Element with id "${elementId}" not found.`);
    alert("Could not find content to export.");
    return;
  }

  try {
    const canvas = await html2canvas(input, {
      scale: 2, // Increase scale for better resolution
      useCORS: true,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jspdf('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = canvasWidth / canvasHeight;
    
    let imgWidth = pdfWidth - 20; // with margin
    let imgHeight = imgWidth / ratio;

    // If the image is too tall for one page, split it
    let heightLeft = imgHeight;
    let position = 10; // top margin

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= (pdfHeight - 20);

    while (heightLeft > 0) {
      position = -heightLeft - 10;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - 20);
    }

    pdf.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("An error occurred while exporting to PDF.");
  }
};