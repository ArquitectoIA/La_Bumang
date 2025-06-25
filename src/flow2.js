/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// this object is generated from Flow Builder under "..." > Endpoint > Snippets > Responses
// To navigate to a screen, return the corresponding response from the endpoint. Make sure the response is encrypted.
const SCREEN_RESPONSES = {
    MENU_PRINCIPAL: {
        "screen": "MENU_PRINCIPAL",
        "data": {
            "products": [
                {
                    "id": "sencillas",
                    "title": "🍔 Hamburguesas de Barrio"
                },
                {
                    "id": "dobles",
                    "title": "🥩 Hamburguesas Dobles"
                },
                {
                    "id": "perros",
                    "title": "🌭 Super Perros"
                },
                {
                    "id": "papas",
                    "title": "🍟 Las Papas"
                }
            ]
        }
    },
    SEL_MENU: {
        "screen": "SEL_MENU",
        "data": {
            "chk_sencillas": false,
            "chk_dobles": false,
            "chk_perros": false,
            "chk_papas": false,
            "chk_trad_sp": false,
            "chk_trad_cp": false,
            "chk_carn_pollo_sp": false,
            "chk_carn_pollo_cp": false,
            "chk_carn_tocin_sp": false,
            "chk_carn_tocin_cp": false,
            "chk_esp_sp": false,
            "chk_esp_cp": false,
            "chk_sl_pollo_sp": false,
            "chk_sl_pollo_cp": false,
            "chk_d_carn_sp": false,
            "chk_d_carn_cp": false,
            "chk_d_carn_pollo_sp": false,
            "chk_d_carn_pollo_cp": false,
            "chk_d_carn_tocin_sp": false,
            "chk_d_carn_tocin_cp": false,
            "chk_d_esp_sp": false,
            "chk_d_esp_cp": false,
            "chk_pe_trad_sp": false,
            "chk_pe_trad_cp": false,
            "chk_pe_pollo_sp": false,
            "chk_pe_pollo_cp": false,
            "chk_pe_tocin_sp": false,
            "chk_pe_tocin_cp": false,
            "chk_pe_esp_sp": false,
            "chk_pe_esp_cp": false,
            "chk_pa_xl": false,
            "chk_salchi_xl": false,
            "chk_chori_xl": false,
            "chk_pa_locas": false
        }
    },
    CANTIDADES: {
        "screen": "CANTIDADES",
        "data": {}
    },
    ADICIONALES: {
        "screen": "ADICIONALES",
        "data": {
            "chk_ad_tocin": false,
            "chk_ad_queso": false,
            "chk_ad_chorizo": false,
            "chk_ad_pollo": false,
            "chk_ad_salchi": false,
            "chk_ad_carn_ham": false,
            "chk_obs_adicionales": false
        }
    },
    BEBIDAS: {
        "screen": "BEBIDAS",
        "data": {
            "chk_gas_mzn": false,
            "chk_gas_pepsi": false,
            "chk_gas_kola": false,
            "chk_hit_tropical": false,
            "chk_hit_mango": false,
            "chk_hit_mora": false,
            "chk_mr_tea": false,
            "chk_agua_sn_gas": false,
            "chk_agua_cn_gas": false,
            "chk_h2o_pet": false
        }
    },
    PRODUCT_DETALLE: {
        "screen": "PRODUCT_DETALLE",
        "data": {
            "selected_device": "0_TechWave_TW14_Pro",
            "image_src": "",
            "product_name": "TechWave TW14 Pro",
            "product_properties": "\u00a3500\u30fb6.2 inches\u30fb128GB\u30fb20 MP",
            "detail_1": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
            "detail_2": "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        }
    },
    SUCCESS: {
        "screen": "SUCCESS",
        "data": {
            "extension_message_response": {
                "params": {
                    "flow_token": "REPLACE_FLOW_TOKEN",
                    "some_param_name": "PASS_CUSTOM_VALUE"
                }
            }
        }
    },
};


const SPLIT_PRODUCTS_AND_NOTES = (dataObj = {}) => {
  const SELECTED_PRODUCTS = [];
  const OBS_PRODUCTS = [];

  for (const [key, value] of Object.entries(dataObj)) {
    if (key.startsWith("can_")) {
      Array.isArray(value) ? SELECTED_PRODUCTS.push(...value) : SELECTED_PRODUCTS.push(value);
    } else if (key.startsWith("obs_")) {
      Array.isArray(value) ? OBS_PRODUCTS.push(...value) : OBS_PRODUCTS.push(value);
    }
  }
  return {SELECTED_PRODUCTS, OBS_PRODUCTS};

};

const SPLIT_ADDITIONAL_AND_NOTES = (dataObj = {}) => {
  const SELECTED_ADDITIONAL = [];
  const OBS_ADDITIONAL = [];

  for (const [key, value] of Object.entries(dataObj)) {
    if (key.startsWith("can_ad")) {
      Array.isArray(value) ? SELECTED_ADDITIONAL.push(...value) : SELECTED_ADDITIONAL.push(value);
    } else if (key.startsWith("obs_adicionales")) {
      Array.isArray(value) ? OBS_ADDITIONAL.push(...value) : OBS_ADDITIONAL.push(value);
    }
  }
  return {SELECTED_ADDITIONAL, OBS_ADDITIONAL};

};




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
      ...SCREEN_RESPONSES.MENU_PRINCIPAL,
    };
  }

  if (action === "data_exchange") {
    // handle the request based on the current screen
    switch (screen) {
      // handles when user submits PRODUCT_SELECTOR screen
      case "MENU_PRINCIPAL":
        const PRODUCT_IDS = SCREEN_RESPONSES.MENU_PRINCIPAL.data.products.map(p => p.id);
        const SELECTED_IDS = new Set(data.product_selection ?? []);
        const PRODUCT_FLAGS = PRODUCT_IDS.reduce((acc, id) => {
          acc[`chk_${id}`] = SELECTED_IDS.has(id);
          return acc;
        }, {});

        return {
          ...SCREEN_RESPONSES.SEL_MENU,
          data: {
            ...SCREEN_RESPONSES.SEL_MENU.data,
            ...PRODUCT_FLAGS,
          },
        };
      case "SEL_MENU":
        // TODO here process user selected preferences and return customised offer
        return {
          ...SCREEN_RESPONSES.CANTIDADES,
          data: {
            ...SCREEN_RESPONSES.CANTIDADES.data,
          },
        };
      case "CANTIDADES":
        const {SELECTED_PRODUCTS, OBS_PRODUCTS} = SPLIT_PRODUCTS_AND_NOTES(data);
        console.log({SELECTED_PRODUCTS, OBS_PRODUCTS});

        return {
          ...SCREEN_RESPONSES.ADICIONALES,
          data: {
            ...SCREEN_RESPONSES.ADICIONALES.data,
            ...data,
            SELECTED_PRODUCTS,
            OBS_PRODUCTS,

          },
        };
      case "ADICIONALES":
        // TODO here process user selected preferences and return customised offer
        const {SELECTED_ADDITIONAL, OBS_ADDITIONAL} = SPLIT_ADDITIONAL_AND_NOTES(data);
        console.log({SELECTED_ADDITIONAL, OBS_ADDITIONAL});
        return {
          ...SCREEN_RESPONSES.BEBIDAS,
          data: {
            // copy initial screen data then override specific fields
            ...data,
            ...SCREEN_RESPONSES.BEBIDAS.data,
            SELECTED_ADDITIONAL,
            OBS_ADDITIONAL,

          },
        };
      case "BEBIDAS":
        // TODO return details of selected device
        return {
          ...SCREEN_RESPONSES.PRODUCT_DETALLE,
          data: {
            // copy initial screen data then override specific fields
            ...SCREEN_RESPONSES.PRODUCT_DETALLE.data,
            selected_device: data.device,
            ...data,
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