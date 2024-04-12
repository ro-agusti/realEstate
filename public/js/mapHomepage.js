/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapHomepage.js":
/*!*******************************!*\
  !*** ./src/js/mapHomepage.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function(){\n    const lat = -31.4159171;\n    const lng = -64.4894222;\n    const map = L.map('map-homepage').setView([lat, lng ], 16);\n\n    let markers = new L.FeatureGroup().addTo(map)\n\n    let properties = []\n\n    //filters\n    const filters = {\n        category: '',\n        price: ''\n    }\n\n    const categoriesSelect = document.querySelector('#categories')\n    const pricesSelect = document.querySelector('#prices')\n\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\n    }).addTo(map);\n\n    //Category aand Price filter\n    categoriesSelect.addEventListener('change', e => {\n        filters.category = +e.target.value\n        filterProperties()\n    })\n    pricesSelect.addEventListener('change', e => {\n        filters.price = +e.target.value\n        filterProperties()\n    })\n\n    const getProperties = async () => {\n\n        try {\n            \n            const url = '/api/properties'\n            const response = await fetch(url)\n            properties = await response.json()\n\n            showProperties(properties)\n\n        } catch (error) {\n            console.log(error)\n        }\n\n    }\n\n    const showProperties = properties => {\n        \n        //clean previous markers\n        markers.clearLayers()\n\n        properties.forEach(property => {\n            //)\n            //add pin\n            const marker = new L.marker([property?.lat, property?.lng ], {\n                autoPan: true\n            })\n            .addTo(map)\n            .bindPopup(`\n                <h1 class=\"text-l font-extrabold uppercase my-5\">${property?.title}</h1>\n                <img src=\"/uploads/${property?.images}\" alt=\"${property.title}\">\n                <p class=\" text-gray-600 font-bold\">${property.price.name}</p>\n                <a href=\"/property/${property.id}\" class=\"bg-red-800 block text-center uppercase rounded py-2 px-2\"> View property</a>\n            `)\n\n            markers.addLayer(marker)\n        })\n\n    }\n\n    const filterProperties = () => {\n        //console.log(properties)\n        const result = properties.filter(filterCategory).filter(filterPrice)\n\n        //const resultFilterCategory = properties.filter( filterCategory)\n        //const resultFilterPrice = properties.filter( filterPrice)\n\n        showProperties(result)\n\n    }\n\n    const filterCategory =  property => filters.category ? property.categoryID === filters.category : property\n    const filterPrice =  property => filters.price ? property.priceID === filters.price : property\n\n    getProperties()\n\n})()\n\n//# sourceURL=webpack://realestate/./src/js/mapHomepage.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapHomepage.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;