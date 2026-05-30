// src/utils/telegram.js
const isTelegram = () => typeof window !== 'undefined' && !!window.Telegram?.WebApp;

const expand = () => {
  if (isTelegram()) window.Telegram.WebApp.expand();
};

const showBackButton = (onClick) => {
  if (isTelegram()) {
    window.Telegram.WebApp.BackButton.show();
    window.Telegram.WebApp.BackButton.onClick(onClick);
  }
};

const hideBackButton = () => {
  if (isTelegram()) window.Telegram.WebApp.BackButton.hide();
};

// ready() — вызываем ТОЛЬКО если нужно
const ready = () => {
  if (isTelegram()) window.Telegram.WebApp.ready();
};

export { isTelegram, expand, showBackButton, hideBackButton, ready };
