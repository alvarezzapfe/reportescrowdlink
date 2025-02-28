import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/detallePLD.css";

const DetallePLD = () => {
  const location = useLocation();
  const [data, setData] = useState(location.state || {});

  // Estado para manejar el tipo de operación editable
  const [tipoOperacion, setTipoOperacion] = useState(
    data.tipoOperacion || "Operación NORMAL"
  );

  useEffect(() => {
    setData((prevData) => ({ ...prevData, tipoOperacion }));
  }, [tipoOperacion]);

  const [showPrompt, setShowPrompt] = useState(false);
  const [promptData, setPromptData] = useState({
    tipoItf: "01",
    fechaReporte: "20220622",
    folioConsecutivo: "000001",
  });

  const handlePromptSubmit = () => {
    setShowPrompt(false);
    generarArchivoTxt();
  };

  const generarArchivoTxt = () => {
    const { tipoItf, fechaReporte, folioConsecutivo } = promptData;

    // Generación del archivo de salida .txt en formato XML
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<archivo xmlns="http://www.uif.shcp.gob.mx/recepcion/itfr" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.uif.shcp.gob.mx/recepcion/itfr itfr.xsd">\n    <sujeto_obligado>\n        <organo_supervisor>002</organo_supervisor>\n        <tipo_itf>${tipoItf}</tipo_itf>\n        <clave_sujeto>065-022</clave_sujeto>\n    </sujeto_obligado>\n    <reportes>\n        <reporte>\n            <tipo_reporte>002</tipo_reporte>\n            <fecha_reporte>${fechaReporte}</fecha_reporte>\n            <folio_consecutivo>${folioConsecutivo}</folio_consecutivo>\n            <cuenta>\n                <numero_cuenta_proyecto>${
      data.proyectoId || "N/A"
    }</numero_cuenta_proyecto>\n            </cuenta>\n            <cliente>\n                <nombre>${
      data.usuario || "N/A"
    }</nombre>\n            </cliente>\n            <operacion>\n                <tipo_operacion_itf>${tipoOperacion}</tipo_operacion_itf>\n                <monto>${
      data.montoInversion || "0.00"
    }</monto>\n            </operacion>\n        </reporte>\n    </reportes>\n</archivo>`;

    const blob = new Blob([xmlContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Reporte_PLD_${folioConsecutivo}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="detalle-pld-container">
      <h1 className="titulo">📑 Detalle de la Operación</h1>

      <div className="detalle-table-container">
        <table className="detalle-table">
          <thead>
            <tr>
              <th>Campo</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data)
              .filter(([key]) => key !== "detalles")
              .map(([key, value]) => (
                <tr key={key}>
                  <td className="campo">
                    {key.replace(/_/g, " ").toUpperCase()}
                  </td>
                  <td className="valor">{value || "N/A"}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="tipo-operacion-container">
        <label>Tipo de Operación:</label>
        <select
          value={tipoOperacion}
          onChange={(e) => setTipoOperacion(e.target.value)}
        >
          <option value="Operación NORMAL">Operación NORMAL</option>
          <option value="Operación INUSUAL">Operación INUSUAL</option>
          <option value="Operación RELEVANTE">Operación RELEVANTE</option>
          <option value="Operación INTERNA PREOCUPANTE">
            Operación INTERNA PREOCUPANTE
          </option>
        </select>
      </div>

      <button className="btn-generar" onClick={() => setShowPrompt(true)}>
        Generar Reporte TXT
      </button>

      {showPrompt && (
        <div className="prompt-overlay">
          <div className="prompt-box">
            <h2 className="prompt-title">🔹 Completa la información</h2>
            <div className="prompt-row">
              <label>Tipo ITF:</label>
              <select
                value={promptData.tipoItf}
                onChange={(e) =>
                  setPromptData({ ...promptData, tipoItf: e.target.value })
                }
              >
                <option value="01">01</option>
                <option value="02">02</option>
              </select>
            </div>
            <div className="prompt-row">
              <label>Fecha del Reporte (AAAAMMDD):</label>
              <input
                type="text"
                value={promptData.fechaReporte}
                onChange={(e) =>
                  setPromptData({ ...promptData, fechaReporte: e.target.value })
                }
              />
            </div>
            <div className="prompt-row">
              <label>Folio Consecutivo:</label>
              <input
                type="text"
                value={promptData.folioConsecutivo}
                onChange={(e) =>
                  setPromptData({
                    ...promptData,
                    folioConsecutivo: e.target.value,
                  })
                }
              />
            </div>
            <div className="prompt-buttons">
              <button
                className="prompt-btn confirm"
                onClick={handlePromptSubmit}
              >
                Confirmar
              </button>
              <button
                className="prompt-btn cancel"
                onClick={() => setShowPrompt(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetallePLD;
