// Chrome and Edge can install the running page as an app.
// The button stays hidden until the browser offers that install.

let deferredInstall = null;

export function attachInstallButton(button) {
  if (!button) return;
  const alreadyInstalled = window.matchMedia('(display-mode: standalone)').matches;
  if (alreadyInstalled) {
    button.hidden = true;
    return;
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstall = event;
    button.hidden = false;
  });

  button.addEventListener('click', async () => {
    if (!deferredInstall) return;
    deferredInstall.prompt();
    await deferredInstall.userChoice;
    deferredInstall = null;
    button.hidden = true;
  });

  window.addEventListener('appinstalled', () => {
    deferredInstall = null;
    button.hidden = true;
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
