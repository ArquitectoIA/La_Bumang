import { productosBumang } from "./productosBumang.js";

const SCREEN_RESPONSES = {
  SEL_MENU: {
    screen: "SEL_MENU",
    data: {
      chk_trad_sp: false,
      chk_trad_cp: false,
      chk_carn_pollo_sp: false,
      chk_carn_pollo_cp: false,
      chk_carn_tocin_sp: false,
      chk_carn_tocin_cp: false,
      chk_esp_sp: false,
      chk_esp_cp: false,
      chk_sl_pollo_sp: false,
      chk_sl_pollo_cp: false,
      chk_d_carn_sp: false,
      chk_d_carn_cp: false,
      chk_d_carn_pollo_sp: false,
      chk_d_carn_pollo_cp: false,
      chk_d_carn_tocin_sp: false,
      chk_d_carn_tocin_cp: false,
      chk_d_esp_sp: false,
      chk_d_esp_cp: false,
      chk_pe_trad_sp: false,
      chk_pe_trad_cp: false,
      chk_pe_pollo_sp: false,
      chk_pe_pollo_cp: false,
      chk_pe_tocin_sp: false,
      chk_pe_tocin_cp: false,
      chk_pe_esp_sp: false,
      chk_pe_esp_cp: false,
      chk_pa_xl: false,
      chk_salchi_xl: false,
      chk_chori_xl: false,
      chk_pa_locas: false,
    },
  },

  CANTIDADES: {
    screen: "CANTIDADES",
    data: {
      chk_trad_sp: false,
      chk_trad_cp: false,
      chk_carn_pollo_sp: false,
      chk_carn_pollo_cp: false,
      chk_carn_tocin_sp: false,
      chk_carn_tocin_cp: false,
      chk_esp_sp: false,
      chk_esp_cp: false,
      chk_sl_pollo_sp: false,
      chk_sl_pollo_cp: false,
      chk_d_carn_sp: false,
      chk_d_carn_cp: false,
      chk_d_carn_pollo_sp: false,
      chk_d_carn_pollo_cp: false,
      chk_d_carn_tocin_sp: false,
      chk_d_carn_tocin_cp: false,
      chk_d_esp_sp: false,
      chk_d_esp_cp: false,
      chk_pe_trad_sp: false,
      chk_pe_trad_cp: false,
      chk_pe_pollo_sp: false,
      chk_pe_pollo_cp: false,
      chk_pe_tocin_sp: false,
      chk_pe_tocin_cp: false,
      chk_pe_esp_sp: false,
      chk_pe_esp_cp: false,
      chk_pa_xl: false,
      chk_salchi_xl: false,
      chk_chori_xl: false,
      chk_pa_locas: false,
    },
  },

  ADICIONALES: {
    screen: "ADICIONALES",
    data: {
      chk_ad_tocin: false,
      chk_ad_queso: false,
      chk_ad_chorizo: false,
      chk_ad_pollo: false,
      chk_ad_salchi: false,
      chk_ad_carn_ham: false,
      chk_obs_adicionales: false,
    },
  },

  BEBIDAS: {
    screen: "BEBIDAS",
    data: {
      chk_gas_mzn: false,
      chk_gas_pepsi: false,
      chk_gas_kola: false,
      chk_hit_tropical: false,
      chk_hit_mango: false,
      chk_hit_mora: false,
      chk_mr_tea: false,
      chk_agua_sn_gas: false,
      chk_agua_cn_gas: false,
      chk_h2o_pet: false,
    },
  },

  FINAL: {
    screen: "FINAL",
    data: {},
  },

  SUCCESS: {
    screen: "SUCCESS",
    data: {
      extension_message_response: {
        params: {
          flow_token: "REPLACE_FLOW_TOKEN",
          some_param_name: "PASS_CUSTOM_VALUE",
        },
      },
    },
  },
};

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

  const texto = [
    "*Resumen de tu pedido*",
    ...filas,
    "______________________",
    `*Total:* $${formatoCOP.format(total)}`,
  ].join("\n");

  return { texto, total };
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
          obs_adcionales = "",
        } = data ?? {};

        const productosPedido = { ...productos, ...adicionales, ...bebidas };

        const lineasPedido = ordenProductos(productosPedido);
        const totalPedido = agregarSubtotalyObtenertotal(lineasPedido);
        const { texto } = formatearResumenPedido(lineasPedido);

        console.log("lineas", lineasPedido);
        console.log("total", totalPedido);


        return {
          ...SCREEN_RESPONSES.FINAL,
          data: {
            ...SCREEN_RESPONSES.FINAL.data,
            mensaje: texto,
            valortotal1: totalPedido,
            obs_productos: obs_productos,
            obs_adcionales: obs_adcionales
          },
        };

      default:
        break;
    }
  }

  console.error("Unhandled request body:", decryptedBody);
  throw new Error(
    "Unhandled endpoint request. Make sure you handle the request action & screen logged above."
  );
};
