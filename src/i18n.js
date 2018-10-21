import i18n from "i18next";
import XHR from "i18next-xhr-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { reactI18nextModule } from "react-i18next";
import config from "./config";

export function setupI18n() {
  i18n
    .use(XHR)
    .use(LanguageDetector)
    .use(reactI18nextModule)
    .init({
      fallbackLng: "en",
      ns: ["common"],
      defaultNS: "common",
      fallbackNS: [
        "dashboard",
        "footer",
        "lists",
        "location",
        "login",
        "query-log",
        "settings"
      ],
      nsSeparator: false,
      keySeparator: false,
      debug: config.developmentMode,
      interpolation: {
        // Handled by React
        escapeValue: false
      },
      backend: {
        loadPath: process.env.PUBLIC_URL + "/i18n/{{lng}}/{{ns}}.json"
      },
      react: {
        // Wait until translations are loaded before rendering
        wait: true
      }
    });
}
