import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex space-x-4">
      <button onClick={() => changeLanguage('en')} className="bg-blue-600 text-white px-4 py-2 rounded-lg">English</button>
      <button onClick={() => changeLanguage('zh')} className="bg-green-600 text-white px-4 py-2 rounded-lg">中文</button>
    </div>
  );
}

export default LanguageSwitcher;
