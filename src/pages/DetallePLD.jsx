import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/detallePLD.css";

const DetallePLD = () => {
  const location = useLocation();
  const data = location.state || {};

  const [tipoOperacion, setTipoOperacion] = useState(
    data.tipoOperacion || "Operación NORMAL"
  );
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

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<archivo xmlns="http://www.uif.shcp.gob.mx/recepcion/itfr" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.uif.shcp.gob.mx/recepcion/itfr itfr.xsd">
    <sujeto_obligado>
        <organo_supervisor>002</organo_supervisor>
        <tipo_itf>${tipoItf}</tipo_itf>
        <clave_sujeto>065-022</clave_sujeto>
    </sujeto_obligado>
    <reportes>
        <reporte>
            <tipo_reporte>002</tipo_reporte>
            <fecha_reporte>${fechaReporte}</fecha_reporte>
            <folio_consecutivo>${folioConsecutivo}</folio_consecutivo>
            <cuenta>
                <regimen>0</regimen>
                <nivel_cuenta></nivel_cuenta>
                <numero_cuenta_proyecto>${
                  data.proyectoId || "N/A"
                }</numero_cuenta_proyecto>
                <nacionalidad_cuenta_asociada>260</nacionalidad_cuenta_asociada>
                <institucion_financiera>040012</institucion_financiera>
                <cuenta_asociada_institucion>123456789101112009</cuenta_asociada_institucion>
                <tipo_financiamiento_colectivo>2</tipo_financiamiento_colectivo>
            </cuenta>
            <cliente>
                <tipo_persona>1</tipo_persona>
                <tipo_cliente>1</tipo_cliente>
                <pais_nacionalidad>260</pais_nacionalidad>
                <nombre>${data.usuario || "N/A"}</nombre>
                <apellido_paterno>${
                  data.apellidoPaterno || "N/A"
                }</apellido_paterno>
                <apellido_materno>${
                  data.apellidoMaterno || "N/A"
                }</apellido_materno>
                <genero>2</genero>
                <rfc_cliente>${data.rfc || "N/A"}</rfc_cliente>
                <curp>${data.curp || "N/A"}</curp>
            </cliente>
            <operacion>
                <tipo_operacion_itf>${tipoOperacion}</tipo_operacion_itf>
                <monto>${data.montoInversion || "0.00"}</monto>
                <moneda>MXN</moneda>
                <fecha_operacion>20220627</fecha_operacion>
            </operacion>
        </reporte>
    </reportes>
</archivo>`;

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

      <table className="detalle-table">
        <thead>
          <tr>
            <th>Campo</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([key, value]) => (
            <tr key={key}>
              <td className="campo">{key.replace(/_/g, " ").toUpperCase()}</td>
              <td className="valor">{value || "N/A"}</td>
            </tr>
          ))}
          <tr>
            <td>Tipo de Operación</td>
            <td>
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
            </td>
          </tr>
        </tbody>
      </table>

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
