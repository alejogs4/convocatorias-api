"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// scripts
var app_1 = __importDefault(require("./app"));
app_1.default.listen(3000, function () {
    console.log("Server running on http://localhost:3000");
});
