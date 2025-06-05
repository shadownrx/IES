


window.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    /* Fondo general */
    body {
      background-color: #f4f4f4 !important;
      font-family: 'Segoe UI', sans-serif !important;
      color: #333 !important;
    }

    /* Contenedores principales */
    .login-form, .main-content, .contenedor, .caja {
      background-color: #ffffff !important;
      border-radius: 12px !important;
      padding: 20px !important;
      box-shadow: 0 0 10px rgba(0,0,0,0.1) !important;
    }

    /* Botones */
    button, input[type="submit"] {
      background-color: #005baa !important;
      color: white !important;
      border: none !important;
      border-radius: 8px !important;
      padding: 10px 16px !important;
      font-weight: bold !important;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    button:hover, input[type="submit"]:hover {
      background-color: #004080 !important;
    }

    /* Inputs */
    input[type="text"], input[type="password"], select {
      border: 1px solid #ccc !important;
      padding: 8px !important;
      border-radius: 6px !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }

    /* Links */
    a {
      color: #005baa !important;
      text-decoration: none !important;
    }

    a:hover {
      text-decoration: underline !important;
    }

    /* Evitar que estilos anteriores sobreescriban */
    * {
      box-sizing: border-box !important;
    }
  `;
  document.head.appendChild(style);
});
