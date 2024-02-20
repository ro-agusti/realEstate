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

/***/ "./src/js/map.js":
/*!***********************!*\
  !*** ./src/js/map.js ***!
  \***********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function() {\n\n    const lat = document.querySelector('#lat').value || -31.4159171;\n    const lng = document.querySelector('#lng').value || -64.4894222;\n\n    //const lat = 26.0396159;\n    //const lng = -80.175378;\n\n    const map = L.map('map').setView([lat, lng ], 16);\n    let marker;\n\n    //provider - geocoder\n    const geocodeService = L.esri.Geocoding.geocodeService();\n\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\n    }).addTo(map);\n\n    //pin\n    marker = new L.marker([lat,lng], {\n        draggable:true,\n        autoPan:true\n    })\n    .addTo(map)\n\n    //detect pin movement\n    marker.on('moveend', function(e){\n        marker = e.target;\n        const position = marker.getLatLng();\n        //console.log(position);\n        map.panTo(new L.LatLng(position.lat, position.lng))\n\n        //information from the adress when releasing the pin\n        geocodeService.reverse().latlng(position, 16).run(function(error, result){\n            marker.bindPopup(result.address.LongLabel)\n\n            //llenar los campos\n            document.querySelector('.street').textContent = result?.address?.Address ?? '';\n            document.querySelector('#street').value = result?.address?.Address ?? '';\n            document.querySelector('#lat').value = result?.latlng?.lat ?? '';\n            document.querySelector('#lng').value = result?.latlng?.lng ?? '';\n            \n        })\n    })\n\n})()\n\n//# sourceURL=webpack://realestate/./src/js/map.js?");

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
/******/ 	__webpack_modules__["./src/js/map.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;