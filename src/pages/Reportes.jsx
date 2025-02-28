import React, { useState } from "react";
import * as XLSX from "xlsx";
import "../styles/reportes.css";
import "../styles/modal.css";

const reportes = [
  { id: "R01", nombre: "Serie R01 - Catálogo Mínimo" },
  { id: "R08", nombre: "Serie R08 - Préstamos Bancarios" },
  { id: "R10A", nombre: "Serie R10 - Reclasificaciones (A-10112)" },
  { id: "R10B", nombre: "Serie R10 - Reclasificaciones (A-10122)" },
  { id: "R12A", nombre: "Serie R12 - Consolidación (A-12192)" },
  { id: "R12B", nombre: "Serie R12 - Consolidación (A-12202)" },
  { id: "R13A", nombre: "Serie R13 - Estados Financieros (A-13112)" },
  { id: "R13B", nombre: "Serie R13 - Estados Financieros (A-13162)" },
  { id: "R13C", nombre: "Serie R13 - Estados Financieros (B-13212)" },
  { id: "R13D", nombre: "Serie R13 - Estados Financieros (B-13222)" },
  { id: "R27", nombre: "Serie R27 - Reclamaciones" },
  { id: "CMBanxico", nombre: "Catálogo Mínimo Banxico" },
];

const Reportes = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [reporteId, setReporteId] = useState("");
  const [inputData, setInputData] = useState({
    inicioPeriodo: "",
    finPeriodo: "",
    claveInstitucion: "",
    reporte: "",
  });
  const [file, setFile] = useState(null);

  const handleInputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const openModal = (id) => {
    setReporteId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const transformarExcelAJson = () => {
    if (!file) {
      alert("Por favor, selecciona un archivo Excel.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Transformar datos extrayendo de la columna A y B
      const outputData = jsonData
        .filter((row) => row.length >= 2) // Filtra filas vacías o incompletas
        .map((row) => ({
          dato: row[1] || 0, // Columna B
          concepto: row[0] || "", // Columna A
          moneda: "14", // Valor por defecto
        }));

      const outputJson = {
        identificadorReporte: {
          inicioPeriodo: inputData.inicioPeriodo,
          finPeriodo: inputData.finPeriodo,
          claveInstitucion: inputData.claveInstitucion,
          reporte: inputData.reporte,
        },
        informacionFinanciera: outputData, // 🔹 CAMBIADO EL NOMBRE DEL ARRAY
      };

      descargarJson(outputJson, reporteId);
      closeModal();
    };

    reader.readAsArrayBuffer(file);
  };

  const descargarJson = (jsonData, reporteId) => {
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${reporteId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="reportes-container">
      <h1>Reportes Regulatorios</h1>
      <div className="reportes-grid">
        {reportes.map((reporte) => (
          <div key={reporte.id} className="reporte-card">
            <h3>{reporte.nombre}</h3>
            <input
              type="file"
              id={`file-${reporte.id}`}
              className="file-input"
              accept=".xlsx"
              onChange={handleFileChange}
            />
            <label htmlFor={`file-${reporte.id}`} className="upload-label">
              Subir Archivo Excel
            </label>
            <div className="buttons">
              <button
                className="btn-transformar"
                onClick={() => openModal(reporte.id)}
              >
                Transformar & Descargar JSON
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL PARA SOLICITAR DATOS */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Datos del Reporte</h2>
            <label>Inicio Periodo(AAAAMMDD):</label>
            <input
              type="text"
              name="inicioPeriodo"
              value={inputData.inicioPeriodo}
              onChange={handleInputChange}
            />
            <label>Fin Periodo(AAAAMMDD):</label>
            <input
              type="text"
              name="finPeriodo"
              value={inputData.finPeriodo}
              onChange={handleInputChange}
            />
            <label>Clave Institución(065022):</label>
            <input
              type="text"
              name="claveInstitucion"
              value={inputData.claveInstitucion}
              onChange={handleInputChange}
            />
            <label>Reporte(clave de Reporte en SITI):</label>
            <input
              type="text"
              name="reporte"
              value={inputData.reporte}
              onChange={handleInputChange}
            />
            <div className="modal-buttons">
              <button onClick={transformarExcelAJson} className="btn-confirmar">
                Confirmar
              </button>
              <button onClick={closeModal} className="btn-cancelar">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reportes;
