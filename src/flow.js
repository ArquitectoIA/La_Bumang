import { productosBumang } from "./productosBumang.js";
import { SCREEN_RESPONSES } from "./screens.js";

const SPLIT_PRODUCTS_AND_NOTES = (dataObj = {}) => {
  const SELECTED_PRODUCTS = [];
  const OBS_PRODUCTS = [];

  for (const [key, value] of Object.entries(dataObj)) {
    if (key.startsWith("can_")) {
      Array.isArray(value)
        ? SELECTED_PRODUCTS.push(...value)
        : SELECTED_PRODUCTS.push(value);
    } else if (key.startsWith("obs_")) {
      Array.isArray(value)
        ? OBS_PRODUCTS.push(...value)
        : OBS_PRODUCTS.push(value);
    }
  }
  return { SELECTED_PRODUCTS, OBS_PRODUCTS };
};

const SPLIT_ADDITIONAL_AND_NOTES = (dataObj = {}) => {
  const SELECTED_ADDITIONAL = [];
  const OBS_ADDITIONAL = [];

  for (const [key, value] of Object.entries(dataObj)) {
    if (key.startsWith("can_ad")) {
      Array.isArray(value)
        ? SELECTED_ADDITIONAL.push(...value)
        : SELECTED_ADDITIONAL.push(value);
    } else if (key.startsWith("obs_adicionales")) {
      Array.isArray(value)
        ? OBS_ADDITIONAL.push(...value)
        : OBS_ADDITIONAL.push(value);
    }
  }
  return { SELECTED_ADDITIONAL, OBS_ADDITIONAL };
};

function ordenProductos(productos = {}) {
  return Object.entries(productos).map(([producto, cantidadStr]) => {
    const cantidad = parseInt(cantidadStr, 10) || 0;
    const precioUnitario = productosBumang[producto] ?? 0;

    return { producto, cantidad, precioUnitario };
  });
}

function agregarSubtotalyObtenertotal(lineas) {
  let total = 0;

  for (const linea of lineas) {
    linea.subtotal = linea.precioUnitario * linea.cantidad;
    total += linea.subtotal;
  }

  return total;
}

function formatearResumenPedido(lineasPedido = []) {
  const formatoCOP = new Intl.NumberFormat("es-CO");

  let total = 0;

  const filas = lineasPedido.map(({ producto, cantidad, precioUnitario }) => {
    const subTotal = cantidad * precioUnitario;
    total += subTotal;
    return `${cantidad} x ${producto} - $${formatoCOP.format(subTotal)}`;
  });

  const texto = [...filas].join("\n");

  const totalString = `$${formatoCOP.format(total)}`;

  return { texto, total, totalString };
}

export const getNextScreen = async (decryptedBody) => {
  const { screen, data, version, action, flow_token } = decryptedBody;
  // handle health check request
  if (action === "ping") {
    return {
      data: {
        status: "active",
      },
    };
  }

  // handle error notification
  if (data?.error) {
    console.warn("Received client error:", data);
    return {
      data: {
        acknowledged: true,
      },
    };
  }

  // handle initial request when opening the flow and display LOAN screen
  if (action === "INIT") {
    return {
      ...SCREEN_RESPONSES.SEL_MENU,
    };
  }

  if (action === "data_exchange") {
    // handle the request based on the current screen
    switch (screen) {
      // handles when user submits PRODUCT_SELECTOR screen

      case "SEL_MENU":
        return {
          ...SCREEN_RESPONSES.CANTIDADES,
          data: {
            ...SCREEN_RESPONSES.CANTIDADES.data,
            ...data,
          },
        };

      case "CANTIDADES":
        return {
          ...SCREEN_RESPONSES.ADICIONALES,
          data: {
            ...SCREEN_RESPONSES.ADICIONALES.data,
            ...data,
          },
        };

      case "ADICIONALES":
        return {
          ...SCREEN_RESPONSES.BEBIDAS,
          data: {
            ...SCREEN_RESPONSES.BEBIDAS.data,
            ...data,
          },
        };

      case "BEBIDAS":
        const {
          productos = {},
          adicionales = {},
          bebidas = {},
          obs_productos = "",
          obs_adicionales = "",
        } = data ?? {};

        const productosPedido = { ...productos, ...adicionales, ...bebidas };

        const lineasPedido = ordenProductos(productosPedido);
        const totalPedido = agregarSubtotalyObtenertotal(lineasPedido);
        const { texto, totalString } = formatearResumenPedido(lineasPedido);

        return {
          ...SCREEN_RESPONSES.FINAL,
          data: {
            ...SCREEN_RESPONSES.FINAL.data,
            mensaje: texto,
            valorTotal: totalPedido,
            valorTotalStr: totalString,
            obsProductos: obs_productos,
            obsAdcionales: obs_adicionales,
          },
        };

      case "FINAL":
        return {
          ...SCREEN_RESPONSES.MET_ENTREGA,
          data: {
            ...SCREEN_RESPONSES.MET_ENTREGA.data,
            ...data,
          },
        };

      default:
        break;
    }
  }

  console.error("Unhandled request body:", decryptedBody);
  throw new Error(
    "Unhandled endpoint request. Make sure you handle the request action & screen logged above.",
  );
};
