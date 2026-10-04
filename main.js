// Electron obal pro Test reakce – kiosk režim (celá obrazovka, bez menu)
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const ADMIN_PASSWORD = process.env.DIGIDAY_ADMIN_PASSWORD || '';

function normalizeBoard(board) {
  if (!Array.isArray(board)) return [];

  return board
    .filter((item) => item && typeof item === 'object')
    .map((item) => ({
      id: String(item.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`),
      name: String(item.name || '').slice(0, 24),
      email: String(item.email || '').slice(0, 80),
      note: String(item.note || '').slice(0, 120),
      ms: Number.isFinite(Number(item.ms)) ? Math.max(0, Number(item.ms)) : 0,
      date: item.date || new Date().toISOString(),
      training: Number.isFinite(Number(item.training)) ? Number(item.training) : null,
      sharp: Number.isFinite(Number(item.sharp)) ? Number(item.sharp) : null,
      prize: String(item.prize || '').slice(0, 32),
    }));
}

// ---------- žebříček v souboru ----------
// Ukládá se do %APPDATA%\Test reakce F1\zebricek.json. Zápis je okamžitý a bezpečný
// (dočasný soubor + fsync + přejmenování), takže výsledky přežijí i výpadek proudu.
// Smazat je jde jen resetem s heslem v aplikaci.
const boardFile = () => path.join(app.getPath('userData'), 'zebricek.json');

function readJson(file) {
  try {
    const b = JSON.parse(fs.readFileSync(file, 'utf8'));
    return Array.isArray(b) ? b : null;
  } catch (e) {
    return null;
  }
}

ipcMain.on('board:load', (event) => {
  const board = readJson(boardFile()) ?? readJson(boardFile() + '.bak');
  event.returnValue = normalizeBoard(board);
});

ipcMain.on('board:save', (event, board) => {
  try {
    const file = boardFile();
    const safeBoard = normalizeBoard(board);
    const tmp = file + '.tmp';

    fs.mkdirSync(path.dirname(file), { recursive: true });

    const fd = fs.openSync(tmp, 'w');
    fs.writeSync(fd, JSON.stringify(safeBoard, null, 1));
    fs.fsyncSync(fd);
    fs.closeSync(fd);

    if (fs.existsSync(file)) fs.copyFileSync(file, file + '.bak');
    fs.renameSync(tmp, file);

    event.returnValue = true;
  } catch (e) {
    console.error('Uložení žebříčku selhalo:', e);
    event.returnValue = false;
  }
});

ipcMain.handle('app:get-config', () => ({
  adminPassword: ADMIN_PASSWORD,
}));

// plynulejší animace a přesnější měření: bez omezování obnovovací frekvence
app.commandLine.appendSwitch('disable-frame-rate-limit');
app.commandLine.appendSwitch('disable-pinch');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    kiosk: true,              // celá obrazovka bez rámu, nejde minimalizovat běžným způsobem
    autoHideMenuBar: true,
    backgroundColor: '#120c2e',
    title: 'Test reakce – překonej pilota Formule 1',
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false,
    },
  });

  win.setMenuBarVisibility(false);
  win.loadFile(path.join(__dirname, 'index.html'));

  // klávesy pro obsluhu: Ctrl+Q ukončí aplikaci, F11 přepne kiosk / okno
  win.webContents.on('before-input-event', (event, input) => {
    if (input.type !== 'keyDown') return;
    if (input.control && input.key.toLowerCase() === 'q') { event.preventDefault(); app.quit(); }
    if (input.key === 'F11') { event.preventDefault(); win.setKiosk(!win.isKiosk()); }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => app.quit());
