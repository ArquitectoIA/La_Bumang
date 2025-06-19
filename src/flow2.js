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
            "selected_product": "phone",
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
            "selected_product": "phone",
            "chk_ad_tocin": false,
            "chk_ad_queso": false,
            "chk_ad_chorizo": false,
            "chk_ad_pollo": false,
            "chk_ad_salchi": false,
            "chk_ad_carn_ham": false
        }
    },
    BEBIDAS: {
        "screen": "BEBIDAS",
        "data": {
            "selected_product": "phone",
            "chk_jg_caj": false,
            "chk_gaseosa": false,
            "chk_agua_gas": false,
            "chk_agua_sn_gas": false,
            "chk_pet": false,
            "chk_soda": false,
            "chk_jg_hit": false,
            "chk_soda_hatsu": false,
            "chk_mr_tea": false,
            "chk_h2o_pet": false,
            "chk_cola_pola": false,
            "chk_cervezas": false,
            "chk_coronita": false,
            "chk_club_col": false,
            "chk_te_hatsu": false
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
        const COINCIDENCE = PRODUCT_IDS.some(id => SELECTED_IDS.has(id));
        const PRODUCT_FLAGS = PRODUCT_IDS.reduce((acc, id) => {
          acc[`chk_${id}`] = SELECTED_IDS.has(id);
          return acc;
        }, {});
        const product_type = data.product_selection[0] //data.product_selection.split('_').pop().slice(0, -1);
        
        return {
          ...SCREEN_RESPONSES.SEL_MENU,
          data: {
            // copy initial screen data then override specific fields
            ...SCREEN_RESPONSES.SEL_MENU.data,
            ...PRODUCT_FLAGS,
            cta_label: "View " + product_type + "s",
            screen_heading: "Let's find the perfect " + product_type + " offer for you",
            selected_product: product_type,
          },
        };
      case "SEL_MENU":
        // TODO here process user selected preferences and return customised offer
        return {
          ...SCREEN_RESPONSES.CANTIDADES,
          data: {
            // copy initial screen data then override specific fields
            ...SCREEN_RESPONSES.CANTIDADES.data,
            selected_product: data.selected_product,
          },
        };
      case "CANTIDADES":
        return {
          ...SCREEN_RESPONSES.ADICIONALES,
          ...data.selected_product,
        };
      case "ADICIONALES":
        // TODO here process user selected preferences and return customised offer
        return {
          ...SCREEN_RESPONSES.BEBIDAS,
          data: {
            // copy initial screen data then override specific fields
            ...SCREEN_RESPONSES.BEBIDAS.data,
            selected_product: data.selected_product,
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
