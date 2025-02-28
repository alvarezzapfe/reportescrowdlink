import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { FaUpload } from "react-icons/fa"; // Ícono para el botón
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
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const processedData = jsonData.slice(1).map((row, index) => ({
        id: index + 1,
        usuario: row[16] || "N/A", // Columna Q (índice 16)
        montoInversion: row[38] || 0, // Columna AM (índice 38)
        proyectoId: row[2] || "N/A", // Columna C (índice 2)
        gradoRiesgo: calcularGradoRiesgo(row[44]), // Columna AS (índice 44)
        tipoOperacion: "Operación NORMAL",
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
              <th>Tipo de Operación</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td>{row.usuario}</td>
                <td>${row.montoInversion.toLocaleString()}</td>
                <td>{row.proyectoId}</td>
                <td>{row.gradoRiesgo}</td>
                <td>{row.tipoOperacion}</td>
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
