import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 翻译资源
const resources = {
  en: {
    translation: {
      "CSV KPI Uploader": "CSV KPI Uploader",
      "Use Default CSV File": "Use Default CSV File",
      "Upload CSV File": "Upload CSV File",
      "Select Columns for KPI Calculation": "Select Columns for KPI Calculation",
      "Calculate": "Calculate",
      "Calculation Result": "Calculation Result",
    }
  },
  zh: {
    translation: {
      "CSV KPI Uploader": "CSV KPI 上传器",
      "Use Default CSV File": "使用默认 CSV 文件",
      "Upload CSV File": "上传 CSV 文件",
      "Select Columns for KPI Calculation": "选择列进行 KPI 计算",
      "Calculate": "计算",
      "Calculation Result": "计算结果",
    }
  }
};

// 初始化 i18next
i18n
  .use(LanguageDetector)  // 自动检测语言
  .use(initReactI18next)  // 绑定 React
  .init({
    resources,
    fallbackLng: 'en',  // 默认语言
    interpolation: {
      escapeValue: false,  // React 已经自动处理 XSS
    },
  });

export default i18n;
