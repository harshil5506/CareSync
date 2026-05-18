import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = join(fileURLToPath(import.meta.url), '..');

export const generatePrescriptionPDF = (prescription, patient, doctor) => {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `prescription_${prescription._id}_${Date.now()}.pdf`;
      const filePath = join(__dirname, '../..', 'uploads', fileName);

      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
      });

      const stream = createWriteStream(filePath);
      doc.pipe(stream);

      // Header
      doc.fontSize(20).font('Helvetica-Bold').text('CareSync', 50, 50);
      doc.fontSize(10)
        .font('Helvetica')
        .text('Patient Management System', 50, 75);
      doc.moveTo(50, 90).lineTo(550, 90).stroke();

      // Prescription Details
      doc.fontSize(14).font('Helvetica-Bold').text('Prescription', 50, 110);

      // Patient Info
      doc.fontSize(10).font('Helvetica-Bold').text('Patient Information:', 50, 140);
      doc.fontSize(9)
        .font('Helvetica')
        .text(`Name: ${patient?.user?.name || 'N/A'}`, 50, 160);
      doc.text(`Patient ID: ${prescription.patientId || 'N/A'}`, 50, 175);
      doc.text(`Email: ${patient?.user?.email || 'N/A'}`, 50, 190);

      // Doctor Info
      doc.fontSize(10).font('Helvetica-Bold').text('Prescribed By:', 300, 140);
      doc.fontSize(9)
        .font('Helvetica')
        .text(`Dr. ${doctor?.user?.name || 'N/A'}`, 300, 160);
      doc.text(
        `Specialization: ${doctor?.specialization || 'N/A'}`,
        300,
        175,
      );

      // Prescription Date
      doc.text(
        `Date: ${new Date(prescription.createdAt).toLocaleDateString()}`,
        300,
        190,
      );

      // Diagnosis
      doc.fontSize(10).font('Helvetica-Bold').text('Diagnosis:', 50, 220);
      doc.fontSize(9)
        .font('Helvetica')
        .text(prescription.diagnosis || 'N/A', 50, 240, { width: 450 });

      // Medicines Table
      doc.fontSize(10).font('Helvetica-Bold').text('Medicines:', 50, 280);

      const tableTop = 310;
      const col1X = 50;
      const col2X = 180;
      const col3X = 300;
      const col4X = 420;

      // Table Header
      doc.fontSize(9).font('Helvetica-Bold');
      doc.text('Medicine', col1X, tableTop);
      doc.text('Dosage', col2X, tableTop);
      doc.text('Frequency', col3X, tableTop);
      doc.text('Duration', col4X, tableTop);

      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

      // Table Rows
      let currentY = tableTop + 30;
      doc.fontSize(8).font('Helvetica');

      if (prescription.medicines && prescription.medicines.length > 0) {
        prescription.medicines.forEach((medicine) => {
          if (currentY > 700) {
            doc.addPage();
            currentY = 50;
          }

          doc.text(medicine.name || 'N/A', col1X, currentY);
          doc.text(medicine.dosage || 'N/A', col2X, currentY);
          doc.text(medicine.frequency || 'N/A', col3X, currentY);
          doc.text(medicine.duration || 'N/A', col4X, currentY);

          currentY += 25;
        });
      } else {
        doc.text('No medicines prescribed', col1X, currentY);
      }

      // Notes
      doc.fontSize(10).font('Helvetica-Bold').text('Notes:', 50, currentY + 40);
      doc.fontSize(9)
        .font('Helvetica')
        .text(prescription.notes || 'No additional notes', 50, currentY + 60, {
          width: 450,
        });

      // Footer
      doc.fontSize(8)
        .font('Helvetica')
        .text(
          'This is an electronically generated document. Please consult your doctor for any concerns.',
          50,
          750,
          { align: 'center' },
        );

      doc.end();

      stream.on('finish', () => {
        resolve(filePath);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const generateInvoicePDF = (bill, patient, doctor) => {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `invoice_${bill._id}_${Date.now()}.pdf`;
      const filePath = join(__dirname, '../..', 'uploads', fileName);

      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
      });

      const stream = createWriteStream(filePath);
      doc.pipe(stream);

      // Header
      doc.fontSize(20).font('Helvetica-Bold').text('CareSync', 50, 50);
      doc.fontSize(10)
        .font('Helvetica')
        .text('Patient Management System', 50, 75);
      doc.moveTo(50, 90).lineTo(550, 90).stroke();

      // Invoice Title
      doc.fontSize(14).font('Helvetica-Bold').text('Invoice', 50, 110);
      doc.fontSize(9)
        .font('Helvetica')
        .text(`Invoice #: ${bill._id?.toString().slice(-8) || 'N/A'}`, 300, 110);
      doc.text(
        `Date: ${new Date(bill.createdAt).toLocaleDateString()}`,
        300,
        125,
      );

      // Patient Info
      doc.fontSize(10).font('Helvetica-Bold').text('Bill To:', 50, 150);
      doc.fontSize(9)
        .font('Helvetica')
        .text(`Name: ${patient?.user?.name || 'N/A'}`, 50, 170);
      doc.text(`Patient ID: ${bill.patientId || 'N/A'}`, 50, 185);
      doc.text(`Email: ${patient?.user?.email || 'N/A'}`, 50, 200);

      // Bill Details
      doc.fontSize(10).font('Helvetica-Bold').text('Bill Status:', 300, 170);
      doc.fontSize(9)
        .font('Helvetica')
        .text(`Status: ${bill.status?.toUpperCase() || 'PENDING'}`, 300, 190);
      doc.text(`Description: ${bill.description || 'N/A'}`, 300, 205);

      // Items Table
      const tableTop = 240;
      const col1X = 50;
      const col2X = 300;
      const col3X = 450;

      // Table Header
      doc.fontSize(9).font('Helvetica-Bold');
      doc.text('Description', col1X, tableTop);
      doc.text('Amount', col2X, tableTop);

      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

      // Items
      let currentY = tableTop + 30;
      doc.fontSize(9).font('Helvetica');

      doc.text(bill.description || 'Medical Services', col1X, currentY);
      doc.text(`₹${bill.totalAmount || 0}`, col2X, currentY);

      currentY += 30;

      // Summary
      doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
      currentY += 15;

      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Subtotal:', col1X, currentY);
      doc.text(`₹${bill.totalAmount || 0}`, col2X, currentY);

      currentY += 20;
      doc.text('Tax (18%):', col1X, currentY);
      const tax = (bill.totalAmount || 0) * 0.18;
      doc.text(`₹${tax.toFixed(2)}`, col2X, currentY);

      currentY += 20;
      doc.text('Total:', col1X, currentY);
      const total = (bill.totalAmount || 0) + tax;
      doc.text(`₹${total.toFixed(2)}`, col2X, currentY);

      currentY += 25;
      doc.moveTo(50, currentY).lineTo(550, currentY).stroke();

      // Payment Info
      doc.fontSize(9)
        .font('Helvetica')
        .text(`Amount Paid: ₹${bill.paidAmount || 0}`, 50, currentY + 15);
      doc.text(
        `Pending: ₹${Math.max(0, total - (bill.paidAmount || 0))}`,
        50,
        currentY + 30,
      );

      // Footer
      doc.fontSize(8)
        .font('Helvetica')
        .text(
          'Thank you for your business. This is an electronically generated invoice.',
          50,
          750,
          { align: 'center' },
        );

      doc.end();

      stream.on('finish', () => {
        resolve(filePath);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};
