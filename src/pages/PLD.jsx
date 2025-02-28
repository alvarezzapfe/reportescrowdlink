import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { FaUpload } from "react-icons/fa";
import "../styles/pld.css";

const PLD = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cachedData = localStorage.getItem("pldData");
    if (cachedData) {
      setData(JSON.parse(cachedData));
    }
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryData = new Uint8Array(e.target.result);
      const workbook = XLSX.read(binaryData, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const processedData = jsonData.slice(1).map((row, index) => ({
        id: index + 1,
        usuario: row[16] || "N/A", // Columna Q
        montoInversion: row[38] || 0, // Columna AM
        proyectoId: row[2] || "N/A", // Columna C
        gradoRiesgo: calcularGradoRiesgo(row[44]), // Columna AS
        tipoOperacion: "Operación NORMAL",
        colA: row[0] || "N/A", // Columna A
        colH: row[7] || "N/A", // Columna H
        cuentaProyecto: row[10] || "N/A", // Columna K
        colL: row[11] || "N/A", // Columna L
        colN: row[13] || "N/A", // Columna N
        colO: row[14] || "N/A", // Columna O
        colV: row[21] || "N/A", // Columna V
        colW: row[22] || "N/A", // Columna W
        colAA: row[26] || "N/A", // Columna AA
        colAF: row[31] || "N/A", // Columna AF
        colAJ: row[35] || "N/A", // Columna AJ
        colAO: row[40] || "N/A", // Columna AO
      }));

      setData(processedData);
      localStorage.setItem("pldData", JSON.stringify(processedData));
    };

    reader.readAsArrayBuffer(file);
  };

  const calcularGradoRiesgo = (valor) => {
    if (valor === 1 || valor === 2) return "Bajo Riesgo";
    if (valor === 3) return "Moderado";
    if (valor === 4 || valor === 5) return "Alto Riesgo";
    return "Desconocido";
  };

  return (
    <div className="pld-container">
      <h1>Reportes PLD</h1>

      <div className="file-upload-container">
        <input
          type="file"
          id="file-upload"
          accept=".xlsx"
          onChange={handleFileUpload}
          className="file-input"
        />
        <label htmlFor="file-upload" className="file-upload-btn">
          <FaUpload className="upload-icon" /> Cargar Archivo Excel
        </label>
      </div>

      {data.length > 0 && (
        <table className="pld-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Monto de Inversión</th>
              <th>Proyecto (ID)</th>
              <th>Grado de Riesgo</th>
              <th>Cuenta Proyecto</th>
              <th>Col A</th>
              <th>Col H</th>
              <th>Col L</th>
              <th>Col N</th>
              <th>Col O</th>
              <th>Col V</th>
              <th>Col W</th>
              <th>Col AA</th>
              <th>Col AF</th>
              <th>Col AJ</th>
              <th>Col AO</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td>{row.usuario}</td>
                <td>${row.montoInversion.toLocaleString()}</td>
                <td>{row.proyectoId}</td>
                <td
                  className={`riesgo-${row.gradoRiesgo
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {row.gradoRiesgo}
                </td>
                <td>{row.cuentaProyecto}</td>
                <td>{row.colA}</td>
                <td>{row.colH}</td>
                <td>{row.colL}</td>
                <td>{row.colN}</td>
                <td>{row.colO}</td>
                <td>{row.colV}</td>
                <td>{row.colW}</td>
                <td>{row.colAA}</td>
                <td>{row.colAF}</td>
                <td>{row.colAJ}</td>
                <td>{row.colAO}</td>
                <td>
                  <button
                    className="detalle-btn"
                    onClick={() =>
                      navigate(`/detalle-pld/${row.id}`, { state: row })
                    }
                  >
                    Ver Detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PLD;
