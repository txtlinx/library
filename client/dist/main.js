document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('errors');
  const ipV4El = document.getElementById('ip-v4');
  const ipV6El = document.getElementById('ip-v6');
  const timeLocalEl = document.getElementById('time-local');
  const timeSantiagoEl = document.getElementById('time-santiago');
  const usdClpEl = document.getElementById('usd-clp');
  const usdBrlEl = document.getElementById('usd-brl');
  const fxAmountInput = document.getElementById('fx-amount-input');
  const fxBaseCurrency = document.getElementById('fx-base-currency');
  const fxOutClp = document.getElementById('fx-out-clp');
  const fxOutBrl = document.getElementById('fx-out-brl');
  const fxOutUsd = document.getElementById('fx-out-usd');
  const nextTaskTextEl = document.getElementById('next-task-text');
  const tasksListEl = document.getElementById('tasks');
  const tasksRefreshBtn = document.getElementById('tasks-refresh');
  const tasksSortSel = document.getElementById('tasks-sort');
  const tasksMinDurInput = document.getElementById('tasks-min-duration');
  const tasksStatusSel = document.getElementById('tasks-status-filter');
  const tasksTagFilterInput = document.getElementById('tasks-tag-filter');
  const tasksSearchAnyInput = document.getElementById('tasks-search-any');
  const taskCreateToggle = document.getElementById('task-create-toggle');
  const weekViewContainer = document.getElementById('week-view-container');
  const weekViewEl = document.getElementById('week-view');
  const tasksSubtabListBtn = document.getElementById('tasks-subtab-list');
  const tasksSubtabWeekBtn = document.getElementById('tasks-subtab-week');
  const weekCarouselPrevBtn = document.getElementById('week-carousel-prev');
  const weekCarouselNextBtn = document.getElementById('week-carousel-next');
  const weekCarouselRangeEl = document.getElementById('week-carousel-range');
  const tasksStartAlertEl = document.getElementById('tasks-start-alert');
  const tasksCalendarBtn = document.getElementById('tasks-calendar-btn');
  const calModal = document.getElementById('tasks-calendar-modal');
  const calPrevBtn = document.getElementById('cal-prev');
  const calNextBtn = document.getElementById('cal-next');
  const calCloseBtn = document.getElementById('cal-close');
  const calHeader = document.getElementById('cal-header');
  const calGrid = document.getElementById('cal-grid');
  const calWeekdays = document.getElementById('cal-weekdays');
  const calTrashDrop = document.getElementById('cal-trash-drop');
  const paymentsListEl = document.getElementById('payments');
  const paymentsBanksListEl = document.getElementById('payments-banks-list');
  const paymentCreateToggle = document.getElementById('payment-create-toggle');
  const paymentsSubtabListBtn = document.getElementById('payments-subtab-list');
  const paymentsSubtabBanksBtn = document.getElementById('payments-subtab-banks');
  const paymentsSubtabListView = document.getElementById('payments-subtab-list-view');
  const paymentsSubtabBanksView = document.getElementById('payments-subtab-banks-view');
  const paymentsRefreshBtn = document.getElementById('payments-refresh');
  const paymentsBankSel = document.getElementById('payments-bank-filter');
  const paymentsTypeSel = document.getElementById('payments-type-filter');
  const paymentsStatusSel = document.getElementById('payments-status-filter');
  const paymentsMonthInput = document.getElementById('payments-month-filter');
  const paymentsMonthBtn = document.getElementById('payments-month-btn');
  const paymentCreateMonthBtn = document.getElementById('payment-create-month-btn');
  const paymentCreateMonthClear = document.getElementById('payment-create-month-clear');
  const paymentsDateFrom = document.getElementById('payments-date-from');
  const paymentsDateTo = document.getElementById('payments-date-to');
  const paymentsDateClear = document.getElementById('payments-date-clear');
  const paymentsPagePrev = document.getElementById('payments-page-prev');
  const paymentsPageNext = document.getElementById('payments-page-next');
  const paymentsPageInfo = document.getElementById('payments-page-info');
  const paymentsPageSizeSel = document.getElementById('payments-page-size');
  const paymentsSearchAnyInput = document.getElementById('payments-search-any');

  // Notes selectors
  const notesListEl = document.getElementById('notes');
  const notesErrorsListEl = document.getElementById('notes-errors-list');
  const notesErrorCreateToggle = document.getElementById('notes-error-create-toggle');
  const noteCreateToggle = document.getElementById('note-create-toggle');
  const notesSubtabListBtn = document.getElementById('notes-subtab-list');
  const notesSubtabErrorsBtn = document.getElementById('notes-subtab-errors');
  const notesSubtabListView = document.getElementById('notes-subtab-list-view');
  const notesSubtabErrorsView = document.getElementById('notes-subtab-errors-view');
  const notesPagePrev = document.getElementById('notes-page-prev');
  const notesPageNext = document.getElementById('notes-page-next');
  const notesPageInfo = document.getElementById('notes-page-info');
  const notesPageSizeSel = document.getElementById('notes-page-size');
  const notesErrorsSortSel = document.getElementById('notes-errors-sort');
  const notesErrorsSearchInput = document.getElementById('notes-errors-search');
  const notesErrorsRefreshBtn = document.getElementById('notes-errors-refresh');

  const errorsSortSel = document.getElementById('errors-sort');
  const errorsTagFilterInput = document.getElementById('errors-tag-filter');
  const errorsRefreshBtn = document.getElementById('errors-refresh');
  const errorsPagePrev = document.getElementById('errors-page-prev');
  const errorsPageNext = document.getElementById('errors-page-next');
  const errorsPageInfo = document.getElementById('errors-page-info');
  const errorsPageSizeSel = document.getElementById('errors-page-size');

  const tasksDateFrom = document.getElementById('tasks-date-from');
  const tasksDateTo = document.getElementById('tasks-date-to');
  const tasksDateClear = document.getElementById('tasks-date-clear');
  const tasksPagePrev = document.getElementById('tasks-page-prev');
  const tasksPageNext = document.getElementById('tasks-page-next');
  const tasksPageInfo = document.getElementById('tasks-page-info');
  const tasksPageSizeSel = document.getElementById('tasks-page-size');

  let allErrors = [];
  let filteredErrors = [];
  let errorsPage = 1;
  let errorsPageSize = 10;

  let allTasks = [];
  let filteredTasks = [];
  let groupedTasksForList = [];
  const PINNED_TASKS_KEY = 'tasks:pinned:v1';
  let pinnedTaskIds = new Set();
  let weekCarouselOffsetDays = 0;
  let calYear, calMonth; // 0-based month
  let allPayments = [];
  let bankProfilesByBank = {};
  let filteredPayments = [];
  let paymentsChart = null;
  let usdRates = { CLP: null, BRL: null };

  let tasksPage = 1;
  let tasksPageSize = 10;

  // Estado de paginación
  let paymentsPage = 1;
  let paymentsPageSize = 10;

  // Notes state
  let allNotes = [];
  let filteredNotes = [];
  let notesPage = 1;
  let notesPageSize = 10;

  const STATUS_ES = { PAYING: 'Pagando', PAID: 'Pagado', PAUSED: 'Detenido' };
  const STATUS_BADGE = {
    Pagando: { bg:'#0c4a6e', fg:'#bae6fd' },
    Pagado: { bg:'#064e3b', fg:'#a7f3d0' },
    Detenido: { bg:'#7c2d12', fg:'#fde68a' }
  };
  const TYPE_ES = { EXTRA_EXPENSE: 'Gasto extra', FIXED_EXPENSE: 'Gasto fijo', INCOME: 'Ingreso' };
  const BANK_ICON = {
    FALABELLA: '/bancos/banco-falabella.png',
    ESTADO: '/bancos/banco-estado.png',
    CHILE: '/bancos/banco-chile.jpg',
    SANTANDER: '/bancos/banco-santander.png'
  };
  const TYPE_BADGE = {
    'Gasto extra': { bg:'#7c3aed', fg:'#e9d5ff' },
    'Gasto fijo': { bg:'#7c2d12', fg:'#fde68a' },
    'Ingreso': { bg:'#065f46', fg:'#d1fae5' }
  };
  function loadPinnedTasks(){
    try {
      const raw = localStorage.getItem(PINNED_TASKS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      pinnedTaskIds = new Set((Array.isArray(arr) ? arr : []).map((v) => Number(v)).filter((v) => Number.isFinite(v)));
    } catch {
      pinnedTaskIds = new Set();
    }
  }
  function savePinnedTasks(){
    try { localStorage.setItem(PINNED_TASKS_KEY, JSON.stringify([...pinnedTaskIds])); } catch {}
  }
  function isPinnedTask(taskId){ return pinnedTaskIds.has(Number(taskId)); }
  function togglePinTask(taskId){
    const id = Number(taskId);
    if (isPinnedTask(id)) pinnedTaskIds.delete(id);
    else pinnedTaskIds.add(id);
    savePinnedTasks();
  }
  function ensurePinnedVisualStyle(){
    if (document.getElementById('pinned-live-style')) return;
    const s = document.createElement('style');
    s.id = 'pinned-live-style';
    s.textContent = `
      @keyframes pinnedPulse {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(56,189,248,.65); }
        70% { transform: scale(1.03); box-shadow: 0 0 0 10px rgba(56,189,248,0); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(56,189,248,0); }
      }
      @keyframes pinFloat {
        0%,100% { transform: translateY(0); }
        50% { transform: translateY(-1.5px); }
      }
      @keyframes pinTilt {
        0%,100% { transform: rotate(0deg); }
        25% { transform: rotate(-8deg); }
        75% { transform: rotate(8deg); }
      }
    `;
    document.head.appendChild(s);
  }
  function getPinIconMarkup(pinned){
    if (pinned) return '<span style="display:inline-block; animation:pinFloat 1.1s ease-in-out infinite;">📌</span>';
    return '<span style="display:inline-block; animation:pinTilt 1.4s ease-in-out infinite;">📍</span>';
  }
  loadPinnedTasks();
  ensurePinnedVisualStyle();

  // Glow focus consistente para todos los campos de formulario
  function isGlowField(el) {
    if (!el) return false;
    const tag = (el.tagName || '').toLowerCase();
    if (!['input', 'textarea', 'select'].includes(tag)) return false;
    const t = (el.getAttribute('type') || '').toLowerCase();
    return t !== 'checkbox' && t !== 'radio';
  }
  function applyFieldGlow(el) {
    if (!isGlowField(el)) return;
    if (el.dataset.prevBorderColor == null) el.dataset.prevBorderColor = el.style.borderColor || '';
    if (el.dataset.prevBoxShadow == null) el.dataset.prevBoxShadow = el.style.boxShadow || '';
    if (el.dataset.prevTransform == null) el.dataset.prevTransform = el.style.transform || '';
    el.style.borderColor = '#38bdf8';
    el.style.boxShadow = '0 10px 24px rgba(2,132,199,0.35), 0 0 0 1px rgba(125,211,252,0.35) inset, 0 0 0 3px rgba(14,165,233,0.22)';
    el.style.transform = 'translateY(-1px)';
  }
  function clearFieldGlow(el) {
    if (!isGlowField(el)) return;
    el.style.borderColor = el.dataset.prevBorderColor || '';
    el.style.boxShadow = el.dataset.prevBoxShadow || '';
    el.style.transform = el.dataset.prevTransform || '';
  }
  document.addEventListener('focusin', (e) => applyFieldGlow(e.target));
  document.addEventListener('focusout', (e) => clearFieldGlow(e.target));
  const BANKS_FIXED = ['FALABELLA', 'ESTADO', 'CHILE', 'SANTANDER'];

  function applyBtn(el, variant='primary'){ if (!el) return; el.classList.add('btn'); if (variant) el.classList.add('btn-'+variant); }
  function applyInput(el){ if (!el) return; el.classList.add('input'); }
  function applyCard(el){ if (!el) return; el.classList.add('card'); }
  const FIELD_TEXT_LIMITS = {
    title: 120,
    description: 500,
    message: 1200,
    stack: 6000,
    solution: 500,
    tags: 180,
    content: 8000,
    'tasks-search-any': 120,
    'payments-search-any': 120,
    'notes-search-any': 120,
    'errors-tag-filter': 80,
    'tasks-tag-filter': 80,
  };
  const FIELD_NUMBER_LIMITS = {
    durationMinutes: { digits: 4, min: 1, max: 1440 },
    amount: { digits: 12, decimals: 2, min: 0 },
    installments: { digits: 2, min: 0, max: 58 },
    paidInstallments: { digits: 2, min: 0, max: 58 },
    cupoTotal: { digits: 12, min: 0 },
    debtCreditCard: { digits: 12, min: 0 },
    debtCreditLine: { digits: 12, min: 0 },
    debtAdvance: { digits: 12, min: 0 },
    debtConsumerCredit: { digits: 12, min: 0 },
    totalDebt: { digits: 12, min: 0 },
  };
  function enforceInputLimits(root = document){
    if (!root) return;
    const inputs = root.querySelectorAll('input, textarea');
    inputs.forEach((el) => {
      const key = el.id || el.name || '';
      const textMax = FIELD_TEXT_LIMITS[key];
      if (textMax && (el.tagName === 'TEXTAREA' || el.type === 'text' || el.type === 'search')) {
        el.maxLength = textMax;
        if (!el.dataset.limitTextBound) {
          el.addEventListener('input', () => {
            if ((el.value || '').length > textMax) el.value = (el.value || '').slice(0, textMax);
          });
          el.dataset.limitTextBound = '1';
        }
      }
      const numCfg = FIELD_NUMBER_LIMITS[key];
      if (numCfg && el.type === 'number') {
        if (numCfg.min != null) el.min = String(numCfg.min);
        if (numCfg.max != null) el.max = String(numCfg.max);
        el.setAttribute('inputmode', numCfg.decimals ? 'decimal' : 'numeric');
        if (!el.dataset.limitNumBound) {
          el.addEventListener('input', () => {
            let v = String(el.value || '');
            if (numCfg.decimals) {
              v = v.replace(/[^0-9.]/g, '');
              const parts = v.split('.');
              const intPart = (parts[0] || '').slice(0, numCfg.digits);
              const decPart = (parts[1] || '').slice(0, numCfg.decimals);
              v = decPart.length ? `${intPart}.${decPart}` : intPart;
            } else {
              v = v.replace(/\D/g, '').slice(0, numCfg.digits);
            }
            if (numCfg.max != null && Number(v || 0) > numCfg.max) v = String(numCfg.max);
            el.value = v;
          });
          el.dataset.limitNumBound = '1';
        }
      }
    });
  }
  function setupKeyboardForButtons() {
    const shortcutPool = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const keyToButton = new Map();
    const processed = new WeakSet();
    let nextShortcutIndex = 0;

    function isTextEntry(el) {
      if (!el) return false;
      const tag = String(el.tagName || '').toLowerCase();
      return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable;
    }

    function bindButtonShortcut(btn) {
      if (!btn || processed.has(btn)) return;
      processed.add(btn);

      const key = shortcutPool[nextShortcutIndex] || null;
      const directHint = key ? `Alt+Shift+${key}` : null;
      if (key && !btn.dataset.shortcutKey) {
        btn.dataset.shortcutKey = key;
        nextShortcutIndex += 1;
      }
      if (directHint && btn.dataset.shortcutKey) {
        keyToButton.set(btn.dataset.shortcutKey, btn);
        btn.setAttribute('aria-keyshortcuts', directHint);
      }

      const currentTitle = btn.getAttribute('title') || '';
      if (!btn.dataset.kbdHintBound) {
        const keyboardHint = directHint
          ? `Teclado: ${directHint} o Tab + Enter/Espacio`
          : 'Teclado: Tab + Enter/Espacio';
        btn.setAttribute('title', currentTitle ? `${currentTitle} | ${keyboardHint}` : keyboardHint);
        btn.dataset.kbdHintBound = '1';
      }
    }

    function bindAllButtons() {
      document.querySelectorAll('button').forEach((btn) => bindButtonShortcut(btn));
    }

    document.addEventListener('keydown', (e) => {
      if (isTextEntry(document.activeElement)) return;
      if (!e.altKey || !e.shiftKey || e.ctrlKey || e.metaKey) return;
      const key = String(e.key || '').toUpperCase();
      if (!key) return;
      const btn = keyToButton.get(key);
      if (!btn || btn.disabled || !btn.isConnected) return;
      e.preventDefault();
      btn.focus();
      btn.click();
    });

    bindAllButtons();
    const observer = new MutationObserver(() => bindAllButtons());
    observer.observe(document.body, { childList: true, subtree: true });
  }
  const formatCLP = (v) => new Intl.NumberFormat('es-CL', { style:'currency', currency:'CLP', maximumFractionDigits:0 }).format(v || 0);
  function normalizeBankProfile(raw = {}){
    return {
      cupoTotal: Number(raw.cupoTotal ?? raw.totalLimit ?? 0) || 0,
      totalDebt: Number(raw.totalDebt ?? 0) || 0,
      debtCreditCard: Number(raw.debtCreditCard ?? 0) || 0,
      debtCreditLine: Number(raw.debtCreditLine ?? 0) || 0,
      debtAdvance: Number(raw.debtAdvance ?? 0) || 0,
      debtConsumerCredit: Number(raw.debtConsumerCredit ?? 0) || 0,
      totalInstallments: Math.max(0, Math.trunc(Number(raw.totalInstallments ?? 0) || 0)),
      paidInstallments: Math.max(0, Math.trunc(Number(raw.paidInstallments ?? 0) || 0)),
      paymentStatus: String(raw.paymentStatus || '').trim(),
      paymentDate: String(raw.paymentDate || '').trim(),
      statementDate: String(raw.statementDate || '').trim(),
    };
  }
  function normalizeBankProfilesMap(source = {}){
    const out = {};
    BANKS_FIXED.forEach((bank) => { out[bank] = normalizeBankProfile(source[bank] || {}); });
    return out;
  }
  async function fetchBankProfiles({ silent = true } = {}){
    try {
      const res = await fetch('/bank-accounts');
      if (!res.ok) throw new Error('Error al obtener bancos');
      const rows = await res.json();
      const map = {};
      (Array.isArray(rows) ? rows : []).forEach((row) => {
        const bank = String(row.bank || '').toUpperCase();
        if (!BANKS_FIXED.includes(bank)) return;
        map[bank] = normalizeBankProfile(row);
      });
      bankProfilesByBank = normalizeBankProfilesMap(map);
      renderBanksOverview(allPayments);
    } catch (err) {
      console.error(err);
      bankProfilesByBank = normalizeBankProfilesMap(bankProfilesByBank);
      renderBanksOverview(allPayments);
      if (!silent) await showMessageModal('No se pudieron cargar los bancos', { title: 'Error' });
    }
  }
  function fmtDateEs(value){
    const date = value ? new Date(value + 'T00:00:00') : null;
    if (!date || Number.isNaN(date.getTime())) return 'No definida';
    return new Intl.DateTimeFormat('es-CL', { day:'2-digit', month:'2-digit', year:'numeric' }).format(date);
  }
  function deriveBankStatus({ debtPending, paidAmount, bankProfileStatus }){
    if (bankProfileStatus) return bankProfileStatus;
    if (debtPending <= 0) return 'PAGADO';
    if (paidAmount > 0) return 'PAGANDO';
    return 'PENDIENTE';
  }

  async function fetchIP() {
    if (!ipV4El && !ipV6El) return;
    try {
      const res = await fetch('/network/private-ip');
      if (!res.ok) throw new Error('no response');
      const data = await res.json();
      const ipv4 = Array.isArray(data?.ipv4) ? data.ipv4 : [];
      const ipv6 = Array.isArray(data?.ipv6) ? data.ipv6 : [];
      if (ipV4El) ipV4El.textContent = ipv4.length ? ipv4.join(' · ') : 'no disponible';
      if (ipV6El) ipV6El.textContent = ipv6.length ? ipv6.join(' · ') : 'no disponible';
    } catch (err) {
      console.error('fetchIP error', err);
      if (ipV4El) ipV4El.textContent = 'no disponible';
      if (ipV6El) ipV6El.textContent = 'no disponible';
    }
  }
  async function fetchUsdRates() {
    if (!usdClpEl && !usdBrlEl) return;
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) throw new Error('no response');
      const data = await res.json();
      const rates = data?.rates || {};
      const clp = Number(rates.CLP);
      const brl = Number(rates.BRL);
      usdRates = {
        CLP: Number.isFinite(clp) ? clp : null,
        BRL: Number.isFinite(brl) ? brl : null,
      };
      const clpTxt = Number.isFinite(clp)
        ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 2 }).format(clp)
        : 'no disponible';
      const brlTxt = Number.isFinite(brl)
        ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 }).format(brl)
        : 'no disponible';
      if (usdClpEl) usdClpEl.textContent = clpTxt;
      if (usdBrlEl) usdBrlEl.textContent = brlTxt;
      renderFxConverter();
    } catch (err) {
      console.error('fetchUsdRates error', err);
      if (usdClpEl) usdClpEl.textContent = 'no disponible';
      if (usdBrlEl) usdBrlEl.textContent = 'no disponible';
      usdRates = { CLP: null, BRL: null };
      renderFxConverter();
    }
  }
  function renderFxConverter() {
    if (!fxOutClp || !fxOutBrl || !fxOutUsd) return;
    const rawAmount = Number(fxAmountInput?.value || 0);
    const base = String(fxBaseCurrency?.value || 'USD').toUpperCase();
    const clpRate = Number(usdRates.CLP || 0);
    const brlRate = Number(usdRates.BRL || 0);
    if (!Number.isFinite(rawAmount) || rawAmount < 0 || !clpRate || !brlRate) {
      fxOutClp.textContent = '--';
      fxOutBrl.textContent = '--';
      fxOutUsd.textContent = '--';
      return;
    }

    let usdAmount = rawAmount;
    if (base === 'CLP') usdAmount = rawAmount / clpRate;
    else if (base === 'BRL') usdAmount = rawAmount / brlRate;

    const clpAmount = usdAmount * clpRate;
    const brlAmount = usdAmount * brlRate;
    fxOutClp.textContent = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 2 }).format(clpAmount);
    fxOutBrl.textContent = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 }).format(brlAmount);
    fxOutUsd.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(usdAmount);
  }
  function updateClocks() {
    const now = new Date();
    const opts = { weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    if (timeLocalEl) {
      try { timeLocalEl.textContent = new Intl.DateTimeFormat(undefined, opts).format(now); }
      catch { timeLocalEl.textContent = now.toLocaleString(); }
    }
    if (timeSantiagoEl) {
      try { timeSantiagoEl.textContent = new Intl.DateTimeFormat('es-CL', { ...opts, timeZone: 'America/Santiago' }).format(now); }
      catch { try { timeSantiagoEl.textContent = now.toLocaleString('es-CL'); } catch { timeSantiagoEl.textContent = '--:--:--'; } }
    }
  }
  fetchIP();
  fetchUsdRates();
  updateClocks();
  setInterval(updateClocks, 1000);
  setInterval(() => { try { refreshLiveStartCountdowns(); } catch {} }, 1000);
  setInterval(fetchUsdRates, 10 * 60 * 1000);
  setupKeyboardForButtons();
  fxAmountInput?.addEventListener('input', renderFxConverter);
  fxBaseCurrency?.addEventListener('change', renderFxConverter);

  async function fetchErrors() {
    try {
      const res = await fetch('/errors');
      if (!res.ok) throw new Error('Error al obtener errores');
      allErrors = await res.json();
      applyErrorsFilters();
      applyNotesErrorsFilters();
    }
    catch (err) { console.error(err); if (listEl) listEl.innerHTML = '<li>Error cargando errores</li>'; }
  }

  function applyErrorsFilters(){
    const sort = errorsSortSel?.value || 'desc';
    const tagQ = (errorsTagFilterInput?.value || '').trim().toLowerCase();
    filteredErrors = (allErrors || []).filter(e => {
      if (tagQ){ const blob = [e.title, e.message, Array.isArray(e.tags)? e.tags.join(',') : e.tags].filter(Boolean).join(' ').toLowerCase(); if (!blob.includes(tagQ)) return false; }
      return true;
    });
    filteredErrors.sort((a,b)=>{
      const da = a.createdAt? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt? new Date(b.createdAt).getTime() : 0;
      return sort==='asc' ? da - db : db - da;
    });
    errorsPage = 1;
    renderErrorsPage();
  }
  function renderErrorsPage(){
    const total = filteredErrors.length; const pages = Math.max(1, Math.ceil(total / errorsPageSize));
    errorsPage = Math.min(Math.max(1, errorsPage), pages);
    const start = (errorsPage - 1) * errorsPageSize;
    const slice = filteredErrors.slice(start, start + errorsPageSize);
    renderErrors(slice);
    if (errorsPageInfo) errorsPageInfo.textContent = `Página ${errorsPage} de ${pages} · ${total} ítems`;
    if (errorsPagePrev) errorsPagePrev.disabled = errorsPage <= 1;
    if (errorsPageNext) errorsPageNext.disabled = errorsPage >= pages;
  }
  errorsSortSel?.addEventListener('change', applyErrorsFilters);
  errorsTagFilterInput?.addEventListener('input', ()=>{ applyErrorsFilters(); });
  errorsRefreshBtn?.addEventListener('click', ()=>{ errorsTagFilterInput && (errorsTagFilterInput.value=''); errorsSortSel && (errorsSortSel.value='desc'); applyErrorsFilters(); });
  errorsPagePrev?.addEventListener('click', ()=>{ errorsPage = Math.max(1, errorsPage - 1); renderErrorsPage(); });
  errorsPageNext?.addEventListener('click', ()=>{ errorsPage = errorsPage + 1; renderErrorsPage(); });
  errorsPageSizeSel?.addEventListener('change', ()=>{ errorsPageSize = parseInt(errorsPageSizeSel.value || '10', 10) || 10; errorsPage = 1; renderErrorsPage(); });

  function applyNotesErrorsFilters() {
    if (!notesErrorsListEl) return;
    const sort = notesErrorsSortSel?.value || 'desc';
    const q = (notesErrorsSearchInput?.value || '').trim().toLowerCase();
    const items = (Array.isArray(allErrors) ? allErrors : []).filter((e) => {
      if (!q) return true;
      const haystack = [
        e?.title,
        e?.message,
        e?.solution,
        Array.isArray(e?.tags) ? e.tags.join(' ') : e?.tags
      ].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(q);
    });
    items.sort((a, b) => {
      const da = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sort === 'asc' ? da - db : db - da;
    });
    renderErrors(items, notesErrorsListEl);
  }
  notesErrorsSortSel?.addEventListener('change', applyNotesErrorsFilters);
  notesErrorsSearchInput?.addEventListener('input', applyNotesErrorsFilters);
  notesErrorsRefreshBtn?.addEventListener('click', () => {
    if (notesErrorsSearchInput) notesErrorsSearchInput.value = '';
    if (notesErrorsSortSel) notesErrorsSortSel.value = 'desc';
    applyNotesErrorsFilters();
  });

  // Modal de mensajes (reutilizable)
  function ensureMessageModal() {
    let overlay = document.getElementById('message-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'message-overlay';
      overlay.style.position = 'fixed'; overlay.style.inset = '0';
      overlay.style.background = 'rgba(15,23,42,0.75)'; overlay.style.backdropFilter = 'blur(4px)';
      overlay.style.display = 'flex'; overlay.style.alignItems = 'center'; overlay.style.justifyContent = 'center';
      overlay.style.zIndex = '10002'; overlay.style.visibility = 'hidden'; overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.15s ease-out, visibility 0.15s ease-out';
      overlay.innerHTML = `
        <div role="alertdialog" aria-modal="true" aria-labelledby="msg-title" style="background:#020617;border:1px solid #1f2937;border-radius:12px;max-width:360px;width:92%;padding:16px;box-shadow:0 20px 60px rgba(0,0,0,0.7);">
          <div id="msg-title" style="font-weight:600;margin-bottom:8px;color:#e5e7eb;">Mensaje</div>
          <div id="msg-body" style="margin-bottom:12px;color:#cbd5e1;"></div>
          <div style="display:flex;justify-content:flex-end;">
            <button id="msg-ok" class="btn btn-primary">Cerrar</button>
          </div>
        </div>`;
      document.body.appendChild(overlay);
    }
    return overlay;
  }
  async function showMessageModal(text, opts = {}) {
    const { title = 'Mensaje' } = opts; const overlay = ensureMessageModal();
    const t = overlay.querySelector('#msg-title'), b = overlay.querySelector('#msg-body'), ok = overlay.querySelector('#msg-ok');
    if (t) t.textContent = title; if (b) b.textContent = text;
    return new Promise(resolve => {
      function cleanup(){ overlay.style.opacity='0'; overlay.style.visibility='hidden'; ok.removeEventListener('click', onOk); overlay.removeEventListener('click', onOverlay); document.removeEventListener('keydown', onKey);} 
      function onOk(e){ e.preventDefault(); cleanup(); resolve(); }
      function onOverlay(e){ if (e.target === overlay) onOk(e); }
      function onKey(e){ if (e.key === 'Escape' || e.key === 'Enter') onOk(e); }
      ok.addEventListener('click', onOk); overlay.addEventListener('click', onOverlay); document.addEventListener('keydown', onKey);
      overlay.style.visibility='visible'; overlay.style.opacity='1'; setTimeout(() => { try { ok.focus(); } catch {} }, 0);
    });
  }

  function attachFlatpickrIfAvailable(input, cfg = {}) {
    if (!input || typeof window.flatpickr !== 'function') return null;
    try {
      const locale = window.flatpickr.l10ns?.es ? window.flatpickr.l10ns.es : undefined;
      return window.flatpickr(input, { ...cfg, locale, disableMobile: true });
    } catch {
      return null;
    }
  }
  function getTaskCountByDayMap() {
    const map = new Map();
    const src = (filteredTasks && filteredTasks.length ? filteredTasks : allTasks) || [];
    src.forEach((t) => {
      if (!t || !t.startAt) return;
      const key = localDateKey(t.startAt);
      map.set(key, (map.get(key) || 0) + 1);
    });
    return map;
  }
  function decorateDayWithTaskCount(dayElem, count) {
    if (!dayElem || !count) return;
    const badge = document.createElement('span');
    badge.textContent = String(count);
    badge.title = `${count} tarea${count === 1 ? '' : 's'}`;
    badge.style.position = 'absolute';
    badge.style.top = '3px';
    badge.style.right = '3px';
    badge.style.minWidth = '16px';
    badge.style.height = '16px';
    badge.style.borderRadius = '999px';
    badge.style.display = 'inline-flex';
    badge.style.alignItems = 'center';
    badge.style.justifyContent = 'center';
    badge.style.fontSize = '10px';
    badge.style.fontWeight = '800';
    badge.style.lineHeight = '1';
    badge.style.color = '#f8fafc';
    badge.style.background = 'linear-gradient(135deg,#06b6d4,#2563eb)';
    badge.style.border = '1px solid rgba(186,230,253,0.55)';
    badge.style.boxShadow = '0 4px 10px rgba(2,132,199,0.32)';
    dayElem.style.position = 'relative';
    dayElem.appendChild(badge);
  }
  function monthPluginConfig() {
    if (typeof window.monthSelectPlugin !== 'function') return null;
    return window.monthSelectPlugin({
      shorthand: true,
      dateFormat: 'Y-m',
      altFormat: 'F Y',
      theme: 'dark',
    });
  }

  // Modal de formulario (crear/editar)
  function ensureFormModal() {
    let overlay = document.getElementById('form-overlay');
    if (!overlay) {
      overlay = document.createElement('div'); overlay.id = 'form-overlay';
      overlay.style.position='fixed'; overlay.style.inset='0'; overlay.style.background='rgba(15,23,42,0.75)'; overlay.style.backdropFilter='blur(4px)';
      overlay.style.display='flex'; overlay.style.alignItems='center'; overlay.style.justifyContent='center'; overlay.style.zIndex='10003';
      overlay.style.visibility='hidden'; overlay.style.opacity='0'; overlay.style.transition='opacity 0.15s ease-out, visibility 0.15s ease-out';
      overlay.innerHTML = `
        <div class="form-modal" role="dialog" aria-modal="true" aria-labelledby="form-title" style="background:radial-gradient(circle at top, rgba(14,116,144,0.18), rgba(2,6,23,0.96) 48%), #020617;border:1px solid #164e63;border-radius:14px;max-width:520px;width:92%;padding:16px;box-shadow:0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(56,189,248,0.18) inset;max-height:90vh;overflow:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <div id="form-title" style="font-weight:700;color:#f8fafc;">Formulario</div>
            <button id="form-close" class="btn btn-neutral" style="font-size:14px;padding:4px 8px;">×</button>
          </div>
          <div id="form-body" style="color:#cbd5e1;"></div>
          <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px;">
            <button id="form-cancel" class="btn btn-neutral">Cancelar</button>
            <button id="form-submit" class="btn btn-success">Guardar</button>
          </div>
        </div>`;
      document.body.appendChild(overlay);
    }
    return overlay;
  }
  function showFormModal({ title, fields, onSubmit }) {
    const overlay = ensureFormModal(); const titleEl = overlay.querySelector('#form-title'); const bodyEl = overlay.querySelector('#form-body');
    const btnCancel = overlay.querySelector('#form-cancel'); const btnSubmit = overlay.querySelector('#form-submit'); const btnClose = overlay.querySelector('#form-close');
    if (titleEl) titleEl.textContent = title || 'Formulario';
    if (bodyEl) {
      bodyEl.innerHTML = '';
      fields.forEach(f => {
        const row = document.createElement('div');
        row.style.display = 'flex'; row.style.flexDirection='column'; row.style.marginBottom='12px';
        const label=document.createElement('label'); label.textContent=f.label; label.style.display='block'; label.style.color='#e5e7eb'; label.style.fontWeight='600'; label.style.marginBottom='6px';
        row.appendChild(label);
        let input;
        if (f.type==='textarea'){
          input=document.createElement('textarea'); input.rows=f.rows||3;
        } else if (f.type==='file'){
          input=document.createElement('input'); input.type='file'; if (f.accept) input.accept=f.accept; if (f.multiple) input.multiple=true;
        } else if (f.type==='datetime-local'){
          const wrap = document.createElement('div');
          wrap.style.display='flex'; wrap.style.alignItems='center'; wrap.style.gap='8px';
          wrap.style.background='linear-gradient(135deg, rgba(14,116,144,0.22), rgba(30,64,175,0.16) 45%, rgba(11,18,32,0.98) 100%)';
          wrap.style.border='1px solid #0ea5e9'; wrap.style.borderRadius='12px'; wrap.style.padding='8px'; wrap.style.boxShadow='0 8px 22px rgba(2,132,199,0.25), 0 0 0 1px rgba(125,211,252,0.25) inset';
          input=document.createElement('input'); input.type='text'; input.id=f.id; input.value=f.value||''; input.placeholder='YYYY-MM-DDTHH:mm';
          input.style.flex='1'; input.style.background='rgba(2,6,23,0.55)'; input.style.color='#f0f9ff'; input.style.border='none'; input.style.outline='none'; input.style.padding='10px 12px'; input.style.borderRadius='9px'; input.style.fontWeight='700';
          const btn=document.createElement('button'); btn.type='button'; btn.textContent='📅'; btn.title='Abrir calendario'; btn.style.background='linear-gradient(135deg,#06b6d4,#3b82f6)'; btn.style.color='#fff'; btn.style.border='1px solid rgba(186,230,253,0.55)'; btn.style.borderRadius='10px'; btn.style.padding='9px 11px'; btn.style.cursor='pointer'; btn.style.boxShadow='0 8px 16px rgba(37,99,235,0.35)';
          const taskCountMap = getTaskCountByDayMap();
          const fp = attachFlatpickrIfAvailable(input, {
            enableTime: true,
            time_24hr: true,
            minuteIncrement: 5,
            allowInput: true,
            dateFormat: 'Y-m-d\\TH:i',
            defaultDate: f.value || undefined,
            onDayCreate: (_dObj, _dStr, _fp, dayElem) => {
              const key = localDateKey(dayElem.dateObj);
              const count = taskCountMap.get(key) || 0;
              decorateDayWithTaskCount(dayElem, count);
            },
          });
          btn.addEventListener('click', ()=>{ if (fp && typeof fp.open === 'function') fp.open(); else input.focus(); });
          input.addEventListener('focus', ()=>{ wrap.style.transform='translateY(-1px)'; wrap.style.boxShadow='0 10px 24px rgba(2,132,199,0.35), 0 0 0 1px rgba(125,211,252,0.35) inset'; });
          input.addEventListener('blur', ()=>{ wrap.style.transform='none'; wrap.style.boxShadow='0 8px 22px rgba(2,132,199,0.25), 0 0 0 1px rgba(125,211,252,0.25) inset'; });
          wrap.appendChild(input); wrap.appendChild(btn); row.appendChild(wrap);
        } else if (f.type==='month'){
          const wrap = document.createElement('div');
          wrap.style.display='flex'; wrap.style.alignItems='center'; wrap.style.gap='8px';
          wrap.style.background='linear-gradient(135deg, rgba(14,116,144,0.22), rgba(30,64,175,0.16) 45%, rgba(11,18,32,0.98) 100%)';
          wrap.style.border='1px solid #0ea5e9'; wrap.style.borderRadius='12px'; wrap.style.padding='8px'; wrap.style.boxShadow='0 8px 22px rgba(2,132,199,0.25), 0 0 0 1px rgba(125,211,252,0.25) inset';
          input=document.createElement('input'); input.type='text'; input.id=f.id; input.value=f.value||''; input.placeholder='YYYY-MM';
          input.style.flex='1'; input.style.background='rgba(2,6,23,0.55)'; input.style.color='#f0f9ff'; input.style.border='none'; input.style.outline='none'; input.style.padding='10px 12px'; input.style.borderRadius='9px'; input.style.fontWeight='700';
          const btn=document.createElement('button'); btn.type='button'; btn.textContent='📅'; btn.title='Abrir calendario'; btn.style.background='linear-gradient(135deg,#06b6d4,#3b82f6)'; btn.style.color='#fff'; btn.style.border='1px solid rgba(186,230,253,0.55)'; btn.style.borderRadius='10px'; btn.style.padding='9px 11px'; btn.style.cursor='pointer'; btn.style.boxShadow='0 8px 16px rgba(37,99,235,0.35)';
          const monthPlugin = monthPluginConfig();
          const fp = attachFlatpickrIfAvailable(input, monthPlugin ? { plugins: [monthPlugin], defaultDate: f.value || undefined } : { dateFormat: 'Y-m', defaultDate: f.value || undefined });
          btn.addEventListener('click', ()=>{ if (fp && typeof fp.open === 'function') fp.open(); else input.focus(); });
          input.addEventListener('focus', ()=>{ wrap.style.transform='translateY(-1px)'; wrap.style.boxShadow='0 10px 24px rgba(2,132,199,0.35), 0 0 0 1px rgba(125,211,252,0.35) inset'; });
          input.addEventListener('blur', ()=>{ wrap.style.transform='none'; wrap.style.boxShadow='0 8px 22px rgba(2,132,199,0.25), 0 0 0 1px rgba(125,211,252,0.25) inset'; });
          wrap.appendChild(input); wrap.appendChild(btn); row.appendChild(wrap);
        } else if (f.type==='select'){
          input=document.createElement('select');
          (f.options||[]).forEach(opt=>{ const o=document.createElement('option'); o.value=opt.value; o.textContent=opt.label; if (opt.value===f.value) o.selected=true; input.appendChild(o); });
        } else {
          input=document.createElement('input'); input.type=f.type||'text';
        }
        if (input && f.type!=='datetime-local' && f.type!=='month') {
          input.id=f.id; if (f.type!=='file') input.value=f.value||'';
          // Unificar tamaño: ancho completo y mismo padding
          input.style.width='100%'; input.style.boxSizing='border-box'; input.style.background='#0b1220'; input.style.color='#e5e7eb'; input.style.border='1px solid #334155'; input.style.borderRadius='10px'; input.style.padding='8px 10px';
          row.appendChild(input);
        }
        bodyEl.appendChild(row);
      });
      enforceInputLimits(bodyEl);
    }
    function cleanup(){ overlay.style.opacity='0'; overlay.style.visibility='hidden'; btnCancel.removeEventListener('click', onCancel); btnSubmit.removeEventListener('click', onSubmitClick); btnClose.removeEventListener('click', onCancel); overlay.removeEventListener('click', onOverlayClick); document.removeEventListener('keydown', onKey); }
    function onCancel(e){ e.preventDefault(); cleanup(); }
    function onOverlayClick(e){ if (e.target===overlay) onCancel(e); }
    function onKey(e){ if (e.key==='Escape') onCancel(e); }
    async function onSubmitClick(e){ e.preventDefault(); const values={}; fields.forEach(f=>{ const el=overlay.querySelector('#'+f.id); if (!el) return; if (f.type==='file'){ values[f.id]=el.files; } else { values[f.id]=(el.value||'').trim(); } }); cleanup(); try { await onSubmit(values); } catch (err) { console.error('form submit error', err); await showMessageModal('No se pudo enviar el formulario', { title: 'Error' }); } }
    btnCancel.addEventListener('click', onCancel); btnSubmit.addEventListener('click', onSubmitClick); btnClose.addEventListener('click', onCancel); overlay.addEventListener('click', onOverlayClick); document.addEventListener('keydown', onKey);
    overlay.style.visibility='visible'; overlay.style.opacity='1'; setTimeout(()=>{ try { btnSubmit.focus(); } catch {} },0);
  }

  function wireStaticFlatpickrInputs() {
    const monthPlugin = monthPluginConfig();
    document.querySelectorAll('input[type="date"]').forEach((el) => {
      if (el.dataset.fpBound) return;
      el.type = 'text';
      attachFlatpickrIfAvailable(el, { dateFormat: 'Y-m-d', defaultDate: el.value || undefined });
      el.dataset.fpBound = '1';
    });
    document.querySelectorAll('input[type="datetime-local"]').forEach((el) => {
      if (el.dataset.fpBound) return;
      el.type = 'text';
      attachFlatpickrIfAvailable(el, { enableTime: true, time_24hr: true, minuteIncrement: 5, dateFormat: 'Y-m-d\\TH:i', defaultDate: el.value || undefined });
      el.dataset.fpBound = '1';
    });
    document.querySelectorAll('input[type="month"]').forEach((el) => {
      if (el.dataset.fpBound) return;
      el.type = 'text';
      if (monthPlugin) attachFlatpickrIfAvailable(el, { plugins: [monthPlugin], defaultDate: el.value || undefined });
      else attachFlatpickrIfAvailable(el, { dateFormat: 'Y-m', defaultDate: el.value || undefined });
      el.dataset.fpBound = '1';
    });
  }

  async function refreshErrorsEverywhere() {
    await fetchErrors();
    if (notesSubtabErrorsBtn?.classList.contains('active')) {
      applyNotesErrorsFilters();
    }
  }

  // Render de errores
  function renderErrors(errors, targetEl = listEl) {
    if (!targetEl) return;
    targetEl.innerHTML = '';
    if (!errors || errors.length === 0) { targetEl.innerHTML = '<li>No hay errores</li>'; return; }
    errors.forEach(e => {
      const li = document.createElement('li');
      const viewDiv = document.createElement('div');
      // envolver textos con clases para Modo P
      const tagsHtml = Array.isArray(e.tags) ? e.tags.map(t => escapeHtml(t)).join(', ') : '';
      viewDiv.innerHTML = `
        <strong class="censor-title">${escapeHtml(e.title)}</strong>
        — <span class="censor-message">${escapeHtml(e.message)}</span><br/>
        <em>Solución:</em> <span class="censor-solution">${escapeHtml(e.solution || '')}</span><br/>
        <small>Tags: <span class="censor-tags">${tagsHtml}</span></small>
      `;
      if (e.createdAt) { try { const d=new Date(e.createdAt); const txt=new Intl.DateTimeFormat(undefined,{day:'2-digit',month:'short',year:'numeric'}).format(d); const s=document.createElement('span'); s.className='created-date'; s.textContent='Creado: '+txt; viewDiv.appendChild(s);} catch { const s=document.createElement('span'); s.className='created-date'; s.textContent='Creado: '+String(e.createdAt); viewDiv.appendChild(s);} }
      // Thumbnails
      let btnToggle=null; let thumbs=null;
      if (Array.isArray(e.images) && e.images.length>0) {
        btnToggle=document.createElement('button'); btnToggle.textContent=`Ver imágenes (${e.images.length})`; btnToggle.className='button-toggle-images'; btnToggle.style.marginTop='8px'; btnToggle.style.marginRight='8px'; btnToggle.style.background='#374151'; btnToggle.style.borderRadius='6px'; btnToggle.style.padding='6px 10px'; btnToggle.style.border='none'; btnToggle.style.cursor='pointer';
        thumbs=document.createElement('div'); thumbs.className='thumbnails'; thumbs.style.marginTop='8px'; thumbs.style.gap='8px'; thumbs.style.flexWrap='wrap';
        e.images.forEach(src=>{ const img=document.createElement('img'); img.src=src; img.alt=e.title||'imagen'; img.className='thumb card'; img.style.cursor='pointer'; img.style.width='80px'; img.style.height='60px'; img.style.objectFit='cover'; img.style.borderRadius='6px'; img.style.border='1px solid #e5e7eb'; img.addEventListener('click',()=>{ const overlay=document.createElement('div'); overlay.style.position='fixed'; overlay.style.left='0'; overlay.style.top='0'; overlay.style.width='100%'; overlay.style.height='100%'; overlay.style.background='rgba(0,0,0,0.6)'; overlay.style.display='flex'; overlay.style.alignItems='center'; overlay.style.justifyContent='center'; overlay.style.zIndex='9999'; const big=document.createElement('img'); big.src=src; big.style.maxWidth='90%'; big.style.maxHeight='90%'; big.style.borderRadius='8px'; big.style.boxShadow='0 10px 30px rgba(0,0,0,0.4)'; overlay.appendChild(big); overlay.addEventListener('click',()=>document.body.removeChild(overlay)); document.body.appendChild(overlay); }); thumbs.appendChild(img); });
        btnToggle.addEventListener('click',()=>{ const vis=thumbs.classList.toggle('visible'); btnToggle.textContent = vis ? `Ocultar imágenes (${e.images.length})` : `Ver imágenes (${e.images.length})`; });
      }
      // Botones
      const btnUpdate=document.createElement('button'); btnUpdate.textContent='Actualizar'; applyBtn(btnUpdate, 'primary');
      const btnDelete=document.createElement('button'); btnDelete.textContent='Eliminar'; btnDelete.className='btn btn-danger';
      btnUpdate.addEventListener('click',()=>openEditModal(e));
      btnDelete.addEventListener('click', async ()=>{ const confirmed = await showConfirm('¿Eliminar este error?'); if (!confirmed) return; try { const res = await fetch('/errors/'+e.id,{method:'DELETE'}); if (!res.ok) throw new Error(await res.text()||'Error eliminando'); await refreshErrorsEverywhere(); } catch (err) { console.error(err); await showMessageModal('No se pudo eliminar el error', { title: 'Error' }); } });
      li.appendChild(viewDiv); li.appendChild(btnUpdate); if (btnToggle) li.appendChild(btnToggle); li.appendChild(btnDelete); if (thumbs) li.appendChild(thumbs);
      targetEl.appendChild(li);
    });
  }

  function escapeHtml(str){ if (!str) return ''; return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;'); }

  // Confirm modal
  function ensureConfirmModal() {
    let overlay = document.getElementById('confirm-overlay');
    if (!overlay) {
      overlay = document.createElement('div'); overlay.id='confirm-overlay'; overlay.style.position='fixed'; overlay.style.inset='0'; overlay.style.background='rgba(15,23,42,0.75)'; overlay.style.backdropFilter='blur(4px)'; overlay.style.display='flex'; overlay.style.alignItems='center'; overlay.style.justifyContent='center'; overlay.style.zIndex='10000'; overlay.style.visibility='hidden'; overlay.style.opacity='0'; overlay.style.transition='opacity 0.15s ease-out, visibility 0.15s ease-out';
      overlay.innerHTML = `
        <div role="dialog" aria-modal="true" aria-labelledby="confirm-title" style="background:#020617;border:1px solid #1f2937;border-radius:12px;max-width:360px;width:92%;padding:16px;box-shadow:0 20px 60px rgba(0,0,0,0.7);">
          <div id="confirm-title" style="font-weight:600;margin-bottom:8px;color:#e5e7eb;">Confirmar</div>
          <div style="margin-bottom:12px;color:#cbd5e1;"><span id="confirm-message">¿Seguro?</span></div>
          <div style="display:flex;justify-content:flex-end;gap:8px;">
            <button id="confirm-cancel" class="btn btn-neutral">Cancelar</button>
            <button id="confirm-accept" class="btn btn-danger">Aceptar</button>
          </div>`;
      document.body.appendChild(overlay);
    }
    return overlay;
  }
  function showConfirm(message, opts = {}) {
    const { title = 'Confirmar', confirmText = 'Aceptar', cancelText = 'Cancelar' } = opts; const overlay = ensureConfirmModal();
    const titleEl=overlay.querySelector('#confirm-title'); const msgEl=overlay.querySelector('#confirm-message'); const btnOk=overlay.querySelector('#confirm-accept'); const btnCancel=overlay.querySelector('#confirm-cancel');
    if (titleEl) titleEl.textContent=title; if (msgEl) msgEl.textContent=message; if (btnOk) btnOk.textContent=confirmText; if (btnCancel) btnCancel.textContent=cancelText;
    return new Promise(resolve=>{ function cleanup(){ overlay.style.opacity='0'; overlay.style.visibility='hidden'; btnOk.removeEventListener('click', onOk); btnCancel.removeEventListener('click', onCancel); overlay.removeEventListener('click', onOverlayClick); document.removeEventListener('keydown', onKey);} function onOk(e){ e.preventDefault(); cleanup(); resolve(true);} function onCancel(e){ e.preventDefault(); cleanup(); resolve(false);} function onOverlayClick(e){ if (e.target===overlay) onCancel(e);} function onKey(e){ if (e.key==='Escape') onCancel(e);} btnOk.addEventListener('click', onOk); btnCancel.addEventListener('click', onCancel); overlay.addEventListener('click', onOverlayClick); document.addEventListener('keydown', onKey); overlay.style.visibility='visible'; overlay.style.opacity='1'; setTimeout(()=>{ try { btnCancel.focus(); } catch {} },0); });
  }

  // Tabs y contraer listas
  const sections = document.querySelectorAll('[data-section]'); const tabButtons = document.querySelectorAll('.tab-btn[data-tab]');
  function showTab(tab){ sections.forEach(sec=>{ const sTab=sec.getAttribute('data-section'); if (!sTab) return; sec.classList.toggle('hidden', sTab!==tab && !(tab==='tasks' && sTab==='tasks-board')); }); tabButtons.forEach(btn=>{ btn.classList.toggle('active', btn.getAttribute('data-tab')===tab); }); }
  tabButtons.forEach(btn=>{ btn.addEventListener('click',()=>{ const tab=btn.getAttribute('data-tab'); if (!tab) return; showTab(tab); if (tab==='errors') fetchErrors(); if (tab==='tasks') { if (typeof fetchTasks === 'function') fetchTasks(); } if (tab==='payments') { if (typeof fetchPayments === 'function') fetchPayments(); } if (tab==='notes') { if (typeof window.fetchNotes === 'function') window.fetchNotes(); } }); });
  function setupToggleList(buttonId, listSelector){ const btn=document.getElementById(buttonId); const list=document.querySelector(listSelector); if (!btn || !list) return; btn.addEventListener('click',()=>{ const collapsed=list.classList.toggle('collapsed'); btn.textContent = collapsed ? 'Expandir' : 'Contraer'; }); }

  // Persistencia de Modo P en localStorage por sección
  function getCensorKey(id){ return 'censor:' + id; }
  function applyCensorState(btnId, sectionId){
    const btn = document.getElementById(btnId);
    const section = document.getElementById(sectionId);
    if (!section) return;
    const stored = localStorage.getItem(getCensorKey(sectionId));
    const isOn = stored === null ? true : stored === 'on';
    section.classList.toggle('censored', isOn);
    if (btn) { btn.textContent = 'Modo P: ' + (isOn ? 'ON' : 'OFF'); btn.title = isOn ? 'Mostrar contenido' : 'Ocultar contenido'; }
  }
  function setupPersistentCensorToggle(btnId, sectionId){
    const btn = document.getElementById(btnId);
    const section = document.getElementById(sectionId);
    if (!btn || !section) return;
    btn.addEventListener('click', ()=>{
      const isOn = section.classList.toggle('censored');
      btn.textContent = 'Modo P: ' + (isOn ? 'ON' : 'OFF');
      btn.title = isOn ? 'Mostrar contenido' : 'Ocultar contenido';
      localStorage.setItem(getCensorKey(sectionId), isOn ? 'on' : 'off');
    });
  }
  // Initialize censor state and toggles
  applyCensorState('errors-censor-toggle', 'errors-section');
  applyCensorState('tasks-censor-toggle', 'tasks-section');
  applyCensorState('payments-censor-toggle', 'payments-section');
  applyCensorState('notes-censor-toggle', 'notes-section');
  setupPersistentCensorToggle('errors-censor-toggle', 'errors-section');
  setupPersistentCensorToggle('tasks-censor-toggle', 'tasks-section');
  setupPersistentCensorToggle('payments-censor-toggle', 'payments-section');
  setupPersistentCensorToggle('notes-censor-toggle', 'notes-section');

  function applyTaskFilters() {
    const q = (tasksSearchAnyInput?.value || '').trim().toLowerCase();
    const minDur = parseInt(tasksMinDurInput?.value || '0', 10) || 0;
    const status = tasksStatusSel?.value || '';
    const tagFilter = (tasksTagFilterInput?.value || '').trim().toLowerCase();
    const sort = tasksSortSel?.value || 'created-desc';
    const from = tasksDateFrom?.value || '';
    const to = tasksDateTo?.value || '';
    filteredTasks = allTasks.filter(t => {
      if (q) {
        const statusTxt = String(getEffectiveTaskStatus(t) || '').toLowerCase();
        const haystack = [
          t?.id,
          t?.title,
          t?.description,
          t?.startAt,
          t?.createdAt,
          t?.durationMinutes,
          statusTxt,
          Array.isArray(t?.tags) ? t.tags.join(' ') : String(t?.tags || ''),
        ].map(v => String(v || '').toLowerCase()).join(' ');
        if (!haystack.includes(q)) return false;
      }
      // min duration
      if (minDur > 0 && (t.durationMinutes || 0) < minDur) return false;
      // status
      if (status && getEffectiveTaskStatus(t) !== status) return false;
      // tag filter: match any
      if (tagFilter) {
        const tags = Array.isArray(t.tags) ? t.tags.map(x => x.toLowerCase()) : String(t.tags || '').toLowerCase().split(',').map(s=>s.trim()).filter(Boolean);
        if (!tags.some(x => x.includes(tagFilter))) return false;
      }
      // rango fechas por startAt
      if (from){ const f = new Date(from + 'T00:00:00'); const ts = t.startAt ? new Date(t.startAt) : null; if (!ts || ts < f) return false; }
      if (to){ const tt = new Date(to + 'T23:59:59'); const ts = t.startAt ? new Date(t.startAt) : null; if (!ts || ts > tt) return false; }
      return true;
    });
    // sort
    const byDate = (a,b,prop) => { const da = a[prop] ? new Date(a[prop]).getTime() : 0; const db = b[prop] ? new Date(b[prop]).getTime() : 0; return da - db; };
    if (sort === 'status') {
      const rank = { IN_PROGRESS: 0, PAUSED: 1, STOPPED: 2, COMPLETED: 3 };
      filteredTasks.sort((a,b) => {
        const ra = rank[getEffectiveTaskStatus(a)] ?? 99;
        const rb = rank[getEffectiveTaskStatus(b)] ?? 99;
        if (ra !== rb) return ra - rb;
        return byDate(a,b,'startAt');
      });
    } else if (sort === 'start-near') {
      const now = Date.now();
      filteredTasks.sort((a,b) => {
        const ta = a.startAt ? new Date(a.startAt).getTime() : Infinity;
        const tb = b.startAt ? new Date(b.startAt).getTime() : Infinity;
        const wa = ta >= now ? ta : ta + 10_000_000_000;
        const wb = tb >= now ? tb : tb + 10_000_000_000;
        return wa - wb;
      });
    } else if (sort === 'duration-desc') {
      filteredTasks.sort((a,b) => (Number(b.durationMinutes || 0) - Number(a.durationMinutes || 0)) || byDate(a,b,'startAt'));
    } else if (sort === 'duration-asc') {
      filteredTasks.sort((a,b) => (Number(a.durationMinutes || 0) - Number(b.durationMinutes || 0)) || byDate(a,b,'startAt'));
    } else if (sort === 'created-desc') {
      filteredTasks.sort((a,b)=>byDate(b,a,'createdAt'));
    } else if (sort === 'created-asc') {
      filteredTasks.sort((a,b)=>byDate(a,b,'createdAt'));
    }
    // Siempre priorizar tareas fijadas al inicio, manteniendo el orden elegido entre ellas
    filteredTasks.sort((a,b) => {
      const pa = isPinnedTask(a.id) ? 1 : 0;
      const pb = isPinnedTask(b.id) ? 1 : 0;
      return pb - pa;
    });

    groupedTasksForList = buildGroupedTasksForList(filteredTasks);
    tasksPage = 1;
    renderTasksPage();
    updateNextTaskMarquee(filteredTasks);
    renderTasksStartAlert(filteredTasks);
    renderWeekView(filteredTasks);
    renderTaskFilterChips();
  }
  function renderTasksPage(){
    const listSrc = groupedTasksForList.length ? groupedTasksForList : filteredTasks;
    const total = listSrc.length; const pages = Math.max(1, Math.ceil(total / tasksPageSize));
    tasksPage = Math.min(Math.max(1, tasksPage), pages);
    const start = (tasksPage - 1) * tasksPageSize;
    const slice = listSrc.slice(start, start + tasksPageSize);
    renderTasks(slice);
    if (tasksPageInfo) tasksPageInfo.textContent = `Página ${tasksPage} de ${pages} · ${total} ítems`;
    if (tasksPagePrev) tasksPagePrev.disabled = tasksPage <= 1;
    if (tasksPageNext) tasksPageNext.disabled = tasksPage >= pages;
  }
  tasksPagePrev?.addEventListener('click', ()=>{ tasksPage = Math.max(1, tasksPage - 1); renderTasksPage(); });
  tasksPageNext?.addEventListener('click', ()=>{ tasksPage = tasksPage + 1; renderTasksPage(); });
  tasksPageSizeSel?.addEventListener('change', ()=>{ tasksPageSize = parseInt(tasksPageSizeSel.value || '10', 10) || 10; tasksPage = 1; renderTasksPage(); });
  tasksSearchAnyInput?.addEventListener('input', applyTaskFilters);
  tasksDateFrom?.addEventListener('change', applyTaskFilters);
  tasksDateTo?.addEventListener('change', applyTaskFilters);
  tasksDateClear?.addEventListener('click', ()=>{ if (tasksDateFrom) tasksDateFrom.value=''; if (tasksDateTo) tasksDateTo.value=''; applyTaskFilters(); });

  function openCreateErrorModal() {
    showFormModal({
      title: 'Nuevo error',
      fields: [
        { id: 'title', label: 'Título', type: 'text', value: '' },
        { id: 'message', label: 'Mensaje', type: 'textarea', rows: 3, value: '' },
        { id: 'stack', label: 'Stack (opcional)', type: 'textarea', rows: 2, value: '' },
        { id: 'solution', label: 'Solución', type: 'text', value: '' },
        { id: 'tags', label: 'Tags (separados por coma)', type: 'text', value: '' },
        { id: 'images', label: 'Imágenes (opcional)', type: 'file', accept: 'image/*', multiple: true }
      ],
      onSubmit: async (values) => {
        const payload = {
          title: values.title || '',
          message: values.message || '',
          stack: values.stack || undefined,
          solution: values.solution || '',
          tags: (values.tags || '').split(',').map(t => t.trim()).filter(Boolean),
        };
        try {
          const res = await fetch('/errors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          if (!res.ok) throw new Error(await res.text());
          showToast('Error creado', 'success');
          const created = await res.json(); const errorId = created.id;
          const files = values.images;
          if (files && files.length > 0) {
            const fd = new FormData(); for (let i = 0; i < files.length; i++) fd.append('images', files[i]);
            const up = await fetch('/errors/' + errorId + '/images', { method: 'POST', body: fd });
            if (!up.ok) console.error('Upload error', await up.text());
          }
          await refreshErrorsEverywhere();
          await showMessageModal('Error creado correctamente', { title: 'Nuevo error' });
        } catch (err) {
          console.error(err);
          await showMessageModal('No se pudo crear el error', { title: 'Error' });
        }
      }
    });
  }
  const createBtn = document.getElementById('error-create-toggle');
  if (createBtn) {
    applyBtn(createBtn, 'primary');
    createBtn.textContent = 'Crear error';
    createBtn.addEventListener('click', openCreateErrorModal);
  }
  if (notesErrorCreateToggle) {
    applyBtn(notesErrorCreateToggle, 'primary');
    notesErrorCreateToggle.textContent = 'Crear error';
    notesErrorCreateToggle.addEventListener('click', openCreateErrorModal);
  }

  // Abrir modal de edición
  function openEditModal(e) {
    showFormModal({
      title: 'Editar error',
      fields: [
        { id: 'title', label: 'Título', type: 'text', value: e.title || '' },
        { id: 'message', label: 'Mensaje', type: 'textarea', rows: 3, value: e.message || '' },
        { id: 'stack', label: 'Stack (opcional)', type: 'textarea', rows: 2, value: e.stack || '' },
        { id: 'solution', label: 'Solución', type: 'text', value: e.solution || '' },
        { id: 'tags', label: 'Tags (separados por coma)', type: 'text', value: Array.isArray(e.tags) ? e.tags.join(', ') : (e.tags || '') },
        { id: 'images', label: 'Imágenes (opcional)', type: 'file', accept: 'image/*', multiple: true }
      ],
      onSubmit: async (values) => {
        const payload = {
          title: (values.title || '').trim(),
          message: (values.message || '').trim(),
          stack: (values.stack || '').trim() === '' ? undefined : (values.stack || '').trim(),
          solution: (values.solution || '').trim(),
          tags: (values.tags || '').split(',').map(t => t.trim()).filter(Boolean),
        };
        try {
          const res = await fetch('/errors/' + e.id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          if (!res.ok) throw new Error(await res.text());
          const files = values.images;
          if (files && files.length > 0) {
            const fd = new FormData(); for (let i = 0; i < files.length; i++) fd.append('images', files[i]);
            const up = await fetch('/errors/' + e.id + '/images', { method: 'POST', body: fd });
            if (!up.ok) console.error('Upload error', await up.text());
          }
          await refreshErrorsEverywhere();
        } catch (err) {
          console.error(err);
          await showMessageModal('No se pudo actualizar el error', { title: 'Error' });
        }
      }
    });
  }

  // Helpers de estado y tiempo
  const STATUS_COLORS = {
    IN_PROGRESS: { bg: '#0ea5e9', text: '#f0f9ff' }, // sky-500
    PAUSED: { bg: '#f59e0b', text: '#111827' },      // amber-500
    STOPPED: { bg: '#7c2d12', text: '#fde68a' },     // amber-900
    COMPLETED: { bg: '#10b981', text: '#052e2b' }    // emerald-500
  };
  function createStatusBadge(status){
    const s = String(status || 'IN_PROGRESS');
    const cfg = STATUS_COLORS[s] || STATUS_COLORS.IN_PROGRESS;
    const el = document.createElement('span');
    const labelMap = { IN_PROGRESS: 'EN PROGRESO', PAUSED: 'PAUSADA', STOPPED: 'DETENIDA', COMPLETED: 'COMPLETADA' };
    el.textContent = labelMap[s] || s.replace('_',' ');
    el.style.display = 'inline-block'; el.style.fontSize='12px'; el.style.fontWeight='700';
    el.style.background = cfg.bg; el.style.color = cfg.text; el.style.padding='2px 8px'; el.style.borderRadius='999px'; el.style.marginLeft='8px';
    el.setAttribute('title','Estado');
    return el;
  }
  function isTaskActiveNow(t){
    if (!t || !t.startAt || !t.durationMinutes) return false;
    const start = new Date(t.startAt).getTime();
    const end = start + t.durationMinutes * 60_000;
    const now = Date.now();
    return getEffectiveTaskStatus(t) === 'IN_PROGRESS' && now >= start && now < end;
  }
  function remainingMs(t){
    const start = new Date(t.startAt).getTime();
    const end = start + (t.durationMinutes || 0) * 60_000;
    return Math.max(0, end - Date.now());
  }
  function fmtHMS(ms){
    const s = Math.floor(ms/1000); const h=Math.floor(s/3600); const m=Math.floor((s%3600)/60); const ss=s%60;
    return (h>0? String(h).padStart(2,'0')+':':'')+String(m).padStart(2,'0')+':'+String(ss).padStart(2,'0');
  }

  // Timers de tareas activas
  const taskTimers = new Map(); // id -> { el, task }
  const pendingTaskDeletes = new Map(); // id -> { timeoutId, toastEl, task, index }
  let draggedTaskId = null;
  function setupTaskTimer(t, host){
    const wrap = document.createElement('span');
    wrap.style.marginLeft = '8px'; wrap.style.fontWeight='700'; wrap.style.color='#facc15'; // yellow-400
    wrap.title = 'Tiempo restante';
    const icon = document.createElement('span'); icon.textContent = '⏱'; icon.ariaHidden = 'true'; icon.style.marginRight='4px';
    const txt = document.createElement('span');
    wrap.appendChild(icon); wrap.appendChild(txt);
    host.appendChild(wrap);
    taskTimers.set(String(t.id), { el: txt, task: t, container: wrap });
    // inicial
    txt.textContent = fmtHMS(remainingMs(t));
  }
  setInterval(() => {
    for (const [id, rec] of taskTimers.entries()){
      const { el, task, container } = rec;
      if (!el || !task) { taskTimers.delete(id); continue; }
      if (!isTaskActiveNow(task)) { container.remove(); taskTimers.delete(id); continue; }
      el.textContent = fmtHMS(remainingMs(task));
    }
    try { renderTasksStartAlert(filteredTasks); } catch {}
  }, 1000);

  function cancelPendingTaskDelete(taskId){
    const rec = pendingTaskDeletes.get(String(taskId));
    if (!rec) return false;
    clearTimeout(rec.timeoutId);
    if (rec.intervalId) clearInterval(rec.intervalId);
    try { rec.toastEl?.remove(); } catch {}
    const exists = (allTasks || []).some(t => Number(t.id) === Number(taskId));
    if (!exists) {
      const idx = Math.max(0, Math.min(rec.index ?? 0, allTasks.length));
      allTasks.splice(idx, 0, rec.task);
    }
    pendingTaskDeletes.delete(String(taskId));
    applyTaskFilters();
    if (isCalendarOpen()) renderCalendar();
    showToast('Eliminación deshecha', 'success');
    return true;
  }

  function scheduleTaskDelete(task){
    const id = String(task?.id ?? '');
    if (!id) return;
    if (pendingTaskDeletes.has(id)) return;
    const index = allTasks.findIndex(t => Number(t.id) === Number(task.id));
    if (index === -1) return;
    allTasks.splice(index, 1);
    applyTaskFilters();
    if (isCalendarOpen()) renderCalendar();

    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.left = '16px';
    toast.style.bottom = '16px';
    toast.style.zIndex = '10050';
    toast.style.background = '#0b1220';
    toast.style.border = '1px solid #334155';
    toast.style.borderRadius = '10px';
    toast.style.padding = '10px 12px';
    toast.style.boxShadow = '0 10px 24px rgba(0,0,0,0.45)';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '10px';
    const txt = document.createElement('span');
    txt.style.color = '#e5e7eb';
    txt.textContent = `Tarea eliminada: ${task.title || 'sin título'}`;
    const undoBtn = document.createElement('button');
    undoBtn.type = 'button';
    undoBtn.className = 'btn btn-primary';
    let remaining = 5;
    undoBtn.textContent = `Deshacer (${remaining}s)`;
    undoBtn.style.padding = '6px 10px';
    undoBtn.addEventListener('click', () => cancelPendingTaskDelete(task.id));
    toast.appendChild(txt);
    toast.appendChild(undoBtn);
    document.body.appendChild(toast);

    const intervalId = setInterval(() => {
      remaining -= 1;
      if (remaining >= 0) undoBtn.textContent = `Deshacer (${remaining}s)`;
    }, 1000);

    const timeoutId = setTimeout(async () => {
      pendingTaskDeletes.delete(id);
      clearInterval(intervalId);
      try { toast.remove(); } catch {}
      try {
        const res = await fetch('/tasks/' + task.id, { method: 'DELETE' });
        if (!res.ok) throw new Error(await res.text());
        showToast('Tarea eliminada definitivamente', 'success');
        await fetchTasks(true);
      } catch (err) {
        console.error(err);
        allTasks.splice(Math.max(0, Math.min(index, allTasks.length)), 0, task);
        applyTaskFilters();
        if (isCalendarOpen()) renderCalendar();
        await showMessageModal('No se pudo eliminar la tarea', { title: 'Error' });
      }
    }, 5000);

    pendingTaskDeletes.set(id, { timeoutId, intervalId, toastEl: toast, task, index });
  }

  // Tiempo y alertas
  function msToStart(t){ if (!t?.startAt) return Infinity; return new Date(t.startAt).getTime() - Date.now(); }
  function msToEnd(t){ if (!t?.startAt || !t?.durationMinutes) return Infinity; const end = new Date(t.startAt).getTime() + t.durationMinutes*60_000; return end - Date.now(); }
  function canStartEarly(t){ const ms = msToStart(t); return ms <= 60*60_000; } // 1 hora antes
  function needsStartAlert(t){ const ms = msToStart(t); return ms <= 3*60*60_000 && ms > 0; } // 3 horas antes
  function needsFinishAlert(t){ const ms = msToEnd(t); return ms <= 15*60_000 && ms > 0; } // 15 min antes
  function makeAlertBadge(kind){ const el=document.createElement('span'); el.style.display='inline-block'; el.style.padding='2px 8px'; el.style.borderRadius='999px'; el.style.fontSize='12px'; el.style.fontWeight='800'; el.style.marginLeft='8px'; if (kind==='start'){ el.textContent='⏳ inicia pronto'; el.style.background='#f59e0b'; el.style.color='#111827'; } else { el.textContent='⌛ termina pronto'; el.style.background='#ef4444'; el.style.color='#fff'; } return el; }
  function getEffectiveTaskStatus(t){
    const raw = String(t?.status || 'IN_PROGRESS');
    if (raw === 'COMPLETED' || raw === 'STOPPED' || raw === 'IN_PROGRESS') return raw;
    const startMs = t?.startAt ? new Date(t.startAt).getTime() : 0;
    if (raw === 'PAUSED' && startMs && Date.now() >= startMs) return 'STOPPED';
    return raw;
  }
  function fmtCountdown(ms){ const safe = Math.max(0, Math.floor(ms/1000)); const h = Math.floor(safe/3600); const m = Math.floor((safe%3600)/60); const s = safe%60; return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; }
  function fmtTaskDay(iso){
    if (!iso) return '';
    try {
      return capitalize(new Intl.DateTimeFormat('es-CL', { weekday:'long', day:'2-digit', month:'long' }).format(new Date(iso)));
    } catch {
      return '';
    }
  }
  function renderTasksStartAlert(tasks){
    if (!tasksStartAlertEl) return;
    const arr = Array.isArray(tasks) ? tasks : [];
    const now = Date.now();
    const next = arr
      .filter(t => t && t.startAt)
      .filter(t => {
        const st = String(t.status || '');
        if (st === 'COMPLETED' || st === 'STOPPED') return false;
        const ms = new Date(t.startAt).getTime() - now;
        return ms > 0 && ms <= 3 * 60 * 60 * 1000;
      })
      .sort((a,b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())[0];
    if (!next) { tasksStartAlertEl.style.display = 'none'; tasksStartAlertEl.textContent = ''; return; }
    const msLeft = new Date(next.startAt).getTime() - now;
    const dayTxt = fmtTaskDay(next.startAt);
    tasksStartAlertEl.style.display = 'block';
    tasksStartAlertEl.innerHTML = `La tarea <span class="censor-title">${escapeHtml(next.title || 'sin título')}</span> va a iniciar (${escapeHtml(dayTxt)}). Cronómetro a iniciar: <span class="censor-message live-start-countdown" data-start-at="${escapeHtml(next.startAt)}">${fmtCountdown(msLeft)}</span>`;
  }
  function refreshLiveStartCountdowns(){
    document.querySelectorAll('.live-start-countdown').forEach((el) => {
      const iso = el.getAttribute('data-start-at');
      if (!iso) return;
      const ms = new Date(iso).getTime() - Date.now();
      if (!Number.isFinite(ms)) return;
      el.textContent = fmtCountdown(ms);
    });
  }
  function weekdayEsShort(day){ return ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][day] || ''; }
  function repeatLabelFromDates(dates){
    const days = [...new Set(dates.map(d => d.getDay()))].sort((a,b)=>a-b);
    const isAllWeek = days.length === 7;
    const isMonFri = JSON.stringify(days) === JSON.stringify([1,2,3,4,5]);
    if (isAllWeek) return 'Todos los días';
    if (isMonFri) return 'Lunes a Viernes';
    return days.map(weekdayEsShort).join(', ');
  }
  function buildGroupedTasksForList(tasks){
    const src = Array.isArray(tasks) ? tasks : [];
    const groups = new Map();
    src.forEach((t) => {
      if (!t || !t.startAt) return;
      const d = new Date(t.startAt);
      const hhmm = `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
      const tagsKey = (Array.isArray(t.tags) ? t.tags : String(t.tags || '').split(',').map(s=>s.trim()).filter(Boolean)).join('|');
      const key = [
        String(t.title || '').trim().toLowerCase(),
        String(t.description || '').trim().toLowerCase(),
        String(t.durationMinutes || ''),
        String(getEffectiveTaskStatus(t) || ''),
        hhmm,
        tagsKey.toLowerCase(),
      ].join('::');
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(t);
    });
    const groupedIds = new Set();
    const groupByTaskId = new Map();
    groups.forEach((items) => {
      const sorted = [...items].sort((a,b)=>new Date(a.startAt)-new Date(b.startAt));
      if (sorted.length < 2) return;
      const first = new Date(sorted[0].startAt).getTime();
      const last = new Date(sorted[sorted.length - 1].startAt).getTime();
      if (last - first > 8 * 24 * 60 * 60 * 1000) return; // evitar mezclar ocurrencias lejanas
      const dates = sorted.map(x => new Date(x.startAt));
      const label = repeatLabelFromDates(dates);
      const groupObj = {
        __isGroup: true,
        id: `group-${sorted[0].id}`,
        groupCount: sorted.length,
        repeatLabel: label,
        timeLabel: `${pad2(dates[0].getHours())}:${pad2(dates[0].getMinutes())}`,
        sample: sorted[0],
        members: sorted,
        isPinned: sorted.some((x) => isPinnedTask(x.id)),
      };
      sorted.forEach(x => {
        const id = Number(x.id);
        groupedIds.add(id);
        groupByTaskId.set(id, groupObj);
      });
    });
    const out = [];
    const emittedGroups = new Set();
    src.forEach((t) => {
      const id = Number(t.id);
      if (!groupedIds.has(id)) {
        out.push(t);
        return;
      }
      const g = groupByTaskId.get(id);
      if (!g) return;
      if (emittedGroups.has(g.id)) return;
      emittedGroups.add(g.id);
      out.push(g);
    });
    return out;
  }
  function isCalendarOpen(){
    return !!(calModal && calModal.style.display === 'flex');
  }

  // Render de tareas
  function renderTasks(tasks) {
    if (!tasksListEl) return;
    tasksListEl.innerHTML = '';
    taskTimers.clear();
    const arr = Array.isArray(tasks) ? tasks : [];
    if (arr.length === 0) { tasksListEl.innerHTML = '<li>No hay tareas</li>'; return; }
    arr.forEach(t => {
      if (t && t.__isGroup) {
        const li = document.createElement('li');
        applyCard(li);
        li.style.border = '1px solid #1f2937';
        li.style.borderRadius = '10px';
        li.style.padding = '10px';
        li.style.background = 'linear-gradient(180deg,#0b1220,#0a1326)';
        li.style.boxShadow = '0 4px 14px rgba(0,0,0,0.25)';
        li.style.marginBottom = '8px';
        li.innerHTML = `
          <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;">
            <strong class="censor-title">${escapeHtml(t.sample?.title || 'Tarea repetida')}</strong>
            <div style="display:flex; gap:6px; align-items:center;">
              ${t.isPinned ? '<span style="display:inline-block; padding:2px 8px; border-radius:999px; background:#083344; color:#67e8f9; font-size:11px; font-weight:800; animation:pinnedPulse 1.2s infinite;">📌 FIJADA</span>' : ''}
              <span style="display:inline-block; padding:2px 8px; border-radius:999px; background:#1d4ed8; color:#dbeafe; font-size:12px; font-weight:800;">${t.groupCount} tareas</span>
            </div>
          </div>
          <div style="margin-top:6px; color:#cbd5e1; font-size:13px;">
            Hora: <strong>${escapeHtml(t.timeLabel)}</strong> · Repite: <strong>${escapeHtml(t.repeatLabel)}</strong> · Duración: <strong>${escapeHtml(String(t.sample?.durationMinutes || '-'))} min</strong>
          </div>
          <div style="margin-top:4px; color:#94a3b8; font-size:12px;">
            Este item agrupa tareas repetidas. Edita/elimina desde calendario o detalle individual.
          </div>
        `;
        const nextMember = (t.members || [])
          .filter((m) => needsStartAlert(m))
          .sort((a,b)=>new Date(a.startAt)-new Date(b.startAt))[0];
        if (nextMember) {
          const msLeft = msToStart(nextMember);
          const groupStartAlert = document.createElement('div');
          groupStartAlert.className = 'group-start-alert';
          groupStartAlert.style.marginTop = '6px';
          groupStartAlert.style.padding = '8px 10px';
          groupStartAlert.style.borderRadius = '8px';
          groupStartAlert.style.border = '1px solid #f59e0b';
          groupStartAlert.style.background = 'rgba(245,158,11,0.16)';
          groupStartAlert.style.color = '#fde68a';
          groupStartAlert.style.fontWeight = '700';
          groupStartAlert.style.fontSize = '12px';
          groupStartAlert.innerHTML = `Esta tarea agrupada va a iniciar el <span class="censor-message">${escapeHtml(fmtTaskDay(nextMember.startAt))}</span>. Cronómetro: <span class="censor-message live-start-countdown" data-start-at="${escapeHtml(nextMember.startAt)}">${fmtCountdown(msLeft)}</span>`;
          li.appendChild(groupStartAlert);
        }
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'btn btn-neutral';
        toggleBtn.textContent = 'Ver detalle';
        toggleBtn.style.marginTop = '8px';
        toggleBtn.style.padding = '6px 10px';
        toggleBtn.style.fontSize = '12px';
        toggleBtn.style.borderRadius = '8px';
        const details = document.createElement('div');
        details.style.display = 'none';
        details.style.marginTop = '8px';
        details.style.borderTop = '1px solid #1f2937';
        details.style.paddingTop = '8px';
        const membersSorted = [...(t.members || [])].sort((a, b) => {
          const pa = isPinnedTask(a.id) ? 1 : 0;
          const pb = isPinnedTask(b.id) ? 1 : 0;
          if (pb !== pa) return pb - pa;
          return new Date(a.startAt) - new Date(b.startAt);
        });
        membersSorted.forEach((m) => {
          const row = document.createElement('div');
          row.style.display = 'flex';
          row.style.justifyContent = 'space-between';
          row.style.alignItems = 'center';
          row.style.gap = '8px';
          row.style.padding = '6px 8px';
          row.style.border = '1px solid #1f2937';
          row.style.borderRadius = '8px';
          row.style.marginBottom = '6px';
          row.style.background = '#0b1220';
          const left = document.createElement('div');
          left.style.color = '#cbd5e1';
          left.style.fontSize = '12px';
          left.innerHTML = `<strong>${escapeHtml(formatDateTime(m.startAt))}</strong> · ${escapeHtml(String(m.durationMinutes || '-'))} min`;
          if (isPinnedTask(m.id)) {
            const pinBadge = document.createElement('span');
            pinBadge.style.display = 'inline-block';
            pinBadge.style.marginLeft = '6px';
            pinBadge.style.padding = '1px 7px';
            pinBadge.style.borderRadius = '999px';
            pinBadge.style.background = '#083344';
            pinBadge.style.color = '#67e8f9';
            pinBadge.style.fontSize = '10px';
            pinBadge.style.fontWeight = '800';
            pinBadge.style.animation = 'pinnedPulse 1.2s infinite';
            pinBadge.textContent = '📌';
            left.appendChild(pinBadge);
          }
          if (needsStartAlert(m)) {
            const badge = document.createElement('span');
            badge.style.display = 'inline-block';
            badge.style.marginLeft = '6px';
            badge.style.padding = '1px 7px';
            badge.style.borderRadius = '999px';
            badge.style.background = '#f59e0b';
            badge.style.color = '#111827';
            badge.style.fontSize = '11px';
            badge.style.fontWeight = '800';
            badge.innerHTML = `Inicia: <span class="live-start-countdown" data-start-at="${escapeHtml(m.startAt)}">${fmtCountdown(msToStart(m))}</span>`;
            left.appendChild(badge);
          }
          const edit = document.createElement('button');
          edit.type = 'button';
          edit.className = 'btn btn-primary';
          edit.textContent = '✏️';
          edit.style.padding = '2px 6px';
          edit.style.fontSize = '11px';
          edit.style.borderRadius = '6px';
          edit.addEventListener('click', () => openTaskEditModal(m));
          const del = document.createElement('button');
          del.type = 'button';
          del.className = 'btn btn-danger';
          del.textContent = '🗑️';
          del.style.padding = '2px 6px';
          del.style.fontSize = '11px';
          del.style.borderRadius = '6px';
          del.addEventListener('click', async () => {
            const ok = await showConfirm('¿Eliminar esta tarea?');
            if (!ok) return;
            scheduleTaskDelete(m);
          });
          const actions = document.createElement('div');
          actions.style.display = 'flex';
          actions.style.gap = '4px';
          const pin = document.createElement('button');
          pin.type = 'button';
          pin.className = 'btn btn-neutral';
          pin.innerHTML = getPinIconMarkup(isPinnedTask(m.id));
          pin.title = isPinnedTask(m.id) ? 'Desfijar tarea' : 'Fijar tarea';
          pin.style.padding = '2px 6px';
          pin.style.fontSize = '11px';
          pin.style.borderRadius = '6px';
          pin.addEventListener('click', () => {
            togglePinTask(m.id);
            applyTaskFilters();
          });
          actions.appendChild(pin);
          actions.appendChild(edit);
          actions.appendChild(del);
          row.appendChild(left);
          row.appendChild(actions);
          details.appendChild(row);
        });
        toggleBtn.addEventListener('click', () => {
          const open = details.style.display !== 'none';
          details.style.display = open ? 'none' : 'block';
          toggleBtn.textContent = open ? 'Ver detalle' : 'Ocultar detalle';
        });
        li.appendChild(toggleBtn);
        li.appendChild(details);
        tasksListEl.appendChild(li);
        return;
      }
      const li = document.createElement('li');
      applyCard(li);
      li.style.border = '1px solid #1f2937'; li.style.borderRadius='10px'; li.style.padding='10px'; li.style.background='#0b1220'; li.style.boxShadow='0 4px 14px rgba(0,0,0,0.25)'; li.style.marginBottom='8px';
      const startTxt = formatDateTime(t.startAt);
      const tagsTxt = Array.isArray(t.tags) ? t.tags.map(escapeHtml).join(', ') : escapeHtml(t.tags || '');
      const durTxt = t.durationMinutes ? String(t.durationMinutes) + ' min' : '-';
      const statusTxt = getEffectiveTaskStatus(t);

      const top = document.createElement('div');
      top.innerHTML = `<strong class="censor-title">${escapeHtml(t.title)}</strong>`;
      if (isPinnedTask(t.id)) {
        const pinLive = document.createElement('span');
        pinLive.textContent = '📌 FIJADA';
        pinLive.style.display = 'inline-block';
        pinLive.style.marginLeft = '8px';
        pinLive.style.padding = '2px 8px';
        pinLive.style.borderRadius = '999px';
        pinLive.style.background = '#083344';
        pinLive.style.color = '#67e8f9';
        pinLive.style.fontSize = '11px';
        pinLive.style.fontWeight = '800';
        pinLive.style.animation = 'pinnedPulse 1.2s infinite';
        top.appendChild(pinLive);
      }
      const badge = createStatusBadge(statusTxt);
      top.appendChild(badge);
      li.appendChild(top);

      const meta = document.createElement('div');
      meta.style.color = '#cbd5e1'; meta.style.fontSize='13px'; meta.style.marginTop='2px';
      meta.innerHTML = `Inicio: ${escapeHtml(startTxt)} · Duración: ${durTxt}`;
      li.appendChild(meta);

      if (t.description){ const desc=document.createElement('div'); desc.className='censor-message'; desc.style.marginTop='4px'; desc.style.color='#94a3b8'; desc.textContent=t.description; li.appendChild(desc); }
      if (tagsTxt){ const tags=document.createElement('div'); tags.style.marginTop='4px'; tags.innerHTML = `<small>Tags: <span class="censor-tags">${tagsTxt}</span></small>`; li.appendChild(tags); }

      // Alertas de inicio/fin
      if (needsStartAlert(t)) { const ab = makeAlertBadge('start'); top.appendChild(ab); }
      if (needsFinishAlert(t)) { const ab = makeAlertBadge('finish'); top.appendChild(ab); }

      // Cronómetro si está activo
      if (isTaskActiveNow(t)) setupTaskTimer(t, meta);

      // Actions
      const actions = document.createElement('div');
      actions.style.marginTop = '8px';
      const mkBtn = (label, bg, variant='neutral') => { const b=document.createElement('button'); b.textContent=label; applyBtn(b, variant); b.style.background=bg; return b; };
      const btnEdit = mkBtn('✏️ Editar', '#3b82f6', 'primary');
      const btnPause = mkBtn('Pausar', '#6b7280', 'neutral');
      const btnComplete = mkBtn('Completar', '#10b981', 'success');
      const btnReplicate = mkBtn('Agregar replicar tarea', '#6366f1', 'primary');
      const btnDelete = mkBtn('Eliminar', '#ef4444', 'danger');
      const btnPin = mkBtn('', '#0e7490', 'neutral');
      btnPin.innerHTML = getPinIconMarkup(isPinnedTask(t.id));
      btnPin.title = isPinnedTask(t.id) ? 'Desfijar tarea' : 'Fijar tarea';
      btnEdit.addEventListener('click', () => openTaskEditModal(t));
      btnPause.addEventListener('click', () => updateTaskStatus(t.id, 'pause'));
      btnComplete.addEventListener('click', () => updateTaskStatus(t.id, 'complete'));
      btnReplicate.addEventListener('click', () => replicateTask(t, statusTxt));
      btnDelete.addEventListener('click', async () => { const ok = await showConfirm('¿Eliminar esta tarea?'); if (!ok) return; scheduleTaskDelete(t); });
      btnPin.addEventListener('click', () => {
        togglePinTask(t.id);
        applyTaskFilters();
      });
      actions.appendChild(btnPin); actions.appendChild(btnEdit); actions.appendChild(btnPause); actions.appendChild(btnComplete); actions.appendChild(btnReplicate); actions.appendChild(btnDelete);

      // Lógica de habilitación: Pause
      const activeWindow = isTaskActiveNow(t);
      const isInProgress = statusTxt === 'IN_PROGRESS';

      // Si está activa con cronómetro, ocultar Pausar
      if (activeWindow) {
        btnPause.style.display = 'none'; btnPause.disabled = true; btnPause.title = 'Cronómetro activo';
      } else {
        // Pause: solo visible/habilitado cuando está en progreso pero fuera de ventana activa (no debería, pero mantenemos oculto)
        if (isInProgress) { btnPause.disabled = false; btnPause.style.opacity='1'; btnPause.style.display='inline-block'; btnPause.title='Pausar'; }
        else { btnPause.disabled = true; btnPause.style.opacity='0.4'; btnPause.style.display='none'; btnPause.title='Disponible solo en progreso'; }
      }

      li.appendChild(actions);
      tasksListEl.appendChild(li);
    });
  }

  function openTaskEditModal(t){
    showFormModal({
      title: 'Editar tarea',
      fields: [
        { id: 'title', label: 'Título', type: 'text', value: t.title || '' },
        { id: 'description', label: 'Descripción (opcional)', type: 'textarea', rows: 3, value: t.description || '' },
        { id: 'startAt', label: 'Inicio', type: 'datetime-local', value: t.startAt ? toLocalDateTimeValue(t.startAt) : '' },
        { id: 'durationMinutes', label: 'Duración (minutos)', type: 'number', value: t.durationMinutes != null ? String(t.durationMinutes) : '' },
        { id: 'tags', label: 'Tags (separados por coma)', type: 'text', value: Array.isArray(t.tags)? t.tags.join(', ') : (t.tags||'') },
        // Estado como combobox
        { id: 'status', label: 'Estado', type: 'select', value: getEffectiveTaskStatus(t) || 'IN_PROGRESS', options: [
          { label: 'En progreso', value: 'IN_PROGRESS' },
          { label: 'Pausada', value: 'PAUSED' },
          { label: 'Detenido', value: 'STOPPED' },
          { label: 'Completada', value: 'COMPLETED' }
        ] }
      ],
      onSubmit: async (values) => {
        const payload = {
          title: values.title || undefined,
          description: values.description || undefined,
          startAt: values.startAt || undefined,
          durationMinutes: values.durationMinutes? parseInt(values.durationMinutes,10): undefined,
          tags: values.tags? values.tags.split(',').map(s=>s.trim()).filter(Boolean): undefined,
          status: values.status || undefined,
        };
        try {
          const res = await fetch('/tasks/' + t.id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          if (!res.ok) throw new Error(await res.text());
          showToast('Tarea actualizada', 'success');
          await fetchTasks(true);
        } catch (err) {
          console.error(err);
          await showMessageModal('No se pudo actualizar la tarea', { title: 'Error' });
        }
      }
    });
    // Aplicar estilo de alineación a inputs del modal
    const overlay = document.getElementById('form-overlay');
    const bodyEl = overlay?.querySelector('#form-body');
    if (bodyEl) { bodyEl.querySelectorAll('input, textarea').forEach(el => { el.style.background='#0b1220'; el.style.color='#e5e7eb'; el.style.border='1px solid #334155'; el.style.borderRadius='8px'; el.style.padding='8px 10px'; }); }
  }
  function toLocalDateTimeValue(dtLike){
    const d = new Date(dtLike);
    return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  }
  function openTaskCreateModal(prefill = {}){
    showFormModal({
      title: 'Nueva tarea',
      fields: [
        { id: 'title', label: 'Título', type: 'text', value: prefill.title || '' },
        { id: 'description', label: 'Descripción (opcional)', type: 'textarea', rows: 3, value: prefill.description || '' },
        { id: 'startAt', label: 'Inicio', type: 'datetime-local', value: prefill.startAt || '' },
        { id: 'durationMinutes', label: 'Duración (minutos)', type: 'number', value: prefill.durationMinutes != null ? String(prefill.durationMinutes) : '' },
        { id: 'repeatWeek', label: 'Repetir en la semana', type: 'select', value: prefill.repeatWeek || 'NONE', options: [
          { label: 'No repetir', value: 'NONE' },
          { label: 'Lunes a Viernes', value: 'MON_FRI' },
          { label: 'Todos los días', value: 'ALL_WEEK' }
        ] },
        { id: 'tags', label: 'Tags (separados por coma)', type: 'text', value: prefill.tags || '' },
        { id: 'status', label: 'Estado', type: 'select', value: prefill.status || 'IN_PROGRESS', options: [
          { label: 'En progreso', value: 'IN_PROGRESS' },
          { label: 'Pausada', value: 'PAUSED' },
          { label: 'Detenido', value: 'STOPPED' },
          { label: 'Completada', value: 'COMPLETED' }
        ] }
      ],
      onSubmit: async (values) => {
        const durationMinutes = values.durationMinutes ? parseInt(values.durationMinutes, 10) : 30;
        const startBase = values.startAt ? new Date(values.startAt) : new Date();
        const repeatMode = values.repeatWeek || 'NONE';
        const tags = (values.tags || '').split(',').map(t => t.trim()).filter(Boolean);
        const basePayload = {
          title: values.title || '',
          description: values.description || undefined,
          durationMinutes,
          tags,
          status: values.status || undefined,
        };
        const blocks = (allTasks || [])
          .filter(t => t?.startAt)
          .map(t => {
            const s = new Date(t.startAt).getTime();
            const e = s + (Math.max(1, Number(t.durationMinutes || 30) || 30) * 60_000);
            return { start: s, end: e };
          });
        const offsets = [0];
        if (repeatMode !== 'NONE') {
          offsets.length = 0;
          for (let i = 0; i < 7; i++) {
            const d = new Date(startBase);
            d.setDate(startBase.getDate() + i);
            const wd = d.getDay(); // 0 dom ... 6 sab
            if (repeatMode === 'MON_FRI' && (wd === 0 || wd === 6)) continue;
            offsets.push(i);
          }
        }
        const candidates = offsets.map((off) => {
          const d = new Date(startBase);
          d.setDate(startBase.getDate() + off);
          return d;
        });
        const isOverlap = (startMs) => {
          const endMs = startMs + (Math.max(1, durationMinutes || 30) * 60_000);
          return blocks.some(b => startMs < b.end && endMs > b.start);
        };
        const findNextAvailableStart = (fromMs) => {
          const step = 5 * 60_000;
          const dur = Math.max(1, durationMinutes || 30) * 60_000;
          let cursor = Math.max(fromMs, Date.now() + 2 * 60_000);
          cursor = Math.ceil(cursor / step) * step;
          const limit = cursor + (14 * 24 * 60 * 60 * 1000);
          while (cursor < limit) {
            const end = cursor + dur;
            const overlap = blocks.some(b => cursor < b.end && end > b.start);
            if (!overlap) return cursor;
            cursor += step;
          }
          return null;
        };
        let created = 0;
        const skipped = [];
        const skippedConflicts = [];
        try {
          for (const dt of candidates) {
            const startMs = dt.getTime();
            if (startMs < Date.now() - 60_000) {
              skipped.push(`${toLocalDateTimeValue(dt)} (pasado)`);
              continue;
            }
            if (isOverlap(startMs)) {
              skipped.push(`${toLocalDateTimeValue(dt)} (ocupado)`);
              skippedConflicts.push(dt);
              continue;
            }
            const payload = { ...basePayload, startAt: dt.toISOString() };
            const res = await fetch('/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!res.ok) {
              skipped.push(`${toLocalDateTimeValue(dt)} (error)`);
              continue;
            }
            created += 1;
            blocks.push({ start: startMs, end: startMs + (Math.max(1, durationMinutes || 30) * 60_000) });
          }
          if (skippedConflicts.length > 0) {
            const wantReschedule = await showConfirm(`Hay ${skippedConflicts.length} tareas con conflicto de horario. ¿Quieres cambiarlas al próximo horario disponible?`, { title: 'Conflictos detectados', confirmText: 'Cambiar horario', cancelText: 'Omitir' });
            if (wantReschedule) {
              for (const dt of skippedConflicts) {
                const nextMs = findNextAvailableStart(dt.getTime());
                if (!nextMs) continue;
                const payload = { ...basePayload, startAt: new Date(nextMs).toISOString() };
                const res = await fetch('/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                if (res.ok) {
                  created += 1;
                  blocks.push({ start: nextMs, end: nextMs + (Math.max(1, durationMinutes || 30) * 60_000) });
                }
              }
            }
          }
          if (created > 0) showToast(`Tarea${created>1?'s':''} creada${created>1?'s':''}: ${created}`, 'success');
          await fetchTasks(true);
          const msg = skipped.length
            ? `Creadas: ${created}\nOmitidas por conflicto/pasado: ${skipped.length}\n${skipped.slice(0,6).join('\n')}`
            : `Creadas: ${created}`;
          await showMessageModal(msg, { title: 'Nueva tarea' });
        } catch (err) {
          console.error(err);
          await showMessageModal('No se pudo crear la tarea', { title: 'Error' });
        }
      }
    });
    const overlay = document.getElementById('form-overlay');
    const bodyEl = overlay?.querySelector('#form-body');
    if (bodyEl) { bodyEl.querySelectorAll('input, textarea').forEach(el => { el.style.background='#0b1220'; el.style.color='#e5e7eb'; el.style.border='1px solid #334155'; el.style.borderRadius='8px'; el.style.padding='8px 10px'; }); }

    const startInput = overlay?.querySelector('#startAt');
    const durationInput = overlay?.querySelector('#durationMinutes');
    const startRow = startInput?.parentElement?.parentElement;
    if (startRow && startInput && durationInput) {
      let hint = startRow.querySelector('.task-overlap-hint');
      if (!hint) {
        hint = document.createElement('div');
        hint.className = 'task-overlap-hint';
        hint.style.marginTop = '8px';
        hint.style.padding = '8px 10px';
        hint.style.borderRadius = '8px';
        hint.style.fontSize = '12px';
        hint.style.fontWeight = '700';
        startRow.appendChild(hint);
      }
      const renderOverlapHint = () => {
        const overlap = findTaskOverlap(startInput.value, parseInt(durationInput.value || '0', 10));
        if (overlap) {
          hint.textContent = `Horario ocupado por: ${overlap.title || 'Tarea'} (${formatDateTime(overlap.startAt)})`;
          hint.style.background = 'rgba(239,68,68,0.16)';
          hint.style.border = '1px solid rgba(239,68,68,0.35)';
          hint.style.color = '#fecaca';
        } else if (!startInput.value || !durationInput.value) {
          hint.textContent = 'Define inicio y duración para validar disponibilidad.';
          hint.style.background = 'rgba(59,130,246,0.12)';
          hint.style.border = '1px solid rgba(59,130,246,0.35)';
          hint.style.color = '#bfdbfe';
        } else {
          hint.textContent = 'Horario disponible.';
          hint.style.background = 'rgba(16,185,129,0.14)';
          hint.style.border = '1px solid rgba(16,185,129,0.35)';
          hint.style.color = '#a7f3d0';
        }
      };
      startInput.addEventListener('input', renderOverlapHint);
      startInput.addEventListener('change', renderOverlapHint);
      durationInput.addEventListener('input', renderOverlapHint);
      durationInput.addEventListener('change', renderOverlapHint);
      renderOverlapHint();
    }
  }

  function formatDateTime(iso){ if (!iso) return ''; try { const d=new Date(iso); return new Intl.DateTimeFormat('es-CL',{ weekday:'short', day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit', hour12:false }).format(d); } catch { return String(iso); } }
  function localDateKey(dtLike){
    const d = new Date(dtLike);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  function findTaskOverlap(startAtIso, durationMinutes, excludeTaskId){
    if (!startAtIso) return null;
    const start = new Date(startAtIso).getTime();
    const dur = Number(durationMinutes || 0);
    if (!start || Number.isNaN(start) || !dur || dur <= 0) return null;
    const end = start + dur * 60_000;
    const source = Array.isArray(allTasks) ? allTasks : [];
    return source.find((t) => {
      if (!t || !t.startAt || !t.durationMinutes) return false;
      if (excludeTaskId != null && Number(t.id) === Number(excludeTaskId)) return false;
      const tStart = new Date(t.startAt).getTime();
      const tEnd = tStart + Number(t.durationMinutes || 0) * 60_000;
      return start < tEnd && end > tStart;
    }) || null;
  }

  async function updateTaskStatus(id, action){
    try {
      const res = await fetch(`/tasks/${id}/${action}`, { method: 'PATCH' });
      if (!res.ok) throw new Error(await res.text());
      showToast('Estado de tarea actualizado', 'success');
      if (action === 'pause') {
        const rec = taskTimers.get(String(id));
        if (rec) {
          // mark as paused immediately to stop interval updates
          rec.task.status = 'PAUSED';
          if (rec.container) { try { rec.container.remove(); } catch {} }
          taskTimers.delete(String(id));
        }
      }
      await fetchTasks(true);
    } catch (err) {
      console.error(err);
      await showMessageModal('No se pudo actualizar el estado', { title: 'Error' });
    }
  }

  async function replicateTask(task, resolvedStatus){
    try {
      const findNextAvailableStartIso = (durationMinutes, fromMs) => {
        const dur = Math.max(5, Number(durationMinutes || 30) || 30) * 60_000;
        const step = 5 * 60_000;
        const tasks = (allTasks || []).filter(t => t?.startAt).map(t => {
          const s = new Date(t.startAt).getTime();
          const d = Math.max(1, Number(t.durationMinutes || 30) || 30) * 60_000;
          return { start: s, end: s + d };
        }).sort((a,b)=>a.start-b.start);
        let cursor = Math.max(Date.now() + 2 * 60_000, fromMs || 0);
        cursor = Math.ceil(cursor / step) * step;
        const limit = cursor + (30 * 24 * 60 * 60 * 1000); // buscar hasta 30 días
        while (cursor < limit) {
          const end = cursor + dur;
          const overlap = tasks.some(t => cursor < t.end && end > t.start);
          if (!overlap) return new Date(cursor).toISOString();
          cursor += step;
        }
        return new Date(Math.max(Date.now() + 2 * 60_000, fromMs || 0)).toISOString();
      };

      const nextReplicaNumber = (allTasks || [])
        .map(t => {
          const m = String(t?.title || '').match(/^Task\s*#\s*(\d+)$/i);
          return m ? Number(m[1]) : 0;
        })
        .reduce((max, n) => Math.max(max, n), 0) + 1;
      const nowSafeIso = new Date(Date.now() + 2 * 60 * 1000).toISOString();
      const originalStartMs = task?.startAt ? new Date(task.startAt).getTime() : Date.now();
      const baseFromMs = Math.max(
        Date.now() + 2 * 60 * 1000,
        originalStartMs + (Math.max(1, Number(task?.durationMinutes || 30) || 30) * 60_000), // nunca a la misma hora de la original
      );
      const nextAvailableIso = findNextAvailableStartIso(Number(task?.durationMinutes || 30) || 30, baseFromMs);
      const shouldUseNow = resolvedStatus === 'STOPPED' || (task?.startAt && new Date(task.startAt).getTime() < Date.now());
      const payload = {
        title: `Task #${nextReplicaNumber}`,
        description: task?.description || undefined,
        startAt: shouldUseNow ? findNextAvailableStartIso(Number(task?.durationMinutes || 30) || 30, Date.now() + 2 * 60 * 1000) : nextAvailableIso,
        durationMinutes: Number(task?.durationMinutes || 30) || 30,
        tags: Array.isArray(task?.tags) ? task.tags : String(task?.tags || '').split(',').map(s=>s.trim()).filter(Boolean),
        status: shouldUseNow ? 'IN_PROGRESS' : (task?.status || 'PAUSED'),
      };
      let res = await fetch('/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) {
        const txt = await res.text();
        if (txt.includes('startAt no puede estar en el pasado')) {
          payload.startAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
          res = await fetch('/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          if (!res.ok) throw new Error(await res.text());
        } else {
          throw new Error(txt);
        }
      }
      showToast('Tarea replicada', 'success');
      await fetchTasks(true);
    } catch (err) {
      console.error(err);
      await showMessageModal('No se pudo replicar la tarea', { title: 'Error' });
    }
  }

  function renderTaskFilterChips(){ const hostId='task-filter-chips'; let host=document.getElementById(hostId); if (!host){ host=document.createElement('div'); host.id=hostId; host.style.margin='6px 0 10px'; const ref=document.querySelector('#tasks-section .filters-row'); if (ref && ref.parentElement) ref.parentElement.insertBefore(host, ref.nextSibling); }
    host.innerHTML='';
    const q=(tasksSearchAnyInput?.value||'').trim(); if (q){ host.appendChild(createChip('Buscar: '+q, ()=>{ tasksSearchAnyInput.value=''; applyTaskFilters(); })); }
    const minDur=(tasksMinDurInput?.value||'').trim(); if (minDur){ host.appendChild(createChip('Min: '+minDur+' min', ()=>{ tasksMinDurInput.value=''; applyTaskFilters(); })); }
    const status=(tasksStatusSel?.value||'').trim(); if (status){ host.appendChild(createChip('Estado: '+status.replace('_',' '), ()=>{ tasksStatusSel.value=''; applyTaskFilters(); })); }
    const tags=(tasksTagFilterInput?.value||'').trim(); if (tags){ host.appendChild(createChip('Tags: '+tags, ()=>{ tasksTagFilterInput.value=''; applyTaskFilters(); })); }
    const sort=(tasksSortSel?.value||'').trim();
    if (sort && sort!=='created-desc'){
      const sortLabel = ({ status:'Estado', 'created-desc':'Creación reciente', 'start-near':'Próxima a iniciar', 'duration-desc':'Duración larga', 'duration-asc':'Duración corta' }[sort]) || sort;
      host.appendChild(createChip('Orden: '+sortLabel, ()=>{ tasksSortSel.value='created-desc'; applyTaskFilters(); }));
    }
    const from=(tasksDateFrom?.value||'').trim(); const to=(tasksDateTo?.value||'').trim();
    if (from){ host.appendChild(createChip('Desde: '+from, ()=>{ tasksDateFrom.value=''; applyTaskFilters(); })); }
    if (to){ host.appendChild(createChip('Hasta: '+to, ()=>{ tasksDateTo.value=''; applyTaskFilters(); })); }
    if (!host.childNodes.length){ const empty=document.createElement('small'); empty.style.color='#94a3b8'; empty.textContent='Sin filtros activos'; host.appendChild(empty); }
  }

  function updateNextTaskMarquee(tasks) {
    if (!nextTaskTextEl) return;
    const now = Date.now();
    const source = tasks && tasks.length ? tasks : allTasks;
    const upcoming = source
      .filter(e => e && e.startAt && new Date(e.startAt).getTime() >= now)
      .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())[0];
    if (!upcoming) { nextTaskTextEl.textContent = 'no hay próximas tareas'; return; }
    const when = formatDateTime(upcoming.startAt);
    nextTaskTextEl.textContent = `${upcoming.title} — ${when}`;
  }

  function renderWeekView(tasks) {
    if (!weekViewContainer || !weekViewEl) return;
    const isWeekActive = tasksSubtabWeekBtn?.classList.contains('active');
    weekViewContainer.classList.toggle('hidden', !isWeekActive);
    if (!isWeekActive) return;
    // Agrandar contenedor principal y permitir que el contenido quepa
    weekViewContainer.style.width = '100%';
    weekViewContainer.style.maxWidth = '100%';
    weekViewContainer.style.padding = '12px 4px';
    weekViewContainer.style.boxSizing = 'border-box';

    weekViewEl.innerHTML = '';
    const base = new Date();
    base.setHours(0,0,0,0);
    base.setDate(base.getDate() + weekCarouselOffsetDays);
    const startDate = new Date(base); startDate.setDate(base.getDate() - 2);
    const endDate = new Date(base); endDate.setDate(base.getDate() + 2);
    const days = [];
    const groups = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      days.push(d);
      groups.push([]);
    }
    const idxByDate = new Map(days.map((d, idx) => [localDateKey(d), idx]));
    (tasks || []).forEach(t => {
      if (!t.startAt) return;
      const key = localDateKey(t.startAt);
      const idx = idxByDate.get(key);
      if (idx == null) return;
      groups[idx].push(t);
    });
    if (weekCarouselRangeEl) {
      const fmt = new Intl.DateTimeFormat('es-CL', { day:'2-digit', month:'short' });
      weekCarouselRangeEl.textContent = `${fmt.format(startDate)} - ${fmt.format(endDate)}`;
    }
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    // Responsive: ajusta columnas según ancho disponible para evitar corte
    wrap.style.gridTemplateColumns = 'repeat(auto-fit, minmax(220px, 1fr))';
    wrap.style.gap = '16px';
    wrap.style.width = '100%';
    wrap.style.boxSizing = 'border-box';

    const todayMid = new Date(); todayMid.setHours(0,0,0,0);

    groups.forEach((items, i) => {
      const col = document.createElement('div');
      col.style.border = '1px solid #1f2937'; col.style.borderRadius = '12px'; col.style.padding = '12px'; col.style.background = '#0b1220'; col.style.minHeight='220px'; col.style.boxShadow='0 4px 14px rgba(0,0,0,0.25)';
      const dayDate = days[i];
      col.addEventListener('dragover', (e) => {
        e.preventDefault();
        col.style.outline = '2px solid rgba(56,189,248,0.85)';
      });
      col.addEventListener('dragleave', () => {
        col.style.outline = 'none';
      });
      col.addEventListener('drop', async (e) => {
        e.preventDefault();
        col.style.outline = 'none';
        const taskId = e.dataTransfer?.getData('text/task-id') || e.dataTransfer?.getData('text/plain') || draggedTaskId;
        if (!taskId) return;
        const result = await moveTaskToCalendarDay(taskId, dayDate);
        if (!result?.ok && result?.overlap) {
          const dayKey = localDateKey(dayDate);
          const sameDayTasks = (allTasks || []).filter((t) => t?.startAt && localDateKey(t.startAt) === dayKey);
          showAvailabilityModal(dayDate, sameDayTasks, { moveTaskId: taskId, conflictTask: result.overlap });
        }
      });
      const sorted = items.sort((a,b)=>new Date(a.startAt) - new Date(b.startAt));
      const dayMidTs = new Date(dayDate).setHours(0,0,0,0);
      const isPastDay = dayMidTs < todayMid.getTime();
      const dayName = capitalize(new Intl.DateTimeFormat('es-CL', { weekday:'short' }).format(dayDate).replace('.', ''));
      const dayNum = new Intl.DateTimeFormat('es-CL', { day:'2-digit', month:'2-digit' }).format(dayDate);
      const h = document.createElement('div'); h.textContent = `${dayName} ${dayNum}`; h.style.fontWeight = '800'; h.style.margin='2px 0 10px'; h.style.color = '#e5e7eb'; h.style.position='sticky'; h.style.top='0'; h.style.background='#0b1220'; h.style.padding='6px 4px';
      col.appendChild(h);
      const freeBtn = document.createElement('button');
      freeBtn.textContent = 'H disponibles';
      applyBtn(freeBtn, 'primary');
      freeBtn.style.marginBottom = '10px';
      if (isPastDay) {
        freeBtn.disabled = true;
        freeBtn.style.opacity = '0.5';
        freeBtn.title = 'No disponible para días pasados';
      } else {
        freeBtn.title = 'Ver horarios disponibles del día';
        freeBtn.addEventListener('click', () => showAvailabilityModal(dayDate, sorted));
      }
      col.appendChild(freeBtn);
      if (!sorted.length) {
        const empty = document.createElement('div');
        empty.textContent = 'Sin tareas';
        empty.style.color = '#64748b';
        empty.style.fontSize = '13px';
        col.appendChild(empty);
      }
      sorted.forEach(t => {
        const card = document.createElement('div');
        card.draggable = true;
        card.addEventListener('dragstart', (e) => {
          draggedTaskId = String(t.id);
          card.style.opacity = '0.55';
          if (e.dataTransfer) {
            e.dataTransfer.setData('text/task-id', String(t.id));
            e.dataTransfer.setData('text/plain', String(t.id));
            e.dataTransfer.effectAllowed = 'move';
          }
        });
        card.addEventListener('dragend', () => {
          draggedTaskId = null;
          card.style.opacity = '1';
          col.style.outline = 'none';
        });
        card.style.border='1px solid #1f2937'; card.style.borderRadius='10px'; card.style.padding='10px'; card.style.marginBottom='10px'; card.style.background='linear-gradient(180deg,#0b1220,#0a1222)';
        card.style.wordWrap = 'break-word'; card.style.whiteSpace = 'normal';
        const head = document.createElement('div'); head.style.display='flex'; head.style.justifyContent='space-between'; head.style.alignItems='flex-start'; head.style.gap='8px';
        const title = document.createElement('div'); title.innerHTML = `<strong class="censor-title">${escapeHtml(t.title)}</strong>`; title.style.wordBreak='break-word';
        const badge = createStatusBadge(getEffectiveTaskStatus(t));
        head.appendChild(title); head.appendChild(badge); card.appendChild(head);
        const info = document.createElement('div'); info.style.color='#94a3b8'; info.style.fontSize='12px'; info.textContent = `${formatDateTime(t.startAt)} · ${t.durationMinutes||'-'} min`;
        info.style.marginTop='6px';
        card.appendChild(info);
        const alertBar = document.createElement('div'); alertBar.style.marginTop='8px';
        if (needsStartAlert(t)) { const ab = makeAlertBadge('start'); alertBar.appendChild(ab); }
        if (needsFinishAlert(t)) { const ab = makeAlertBadge('finish'); alertBar.appendChild(ab); }
        if (alertBar.childNodes.length>0) card.appendChild(alertBar);

        // Acciones (Editar / Eliminar)
        const actions = document.createElement('div'); actions.style.marginTop='8px'; actions.style.display='flex'; actions.style.gap='8px';
        const btn = document.createElement('button'); btn.textContent = '✏️ Editar';
        btn.style.background = '#3b82f6'; btn.style.color = '#fff'; btn.style.border = 'none'; btn.style.borderRadius = '6px'; btn.style.padding = '6px 10px'; btn.style.cursor = 'pointer';
        const btnDelete = document.createElement('button'); btnDelete.textContent = 'Eliminar';
        btnDelete.style.background = '#ef4444'; btnDelete.style.color = '#fff'; btnDelete.style.border = 'none'; btnDelete.style.borderRadius = '6px'; btnDelete.style.padding = '6px 10px'; btnDelete.style.cursor = 'pointer';
        const isPast = t.startAt ? (new Date(t.startAt).setHours(0,0,0,0) < todayMid.getTime()) : false;
        if (isPast) { btn.disabled = true; btn.style.opacity = '0.5'; btn.title = 'No editable (tarea del pasado)'; }
        else { btn.addEventListener('click', () => openTaskEditModal(t)); btn.title = 'Editar tarea'; }
        btnDelete.addEventListener('click', async () => {
          const ok = await showConfirm('¿Eliminar esta tarea?');
          if (!ok) return;
          scheduleTaskDelete(t);
        });
        actions.appendChild(btn);
        actions.appendChild(btnDelete);
        card.appendChild(actions);

        col.appendChild(card);
      });
      wrap.appendChild(col);
    });
    weekViewEl.appendChild(wrap);
  }

  async function fetchTasks(force = false) {
    try {
      const res = await fetch('/tasks');
      if (!res.ok) throw new Error('Error al obtener tareas');
      allTasks = await res.json();
      applyTaskFilters();
      if (isCalendarOpen()) renderCalendar();
      if (!force) showTab('tasks');
      showToast('Tareas actualizadas', 'success');
    } catch (err) {
      console.error(err);
      if (tasksListEl) tasksListEl.innerHTML = '<li>Error cargando tareas</li>';
    }
  }

  // Task creation modal
  if (taskCreateToggle) {
    taskCreateToggle.addEventListener('click', () => openTaskCreateModal());
  }

  // Filters wiring
  tasksRefreshBtn?.addEventListener('click', () => { tasksMinDurInput && (tasksMinDurInput.value = ''); tasksStatusSel && (tasksStatusSel.value = ''); tasksTagFilterInput && (tasksTagFilterInput.value = ''); tasksSearchAnyInput && (tasksSearchAnyInput.value = ''); tasksSortSel && (tasksSortSel.value = 'created-desc'); tasksDateFrom && (tasksDateFrom.value = ''); tasksDateTo && (tasksDateTo.value = ''); applyTaskFilters(); });
  tasksSortSel?.addEventListener('change', applyTaskFilters);
  tasksMinDurInput?.addEventListener('input', applyTaskFilters);
  tasksStatusSel?.addEventListener('change', applyTaskFilters);
  tasksTagFilterInput?.addEventListener('input', applyTaskFilters);

  // Subtabs: list vs week
  function setTasksSubtab(which){
    const isList = which === 'list';
    tasksSubtabListBtn?.classList.toggle('active', isList);
    tasksSubtabWeekBtn?.classList.toggle('active', !isList);
    tasksListEl?.classList.toggle('hidden', !isList);
    renderWeekView(filteredTasks);
  }
  tasksSubtabListBtn?.addEventListener('click', ()=>setTasksSubtab('list'));
  tasksSubtabWeekBtn?.addEventListener('click', ()=>setTasksSubtab('week'));
  weekCarouselPrevBtn?.addEventListener('click', ()=>{
    weekCarouselOffsetDays -= 1;
    renderWeekView(filteredTasks);
  });
  weekCarouselNextBtn?.addEventListener('click', ()=>{
    weekCarouselOffsetDays += 1;
    renderWeekView(filteredTasks);
  });
  document.addEventListener('keydown', (e) => {
    const isWeekActive = tasksSubtabWeekBtn?.classList.contains('active');
    if (!isWeekActive) return;
    const tag = (document.activeElement?.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      weekCarouselOffsetDays -= 1;
      renderWeekView(filteredTasks);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      weekCarouselOffsetDays += 1;
      renderWeekView(filteredTasks);
    }
  });

  function setPaymentsSubtab(which){
    const isList = which === 'list';
    paymentsSubtabListBtn?.classList.toggle('active', isList);
    paymentsSubtabBanksBtn?.classList.toggle('active', !isList);
    paymentsSubtabListView?.classList.toggle('hidden', !isList);
    paymentsSubtabBanksView?.classList.toggle('hidden', isList);
  }
  paymentsSubtabListBtn?.addEventListener('click', ()=>setPaymentsSubtab('list'));
  paymentsSubtabBanksBtn?.addEventListener('click', ()=>setPaymentsSubtab('banks'));

  async function fetchErrorsForNotesView(){
    if (!notesErrorsListEl) return;
    notesErrorsListEl.innerHTML = '<li>Cargando errores...</li>';
    try {
      await fetchErrors();
      applyNotesErrorsFilters();
    } catch (err) {
      console.error(err);
      notesErrorsListEl.innerHTML = '<li>Error cargando errores</li>';
    }
  }
  function setNotesSubtab(which){
    const isNotes = which === 'notes';
    notesSubtabListBtn?.classList.toggle('active', isNotes);
    notesSubtabErrorsBtn?.classList.toggle('active', !isNotes);
    notesSubtabListView?.classList.toggle('hidden', !isNotes);
    notesSubtabErrorsView?.classList.toggle('hidden', isNotes);
    if (!isNotes) fetchErrorsForNotesView();
  }
  notesSubtabListBtn?.addEventListener('click', ()=>setNotesSubtab('notes'));
  notesSubtabErrorsBtn?.addEventListener('click', ()=>setNotesSubtab('errors'));

  // Toggle list button for tasks
  setupToggleList('toggle-tasks', '#tasks');
  // Toggle list for payments
  setupToggleList('toggle-payments', '#payments');
  // Toggle list for notes
  setupToggleList('toggle-notes', '#notes');

  // Calendar modal
  function openTasksCalendar(){
    if (!calModal) return;
    const now = new Date();
    calYear = now.getFullYear();
    calMonth = now.getMonth();
    renderCalendar();
    calModal.style.display = 'flex';
  }
  function closeTasksCalendar(){
    if (calModal) calModal.style.display = 'none';
    if (calTrashDrop) calTrashDrop.style.display = 'none';
    draggedTaskId = null;
  }
  function isCompactCalendarMode(){
    return (window.innerWidth || 9999) <= 600;
  }
  function showCalendarTaskQuickModal(task){
    let overlay = document.getElementById('calendar-task-quick-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'calendar-task-quick-overlay';
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.background = 'rgba(2,6,23,0.74)';
      overlay.style.backdropFilter = 'blur(3px)';
      overlay.style.display = 'none';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.zIndex = '10030';
      overlay.innerHTML = `
        <div style="width:min(460px,92vw); background:#020617; border:1px solid #0ea5e9; border-radius:12px; padding:12px; box-shadow:0 20px 50px rgba(0,0,0,.55);">
          <div id="calendar-task-quick-title" style="color:#e2e8f0; font-weight:800; margin-bottom:8px;"></div>
          <div id="calendar-task-quick-info" style="color:#cbd5e1; font-size:13px; margin-bottom:10px;"></div>
          <div style="display:flex; justify-content:flex-end; gap:8px;">
            <button id="calendar-task-quick-delete" class="btn btn-danger" type="button">Eliminar</button>
            <button id="calendar-task-quick-edit" class="btn btn-primary" type="button">Editar</button>
            <button id="calendar-task-quick-close" class="btn btn-neutral" type="button">Cerrar</button>
          </div>
        </div>`;
      document.body.appendChild(overlay);
      overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.style.display = 'none'; });
      overlay.querySelector('#calendar-task-quick-close')?.addEventListener('click', () => { overlay.style.display = 'none'; });
    }
    const titleEl = overlay.querySelector('#calendar-task-quick-title');
    const infoEl = overlay.querySelector('#calendar-task-quick-info');
    if (titleEl) titleEl.textContent = task?.title || 'Tarea';
    if (infoEl) infoEl.textContent = `${formatDateTime(task?.startAt)} · ${Number(task?.durationMinutes || 0) || 0} min`;
    overlay.querySelector('#calendar-task-quick-edit')?.addEventListener('click', () => {
      overlay.style.display = 'none';
      openTaskEditModal(task);
    }, { once: true });
    overlay.querySelector('#calendar-task-quick-delete')?.addEventListener('click', async () => {
      const ok = await showConfirm('¿Eliminar esta tarea?');
      if (!ok) return;
      overlay.style.display = 'none';
      scheduleTaskDelete(task);
    }, { once: true });
    overlay.style.display = 'flex';
  }
  function applyCalendarGridLayout(){
    const vw = window.innerWidth || 1280;
    let cellMin = 130;
    if (vw <= 480) cellMin = 92;
    else if (vw <= 768) cellMin = 104;
    else if (vw <= 1024) cellMin = 116;
    const minWidth = cellMin * 7 + 8 * 6;
    if (calWeekdays) {
      calWeekdays.style.gridTemplateColumns = `repeat(7, minmax(${cellMin}px, 1fr))`;
      calWeekdays.style.minWidth = `${minWidth}px`;
    }
    if (calGrid) {
      calGrid.style.gridTemplateColumns = `repeat(7, minmax(${cellMin}px, 1fr))`;
      calGrid.style.minWidth = `${minWidth}px`;
    }
  }
  async function moveTaskToCalendarDay(taskId, targetDate){
    const task = (allTasks || []).find(t => Number(t.id) === Number(taskId));
    if (!task || !task.startAt) return { ok: false };
    const src = new Date(task.startAt);
    const next = new Date(targetDate);
    next.setHours(src.getHours(), src.getMinutes(), 0, 0);
    const nextStart = next.getTime();
    const nextEnd = nextStart + (Math.max(1, Number(task.durationMinutes || 30) || 30) * 60_000);
    const overlap = (allTasks || []).find((t) => {
      if (!t || !t.startAt || Number(t.id) === Number(task.id)) return false;
      const s = new Date(t.startAt).getTime();
      const e = s + (Math.max(1, Number(t.durationMinutes || 30) || 30) * 60_000);
      return nextStart < e && nextEnd > s;
    });
    if (overlap) return { ok: false, overlap };
    try {
      const res = await fetch('/tasks/' + task.id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startAt: next.toISOString() }),
      });
      if (!res.ok) throw new Error(await res.text());
      showToast('Tarea movida', 'success');
      await fetchTasks(true);
      if (isCalendarOpen()) renderCalendar();
      return { ok: true };
    } catch (err) {
      console.error(err);
      await showMessageModal('No se pudo mover la tarea a ese día', { title: 'Error' });
      return { ok: false };
    }
  }
  async function moveTaskToStartIso(taskId, startAtIso){
    const task = (allTasks || []).find(t => Number(t.id) === Number(taskId));
    if (!task) return false;
    try {
      const res = await fetch('/tasks/' + task.id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startAt: new Date(startAtIso).toISOString() }),
      });
      if (!res.ok) throw new Error(await res.text());
      showToast('Tarea movida al horario seleccionado', 'success');
      await fetchTasks(true);
      if (isCalendarOpen()) renderCalendar();
      return true;
    } catch (err) {
      console.error(err);
      await showMessageModal('No se pudo mover la tarea al horario seleccionado', { title: 'Error' });
      return false;
    }
  }
  function minutesToHHmm(mins){
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${pad2(h)}:${pad2(m)}`;
  }
  function getAvailableSlotsForDay(dayDate, tasks){
    const workStart = 8 * 60;
    const workEnd = 23 * 60;
    const slotSize = 60; // bloques de 1h
    const busy = (tasks || [])
      .filter(t => t?.startAt)
      .map(t => {
        const s = new Date(t.startAt);
        const start = s.getHours() * 60 + s.getMinutes();
        const dur = Number(t.durationMinutes || 60) || 60;
        return { start, end: start + dur };
      })
      .sort((a,b)=>a.start-b.start);
    const free = [];
    for (let cursor = workStart; cursor + slotSize <= workEnd; cursor += slotSize){
      const end = cursor + slotSize;
      const overlaps = busy.some(b => cursor < b.end && end > b.start);
      if (!overlaps) free.push({ start: cursor, end });
    }
    return free;
  }
  function showAvailabilityModal(dayDate, dayTasks, opts = {}){
    const moveTaskId = opts?.moveTaskId ? Number(opts.moveTaskId) : null;
    const conflictTask = opts?.conflictTask || null;
    let overlay = document.getElementById('availability-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'availability-overlay';
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.background = 'rgba(2,6,23,0.74)';
      overlay.style.backdropFilter = 'blur(3px)';
      overlay.style.display = 'none';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.zIndex = '10007';
      overlay.innerHTML = `
        <div style="width:min(760px,92vw); max-height:86vh; overflow:auto; background:#020617; border:1px solid #0ea5e9; border-radius:14px; box-shadow:0 22px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(125,211,252,0.2) inset; padding:14px;">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:10px;">
            <strong id="availability-title" style="color:#e2e8f0;">Horarios disponibles</strong>
            <button id="availability-close" class="btn btn-danger" type="button">Cerrar</button>
          </div>
          <div id="availability-content"></div>
        </div>`;
      document.body.appendChild(overlay);
      overlay.addEventListener('click', (e)=>{ if (e.target === overlay) overlay.style.display = 'none'; });
      overlay.querySelector('#availability-close')?.addEventListener('click', ()=>{ overlay.style.display = 'none'; });
    }
    const titleEl = overlay.querySelector('#availability-title');
    const contentEl = overlay.querySelector('#availability-content');
    const dateTxt = new Intl.DateTimeFormat('es-CL', { weekday:'long', day:'2-digit', month:'long', year:'numeric' }).format(dayDate);
    if (titleEl) titleEl.textContent = `Horarios disponibles — ${capitalize(dateTxt)}`;
    const free = getAvailableSlotsForDay(dayDate, dayTasks);
    if (contentEl) {
      const dayKey = localDateKey(dayDate);
      const startOfDay = `${dayKey}T00:00`;
      const dayTasksSorted = [...(dayTasks || [])].sort((a,b)=>new Date(a.startAt)-new Date(b.startAt));
      const freeHtml = free.length
        ? free.map((s, idx) => `<button type="button" class="availability-slot-btn" data-slot-start="${dayKey}T${minutesToHHmm(s.start)}" data-slot-duration="${s.end - s.start}" style="display:inline-flex; align-items:center; justify-content:center; min-width:130px; padding:8px 10px; border-radius:999px; border:1px solid rgba(56,189,248,0.55); background:linear-gradient(135deg,rgba(14,116,144,0.26),rgba(30,64,175,0.22)); color:#e0f2fe; font-weight:700; cursor:pointer;">${minutesToHHmm(s.start)} - ${minutesToHHmm(s.end)}</button>`).join('')
        : `<div style="padding:12px; border:1px solid #7c2d12; border-radius:10px; background:rgba(127,29,29,0.2); color:#fecaca;">Sin bloques libres de 1 hora para este día.</div>`;
      const tasksHtml = dayTasksSorted.length
        ? dayTasksSorted.map((t) => `<div style="display:flex; align-items:center; justify-content:space-between; gap:10px; padding:8px 10px; border:1px solid #1f2937; border-radius:10px; background:#0b1220; margin-top:8px;">
            <div style="color:#cbd5e1; font-size:13px;">
              <strong class="censor-title">${escapeHtml(t.title || 'Tarea')}</strong><br/>
              <small style="color:#93c5fd;">${pad2(new Date(t.startAt).getHours())}:${pad2(new Date(t.startAt).getMinutes())} · ${Number(t.durationMinutes || 0) || 0} min</small>
            </div>
            <div style="display:flex; gap:6px;">
              <button type="button" class="availability-edit-btn btn btn-primary" data-task-id="${t.id}" title="Editar tarea">✏️</button>
              <button type="button" class="availability-delete-btn btn btn-danger" data-task-id="${t.id}" title="Eliminar tarea">🗑️</button>
            </div>
          </div>`).join('')
        : `<div style="padding:10px; border:1px dashed #334155; border-radius:10px; color:#94a3b8;">No hay tareas creadas este día.</div>`;
      const conflictHtml = conflictTask
        ? `<div style="margin-bottom:10px; padding:10px; border:1px solid #ef4444; border-radius:10px; background:rgba(127,29,29,0.2); color:#fecaca;">
            Conflicto de horario con: <strong>${escapeHtml(conflictTask.title || 'Tarea')}</strong> (${formatDateTime(conflictTask.startAt)})
           </div>`
        : '';
      contentEl.innerHTML = `
        ${conflictHtml}
        <div style="margin-bottom:10px;">
          <div style="color:#e2e8f0; font-weight:700; margin-bottom:8px;">${moveTaskId ? 'Selecciona horario alternativo' : 'Crear tarea inmediata'}</div>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">${freeHtml}</div>
        </div>
        <div style="margin-top:10px;">
          <div style="color:#e2e8f0; font-weight:700; margin-bottom:8px;">Tareas del día</div>
          ${tasksHtml}
          <button type="button" id="availability-create-day-btn" class="btn btn-success" style="margin-top:10px;">+ Nueva tarea este día</button>
        </div>`;
      contentEl.querySelectorAll('.availability-slot-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const startAt = btn.getAttribute('data-slot-start') || startOfDay;
          const dur = parseInt(btn.getAttribute('data-slot-duration') || '60', 10) || 60;
          if (moveTaskId) {
            const ok = await moveTaskToStartIso(moveTaskId, startAt);
            if (ok) overlay.style.display = 'none';
          } else {
            overlay.style.display = 'none';
            openTaskCreateModal({ startAt, durationMinutes: dur, status: 'IN_PROGRESS' });
          }
        });
      });
      contentEl.querySelectorAll('.availability-edit-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = Number(btn.getAttribute('data-task-id'));
          const task = (allTasks || []).find((t) => Number(t.id) === id);
          if (!task) return;
          overlay.style.display = 'none';
          openTaskEditModal(task);
        });
      });
      contentEl.querySelectorAll('.availability-delete-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const id = Number(btn.getAttribute('data-task-id'));
          const task = (allTasks || []).find((t) => Number(t.id) === id);
          if (!task) return;
          const ok = await showConfirm('¿Eliminar esta tarea?');
          if (!ok) return;
          scheduleTaskDelete(task);
          overlay.style.display = 'none';
        });
      });
      const createDayBtn = contentEl.querySelector('#availability-create-day-btn');
      if (createDayBtn) {
        if (moveTaskId) createDayBtn.style.display = 'none';
        else createDayBtn.addEventListener('click', () => {
          overlay.style.display = 'none';
          openTaskCreateModal({ startAt: startOfDay, durationMinutes: 60, status: 'IN_PROGRESS' });
        });
      }
    }
    overlay.style.display = 'flex';
  }

  function renderCalendar(){
    if (!calGrid || !calHeader) return;
    applyCalendarGridLayout();
    calGrid.innerHTML = '';
    if (calWeekdays) calWeekdays.innerHTML = '';
    const firstDay = new Date(calYear, calMonth, 1);
    const lastDay = new Date(calYear, calMonth + 1, 0);
    const monthName = new Intl.DateTimeFormat('es-CL', { month: 'long' }).format(firstDay);
    calHeader.textContent = `${capitalize(monthName)} ${calYear}`;

    const weekdays = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
    weekdays.forEach(w => {
      const h = document.createElement('div');
      h.textContent = w;
      h.style.fontWeight = '700';
      h.style.color = '#cbd5e1';
      h.style.textAlign = 'center';
      h.style.padding = '8px 4px';
      h.style.borderRadius = '8px';
      h.style.background = 'linear-gradient(180deg, #0b1220, #091126)';
      h.style.border = '1px solid #1f2937';
      h.style.boxShadow = '0 6px 14px rgba(0,0,0,0.35)';
      (calWeekdays || calGrid).appendChild(h);
    });

    const padStart = (firstDay.getDay() + 6) % 7;
    for (let i = 0; i < padStart; i++) { const cell = document.createElement('div'); cell.style.minHeight = '64px'; calGrid.appendChild(cell); }

    const today = new Date(); today.setHours(0,0,0,0);

    for (let d=1; d<=lastDay.getDate(); d++){
      const date = new Date(calYear, calMonth, d);
      const cell = document.createElement('div');
      cell.style.border = '1px solid #1f2937'; cell.style.borderRadius='8px'; cell.style.padding='6px';
      cell.style.minHeight = '110px';
      cell.style.maxHeight = '240px';
      cell.style.overflowY = 'auto';
      cell.style.overflowX = 'hidden';
      cell.dataset.dateKey = localDateKey(date);
      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.alignItems = 'center';
      header.style.justifyContent = 'space-between';
      const dayNum = document.createElement('span');
      dayNum.textContent = String(d);
      dayNum.style.fontWeight = '700';
      dayNum.style.color = '#e5e7eb';
      header.appendChild(dayNum);
      const isPast = date < today;
      if (isPast){ cell.style.background='#7c2d12'; cell.style.borderColor='#f59e0b'; }
      else { cell.style.background='#0b2a5b'; cell.style.borderColor='#3b82f6'; }

      const dayTasks = (filteredTasks.length ? filteredTasks : allTasks).filter(t => {
        if (!t.startAt) return false;
        const ts = new Date(t.startAt);
        return ts.getFullYear() === date.getFullYear() && ts.getMonth() === date.getMonth() && ts.getDate() === date.getDate();
      }).sort((a,b)=>new Date(a.startAt) - new Date(b.startAt));
      if (dayTasks.length > 0) {
        const countBadge = document.createElement('span');
        countBadge.textContent = String(dayTasks.length);
        countBadge.title = `${dayTasks.length} tarea${dayTasks.length === 1 ? '' : 's'}`;
        countBadge.style.minWidth = '22px';
        countBadge.style.height = '22px';
        countBadge.style.borderRadius = '999px';
        countBadge.style.display = 'inline-flex';
        countBadge.style.alignItems = 'center';
        countBadge.style.justifyContent = 'center';
        countBadge.style.fontSize = '12px';
        countBadge.style.fontWeight = '800';
        countBadge.style.color = '#f8fafc';
        countBadge.style.background = 'linear-gradient(135deg,#06b6d4,#2563eb)';
        countBadge.style.border = '1px solid rgba(186,230,253,0.6)';
        countBadge.style.boxShadow = '0 6px 14px rgba(2,132,199,0.35)';
        header.appendChild(countBadge);
      }
      cell.appendChild(header);
      if (!isPast) {
        const freeBtn = document.createElement('button');
        freeBtn.type = 'button';
        freeBtn.textContent = 'Horarios disponibles';
        freeBtn.className = 'btn btn-primary';
        freeBtn.style.marginTop = '6px';
        freeBtn.style.padding = '4px 8px';
        freeBtn.style.fontSize = '11px';
        freeBtn.style.borderRadius = '8px';
        freeBtn.style.width = '100%';
        freeBtn.style.background = 'linear-gradient(135deg,#06b6d4,#2563eb)';
        freeBtn.style.border = '1px solid rgba(186,230,253,0.55)';
        freeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          showAvailabilityModal(date, dayTasks);
        });
        cell.appendChild(freeBtn);
      }
      cell.addEventListener('dragover', (e) => {
        e.preventDefault();
        cell.style.outline = '2px dashed rgba(56,189,248,0.8)';
      });
      cell.addEventListener('dragleave', () => {
        cell.style.outline = 'none';
      });
      cell.addEventListener('drop', async (e) => {
        e.preventDefault();
        cell.style.outline = 'none';
        const taskId = e.dataTransfer?.getData('text/task-id') || e.dataTransfer?.getData('text/plain') || draggedTaskId;
        if (!taskId) return;
        const result = await moveTaskToCalendarDay(taskId, date);
        if (result && result.ok === false && result.overlap) {
          const conflict = result.overlap;
          const sameDayTasks = (allTasks || [])
            .filter(t => t?.startAt)
            .filter(t => {
              const ts = new Date(t.startAt);
              return ts.getFullYear() === date.getFullYear() && ts.getMonth() === date.getMonth() && ts.getDate() === date.getDate();
            })
            .sort((a,b)=>new Date(a.startAt)-new Date(b.startAt));
          showAvailabilityModal(date, sameDayTasks, { moveTaskId: taskId, conflictTask: conflict });
        }
      });

      dayTasks.forEach(t => {
        const item = document.createElement('div');
        item.className = 'card';
        item.style.marginTop='4px'; item.style.fontSize='12px'; item.style.fontWeight='600'; item.style.borderRadius='6px'; item.style.padding='4px 6px';
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.justifyContent = 'space-between';
        item.style.gap = '6px';
        item.draggable = true;
        item.style.cursor = 'grab';
        item.addEventListener('dragstart', (e) => {
          item.style.opacity = '0.65';
          draggedTaskId = String(t.id);
          if (calTrashDrop) calTrashDrop.style.display = 'block';
          if (e.dataTransfer) {
            e.dataTransfer.setData('text/task-id', String(t.id));
            e.dataTransfer.setData('text/plain', String(t.id));
            e.dataTransfer.effectAllowed = 'move';
          }
        });
        item.addEventListener('dragend', () => {
          item.style.opacity = '1';
          draggedTaskId = null;
          if (calTrashDrop) calTrashDrop.style.display = 'none';
        });
        // Color según estado
        if (String(t.status) === 'COMPLETED') {
          item.style.color = '#d1fae5';           // text: emerald-100
          item.style.background = 'rgba(16,185,129,0.22)'; // emerald-500 alpha
          item.style.border = '1px solid #10b981';
        } else if (isPast) {
          item.style.color = '#fde68a';           // text: amber-200
          item.style.background = 'rgba(245,158,11,0.18)';
          item.style.border = '1px solid rgba(245,158,11,0.35)';
        } else {
          item.style.color = '#bfdbfe';           // text: blue-200
          item.style.background = 'rgba(59,130,246,0.18)';
          item.style.border = '1px solid rgba(59,130,246,0.35)';
        }
        const left = document.createElement('div');
        const compact = isCompactCalendarMode();
        left.innerHTML = compact
          ? `${pad2(new Date(t.startAt).getHours())}:${pad2(new Date(t.startAt).getMinutes())} <small style="opacity:.9;">(${Number(t.durationMinutes || 0) || 0}m)</small>`
          : `${pad2(new Date(t.startAt).getHours())}:${pad2(new Date(t.startAt).getMinutes())} <span class="censor-title">${escapeHtml(t.title)}</span> <small style="opacity:.9;">(${Number(t.durationMinutes || 0) || 0}m)</small>`;
        left.style.minWidth = '0';
        left.style.wordBreak = 'break-word';
        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.textContent = '✏️';
        editBtn.title = 'Editar tarea';
        editBtn.className = 'btn btn-primary';
        editBtn.style.padding = '2px 6px';
        editBtn.style.fontSize = '11px';
        editBtn.style.borderRadius = '6px';
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.textContent = '🗑️';
        deleteBtn.title = 'Eliminar tarea';
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.style.padding = '2px 6px';
        deleteBtn.style.fontSize = '11px';
        deleteBtn.style.borderRadius = '6px';
        editBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openTaskEditModal(t);
        });
        deleteBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          e.stopPropagation();
          const ok = await showConfirm('¿Eliminar esta tarea?');
          if (!ok) return;
          scheduleTaskDelete(t);
        });
        const rightActions = document.createElement('div');
        rightActions.style.display = 'flex';
        rightActions.style.gap = '4px';
        rightActions.appendChild(editBtn);
        rightActions.appendChild(deleteBtn);
        item.appendChild(left);
        item.appendChild(rightActions);
        if (compact) {
          item.addEventListener('click', (e) => {
            const tag = (e.target?.tagName || '').toLowerCase();
            if (tag === 'button') return;
            showCalendarTaskQuickModal(t);
          });
        }
        cell.appendChild(item);
      });

      calGrid.appendChild(cell);
    }
  }

  function pad2(n){ return String(n).padStart(2, '0'); }
  function capitalize(s){ return (s||'').charAt(0).toUpperCase()+s.slice(1); }

  // wire buttons
  tasksCalendarBtn?.addEventListener('click', openTasksCalendar);
  tasksCalendarBtn?.addEventListener('dblclick', ()=>{ // limpiar filtro al doble click
    if (tasksMinDurInput) tasksMinDurInput.value = '';
    if (tasksStatusSel) tasksStatusSel.value = '';
    if (tasksTagFilterInput) tasksTagFilterInput.value = '';
    if (tasksSortSel) tasksSortSel.value = 'created-desc';
    if (tasksDateFrom) tasksDateFrom.value = '';
    if (tasksDateTo) tasksDateTo.value = '';
    applyTaskFilters();
  });
  calPrevBtn?.addEventListener('click', () => { if (calMonth === 0) { calMonth = 11; calYear--; } else calMonth--; renderCalendar(); });
  calNextBtn?.addEventListener('click', () => { if (calMonth === 11) { calMonth = 0; calYear++; } else calMonth++; renderCalendar(); });
  calCloseBtn?.addEventListener('click', closeTasksCalendar);
  calModal?.addEventListener('click', (e) => { if (e.target === calModal) closeTasksCalendar(); });
  if (calTrashDrop) {
    calTrashDrop.style.position = 'fixed';
    calTrashDrop.style.right = '16px';
    calTrashDrop.style.bottom = '16px';
    calTrashDrop.style.zIndex = '10020';
    calTrashDrop.style.width = 'min(360px, 86vw)';
    calTrashDrop.style.boxShadow = '0 14px 30px rgba(0,0,0,0.45)';
  }
  calTrashDrop?.addEventListener('dragover', (e) => {
    e.preventDefault();
    calTrashDrop.style.outline = '2px solid rgba(248,113,113,0.8)';
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
  });
  calTrashDrop?.addEventListener('dragleave', () => {
    calTrashDrop.style.outline = 'none';
  });
  calTrashDrop?.addEventListener('drop', async (e) => {
    e.preventDefault();
    calTrashDrop.style.outline = 'none';
    calTrashDrop.style.display = 'none';
    const taskId = e.dataTransfer?.getData('text/task-id') || e.dataTransfer?.getData('text/plain') || draggedTaskId;
    if (!taskId) return;
    const task = (allTasks || []).find((t) => String(t.id) === String(taskId));
    if (!task) return;
    const ok = await showConfirm('¿Eliminar esta tarea?');
    if (!ok) return;
    scheduleTaskDelete(task);
  });
  window.addEventListener('resize', () => {
    if (!isCalendarOpen()) return;
    applyCalendarGridLayout();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (calModal && calModal.style.display === 'flex') closeTasksCalendar();
    const avail = document.getElementById('availability-overlay');
    if (avail && avail.style.display === 'flex') avail.style.display = 'none';
  });

  // Expose for tab handler
  window.fetchTasks = fetchTasks;

  // Inicialización
  showTab('notes');

  // Actualización periódica de alertas y cronómetros
  setInterval(() => { try { applyTaskFilters(); } catch {} }, 30*1000);

  setPaymentsSubtab('list');
  setNotesSubtab('notes');
  renderBanksOverview(allPayments);

  function renderPayments(payments) {
    if (!paymentsListEl) return;
    paymentsListEl.innerHTML = '';
    const arr = Array.isArray(payments) ? payments : [];
    if (arr.length === 0) { paymentsListEl.innerHTML = '<li>No hay pagos</li>'; return; }
    arr.forEach(p => {
      const amount = typeof p.amount === 'number' ? p.amount : parseFloat(p.amount || '0');
      const amountTxt = new Intl.NumberFormat('es-CL', { style:'currency', currency:'CLP', maximumFractionDigits:0 }).format(amount || 0);
      const typeEs = TYPE_ES[p.type] || (p.type || '');
      const statusEs = STATUS_ES[p.status] || (p.status || '');
      const typeBadge = TYPE_BADGE[typeEs] || { bg:'#1f2937', fg:'#e5e7eb' };
      const statusBadge = STATUS_BADGE[statusEs] || { bg:'#1f2937', fg:'#e5e7eb' };
      const bankKey = String(p.bank || '').toUpperCase();
      const bankImg = BANK_ICON[bankKey] || '/bancos/default.png';
      const installments = p.installments != null ? Number(p.installments) : null;
      const paidInstallments = p.paidInstallments != null ? Number(p.paidInstallments) : null;
      const paidAmount = installments && paidInstallments ? Math.round((amount/Math.max(installments,1)) * paidInstallments) : null;

      const li = document.createElement('li');
      applyCard(li);
      li.style.border = '1px solid #1f2937'; li.style.borderRadius='12px'; li.style.padding='12px'; li.style.background='#0b1220'; li.style.boxShadow='0 6px 18px rgba(0,0,0,0.3)'; li.style.marginBottom='10px';

      // cabecera banco + título
      const header = document.createElement('div'); header.style.display='flex'; header.style.alignItems='center'; header.style.gap='10px'; header.style.marginBottom='8px';
      const img = document.createElement('img'); img.src = bankImg; img.alt = bankKey; img.style.width='36px'; img.style.height='36px'; img.style.objectFit='contain'; img.style.borderRadius='6px'; img.style.border='1px solid #334155';
      const title = document.createElement('div'); title.innerHTML = `<strong class="censor-title">${escapeHtml(p.title || 'Pago')}</strong>`; title.style.color='#e5e7eb';
      header.appendChild(img); header.appendChild(title);
      li.appendChild(header);

      // grid ordenado
      const grid = document.createElement('div'); grid.style.display='grid'; grid.style.gridTemplateColumns='repeat(2, minmax(160px, 1fr))'; grid.style.gap='8px 16px';
      const mkRow = (label, valueEl) => { const row=document.createElement('div'); const l=document.createElement('div'); l.textContent=label; l.style.color='#94a3b8'; l.style.fontSize='12px'; const v=document.createElement('div'); v.appendChild(valueEl); v.style.color='#e5e7eb'; v.style.fontWeight='700'; row.appendChild(l); row.appendChild(v); return row; };
      const valBank = document.createElement('span'); valBank.textContent = bankKey; valBank.className='censor-message';
      const valStatus = document.createElement('span'); valStatus.textContent = statusEs || '—'; valStatus.style.background=statusBadge.bg; valStatus.style.color=statusBadge.fg; valStatus.style.padding='2px 8px'; valStatus.style.borderRadius='999px'; valStatus.className='censor-message';
      const valAmount = document.createElement('span'); valAmount.textContent = amountTxt; valAmount.className='censor-message';
      const valType = document.createElement('span'); valType.textContent = typeEs || '—'; valType.style.background=typeBadge.bg; valType.style.color=typeBadge.fg; valType.style.padding='2px 8px'; valType.style.borderRadius='999px'; valType.className='censor-message';
      const valInstallments = document.createElement('span'); valInstallments.className='censor-message';
      if (installments) {
        const paid = (paidInstallments || 0);
        valInstallments.textContent = `${paid} de ${installments}`;
      } else { valInstallments.textContent = '—'; }
      const valPaidAmount = document.createElement('span'); valPaidAmount.textContent = (paidAmount!=null)? new Intl.NumberFormat('es-CL',{ style:'currency', currency:'CLP', maximumFractionDigits:0 }).format(paidAmount) : '—'; valPaidAmount.className='censor-message';
      grid.appendChild(mkRow('Banco:', valBank));
      grid.appendChild(mkRow('Estado del pago:', valStatus));
      grid.appendChild(mkRow('Monto total:', valAmount));
      grid.appendChild(mkRow('Tipo de pago:', valType));
      grid.appendChild(mkRow('N° Cuota:', valInstallments));
      grid.appendChild(mkRow('Monto pagado:', valPaidAmount));
      li.appendChild(grid);

      // acciones Editar/Eliminar
      const actions = document.createElement('div');
      actions.style.display='flex'; actions.style.gap='8px'; actions.style.marginTop='10px';
      const mkBtn = (label, bg, variant='neutral') => { const b=document.createElement('button'); b.textContent=label; applyBtn(b, variant); b.style.background=bg; return b; };
      const btnEdit = mkBtn('✏️ Editar', '#3b82f6', 'primary');
      const btnDelete = mkBtn('Eliminar', '#ef4444', 'danger');

      btnEdit.addEventListener('click', () => {
        showFormModal({
          title: 'Editar pago',
          fields: [
            { id: 'title', label: 'Título', type: 'text', value: p.title || '' },
            { id: 'amount', label: 'Monto (CLP $)', type: 'number', value: (typeof p.amount==='number'? p.amount : parseFloat(p.amount||'0')) || '' },
            { id: 'type', label: 'Tipo de pago', type: 'select', value: p.type || 'EXTRA_EXPENSE', options: [
              { label: 'Gasto extra', value: 'EXTRA_EXPENSE' },
              { label: 'Gasto fijo', value: 'FIXED_EXPENSE' },
              { label: 'Ingreso', value: 'INCOME' }
            ] },
            { id: 'bank', label: 'Banco', type: 'select', value: p.bank || 'FALABELLA', options: [
              { label: 'BANCO FALABELLA', value: 'FALABELLA' },
              { label: 'BANCO ESTADO', value: 'ESTADO' },
              { label: 'BANCO DE CHILE', value: 'CHILE' },
              { label: 'BANCO SANTANDER', value: 'SANTANDER' }
            ] },
            { id: 'month', label: 'Mes', type: 'month', value: p.month || '' },
            { id: 'installments', label: 'Cuotas (opcional)', type: 'number', value: p.installments != null ? String(p.installments) : '' },
            { id: 'paidInstallments', label: 'Cuota actual pagada', type: 'number', value: p.paidInstallments != null ? String(p.paidInstallments) : '' }
          ],
          onSubmit: async (values) => {
            const payload = {
              title: values.title || undefined,
              amount: values.amount ? parseFloat(values.amount) : undefined,
              type: values.type || undefined,
              bank: values.bank || undefined,
              month: values.month || undefined,
              installments: values.installments ? parseInt(values.installments,10) : undefined,
              amount: values.amount ? parseFloat(values.amount) : undefined,
              type: values.type || undefined,
              bank: values.bank || undefined,
              month: values.month || undefined,
              installments: values.installments ? parseInt(values.installments,10) : undefined,
              paidInstallments: values.paidInstallments ? parseInt(values.paidInstallments,10) : undefined,
            };
            try {
              const res = await fetch('/payments/' + p.id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
              if (!res.ok) throw new Error(await res.text());
              showToast('Pago actualizado', 'success');
              await fetchPayments();
            } catch (err) {
              console.error(err);
              await showMessageModal('No se pudo actualizar el pago', { title: 'Error' });
            }
          }
        });
      });

      btnDelete.addEventListener('click', async () => {
        const ok = await showConfirm('¿Eliminar este pago?');
        if (!ok) return;
        try {
          const res = await fetch('/payments/' + p.id, { method: 'DELETE' });
          if (!res.ok) throw new Error(await res.text());
          showToast('Pago eliminado', 'success');
          await fetchPayments();
        } catch (err) {
          console.error(err);
          await showMessageModal('No se pudo eliminar el pago', { title: 'Error' });
        }
      });

      actions.appendChild(btnEdit);
      actions.appendChild(btnDelete);
      li.appendChild(actions);

      paymentsListEl.appendChild(li);
    });
  }

  function renderBanksOverview(payments){
    if (!paymentsBanksListEl) return;
    paymentsBanksListEl.innerHTML = '';
    const profiles = normalizeBankProfilesMap(bankProfilesByBank);
    const expenseTypes = new Set(['FIXED_EXPENSE', 'EXTRA_EXPENSE']);

    BANKS_FIXED.forEach((bankKey) => {
      const profile = normalizeBankProfile(profiles[bankKey] || {});
      const bankPayments = (payments || []).filter(p => String(p.bank || '').toUpperCase() === bankKey);
      const debtTotal = bankPayments
        .filter(p => expenseTypes.has(p.type))
        .reduce((acc, p) => acc + (Number(p.amount || 0) || 0), 0);
      const paidByInstallmentsTotal = bankPayments
        .filter(p => expenseTypes.has(p.type))
        .reduce((acc, p) => {
          const amount = Number(p.amount || 0) || 0;
          const installments = Number(p.installments || 0);
          const paidInstallments = Number(p.paidInstallments || 0);
          if (installments > 0 && paidInstallments > 0) {
            return acc + Math.round((amount / installments) * paidInstallments);
          }
          if (installments <= 0 && p.status === 'PAID') return acc + amount;
          return acc;
        }, 0);
      const debtPending = Math.max(0, debtTotal - paidByInstallmentsTotal);
      const debtCreditCard = Math.max(0, Number(profile.debtCreditCard || 0));
      const debtCreditLine = Math.max(0, Number(profile.debtCreditLine || 0));
      const debtAdvance = Math.max(0, Number(profile.debtAdvance || 0));
      const debtConsumerCredit = Math.max(0, Number(profile.debtConsumerCredit || 0));
      const totalDebtInput = debtCreditCard + debtCreditLine + debtAdvance + debtConsumerCredit;
      const totalInstallments = Math.max(0, Number(profile.totalInstallments || 0));
      const paidInstallments = Math.min(totalInstallments, Math.max(0, Number(profile.paidInstallments || 0)));
      const pendingInstallments = Math.max(0, totalInstallments - paidInstallments);
      const installmentAmountFromDebt = totalInstallments > 0 ? (totalDebtInput / totalInstallments) : 0;
      const paidFromTotalDebt = totalInstallments > 0
        ? Math.min(totalDebtInput, installmentAmountFromDebt * paidInstallments)
        : 0;
      const paymentStatus = deriveBankStatus({ debtPending, paidAmount: paidByInstallmentsTotal, bankProfileStatus: profile.paymentStatus });
      let currentInstallmentLabel = 'Sin cuota pendiente';
      if (totalInstallments > 0 && pendingInstallments > 0) {
        const nextInstallment = paidInstallments + 1;
        currentInstallmentLabel = `N° ${nextInstallment} de ${totalInstallments} (${formatCLP(installmentAmountFromDebt)})`;
      }
      const bankImg = BANK_ICON[bankKey] || '/bancos/default.png';

      const card = document.createElement('article');
      applyCard(card);
      card.style.border = '1px solid #1f2937';
      card.style.borderRadius = '12px';
      card.style.padding = '12px';
      card.style.background = '#0b1220';
      card.style.boxShadow = '0 8px 22px rgba(0,0,0,0.32)';

      card.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
          <img src="${escapeHtml(bankImg)}" alt="${escapeHtml(bankKey)}" style="width:34px; height:34px; object-fit:contain; border-radius:6px; border:1px solid #334155;" />
          <strong style="color:#e5e7eb;" class="censor-title">${escapeHtml(bankKey)}</strong>
        </div>
        <div style="display:grid; grid-template-columns:repeat(2, minmax(120px, 1fr)); gap:8px 12px;">
          <div><small style="color:#94a3b8;">Cupo total línea de crédito</small><div class="censor-message" style="color:#e5e7eb; font-weight:700;">${escapeHtml(formatCLP(profile.cupoTotal))}</div></div>
          <div><small style="color:#94a3b8;">Deuda tarj. cred</small><div class="censor-message" style="color:#e5e7eb; font-weight:700;">${escapeHtml(formatCLP(debtCreditCard))}</div></div>
          <div><small style="color:#94a3b8;">Deuda lin cred</small><div class="censor-message" style="color:#e5e7eb; font-weight:700;">${escapeHtml(formatCLP(debtCreditLine))}</div></div>
          <div><small style="color:#94a3b8;">Deuda avance</small><div class="censor-message" style="color:#e5e7eb; font-weight:700;">${escapeHtml(formatCLP(debtAdvance))}</div></div>
          <div><small style="color:#94a3b8;">Deuda credito de cons</small><div class="censor-message" style="color:#e5e7eb; font-weight:700;">${escapeHtml(formatCLP(debtConsumerCredit))}</div></div>
          <div><small style="color:#94a3b8;">Deuda total</small><div class="censor-message" style="color:#e5e7eb; font-weight:700;">${escapeHtml(formatCLP(totalDebtInput))}</div></div>
          <div><small style="color:#94a3b8;">Cuotas pagadas</small><div class="censor-message" style="color:#e5e7eb; font-weight:700;">${escapeHtml(String(paidInstallments))}</div></div>
          <div><small style="color:#94a3b8;">Cuotas pendientes</small><div class="censor-message" style="color:#e5e7eb; font-weight:700;">${escapeHtml(String(pendingInstallments))}</div></div>
          <div><small style="color:#94a3b8;">Monto pagado de la deuda total</small><div class="censor-message" style="color:#e5e7eb; font-weight:700;">${escapeHtml(formatCLP(paidFromTotalDebt))}</div></div>
          <div><small style="color:#94a3b8;">Cuota actual a pagar</small><div class="censor-message" style="color:#e5e7eb; font-weight:700;">${escapeHtml(currentInstallmentLabel)}</div></div>
          <div><small style="color:#94a3b8;">Estado del pago</small><div class="censor-message" style="color:#e5e7eb; font-weight:700;">${escapeHtml(paymentStatus)}</div></div>
          <div><small style="color:#94a3b8;">Fecha de pago</small><div class="censor-message" style="color:#e5e7eb; font-weight:700;">${escapeHtml(fmtDateEs(profile.paymentDate))}</div></div>
          <div><small style="color:#94a3b8;">Fecha de factura</small><div class="censor-message" style="color:#e5e7eb; font-weight:700;">${escapeHtml(fmtDateEs(profile.statementDate))}</div></div>
        </div>
      `;

      const editBtn = document.createElement('button');
      editBtn.textContent = 'Editar';
      applyBtn(editBtn, 'primary');
      editBtn.style.marginTop = '10px';
      editBtn.addEventListener('click', () => {
        showFormModal({
          title: `Editar banco ${bankKey}`,
          fields: [
            { id: 'cupoTotal', label: 'Cupo total linea de credito (CLP $)', type: 'number', value: String(profile.cupoTotal || 0) },
            { id: 'debtCreditCard', label: 'Deuda tarj. cred (CLP $)', type: 'number', value: String(profile.debtCreditCard || 0) },
            { id: 'debtCreditLine', label: 'Deuda lin cred (CLP $)', type: 'number', value: String(profile.debtCreditLine || 0) },
            { id: 'debtAdvance', label: 'Deuda avance (CLP $)', type: 'number', value: String(profile.debtAdvance || 0) },
            { id: 'debtConsumerCredit', label: 'Deuda credito de cons (CLP $)', type: 'number', value: String(profile.debtConsumerCredit || 0) },
            { id: 'paidInstallments', label: 'Cuotas pagadas', type: 'number', value: String(profile.paidInstallments || 0) },
            { id: 'pendingInstallments', label: 'Cuotas pendientes', type: 'number', value: String(Math.max(0, (profile.totalInstallments || 0) - (profile.paidInstallments || 0))) },
            { id: 'paymentStatus', label: 'Estado del pago', type: 'select', value: paymentStatus, options: [
              { label: 'PENDIENTE', value: 'PENDIENTE' },
              { label: 'PAGANDO', value: 'PAGANDO' },
              { label: 'PAGADO', value: 'PAGADO' },
              { label: 'PAUSADO', value: 'PAUSADO' }
            ] },
            { id: 'paymentDate', label: 'Fecha de pago', type: 'date', value: profile.paymentDate || '' },
            { id: 'statementDate', label: 'Fecha de factura', type: 'date', value: profile.statementDate || '' }
          ],
          onSubmit: async (values) => {
            const paidInstallmentsValue = Math.max(0, parseInt(values.paidInstallments || '0', 10) || 0);
            const pendingInstallmentsValue = Math.max(0, parseInt(values.pendingInstallments || '0', 10) || 0);
            const payload = {
              totalLimit: Number(values.cupoTotal || 0) || 0,
              debtCreditCard: Number(values.debtCreditCard || 0) || 0,
              debtCreditLine: Number(values.debtCreditLine || 0) || 0,
              debtAdvance: Number(values.debtAdvance || 0) || 0,
              debtConsumerCredit: Number(values.debtConsumerCredit || 0) || 0,
              totalInstallments: paidInstallmentsValue + pendingInstallmentsValue,
              paidInstallments: paidInstallmentsValue,
              paymentStatus: values.paymentStatus || null,
              paymentDate: values.paymentDate || null,
              statementDate: values.statementDate || null,
            };
            const res = await fetch('/bank-accounts/' + bankKey, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(await res.text());
            const updated = await res.json();
            bankProfilesByBank[bankKey] = normalizeBankProfile(updated);
            renderBanksOverview(allPayments);
            showToast(`Banco ${bankKey} actualizado`, 'success');
          }
        });
      });
      card.appendChild(editBtn);
      paymentsBanksListEl.appendChild(card);
    });
  }

  function renderPaymentsSummary(payments){
    const fixedEl = document.getElementById('legend-fixed');
    const extraEl = document.getElementById('legend-extra');
    const incomeEl = document.getElementById('legend-income');
    const totalEl = document.getElementById('legend-total');
    const balanceEl = document.getElementById('legend-balance');
    const sum = { FIXED_EXPENSE:0, EXTRA_EXPENSE:0, INCOME:0 };
    (payments || []).forEach(p => { const amt = typeof p.amount==='number'? p.amount : parseFloat(p.amount||'0'); if (p.type in sum) sum[p.type]+= (amt||0); });
    const fmt = v => new Intl.NumberFormat('es-CL',{ style:'currency', currency:'CLP', maximumFractionDigits:0 }).format(v||0);
    if (fixedEl) fixedEl.textContent = fmt(sum.FIXED_EXPENSE);
    if (extraEl) extraEl.textContent = fmt(sum.EXTRA_EXPENSE);
    if (incomeEl) incomeEl.textContent = fmt(sum.INCOME);
    if (totalEl) totalEl.textContent = fmt(sum.FIXED_EXPENSE + sum.EXTRA_EXPENSE);
    if (balanceEl) balanceEl.textContent = fmt(sum.INCOME - (sum.FIXED_EXPENSE + sum.EXTRA_EXPENSE));

    // Line chart Gastos vs Ingresos
    const ctx = document.getElementById('payments-pie');
    if (!ctx || typeof Chart === 'undefined') return;
    // Agrupar por mes (YYYY-MM)
    const byMonth = new Map();
    const src = Array.isArray(allPayments) && allPayments.length ? allPayments : (payments || []);
    src.forEach(p => {
      const m = String(p.month || '').trim();
      const key = m || new Date().toISOString().slice(0,7);
      if (!byMonth.has(key)) byMonth.set(key, { FIXED_EXPENSE:0, EXTRA_EXPENSE:0, INCOME:0 });
      const amt = typeof p.amount==='number'? p.amount : parseFloat(p.amount||'0');
      const bucket = byMonth.get(key);
      if (p.type === 'FIXED_EXPENSE') bucket.FIXED_EXPENSE += (amt||0);
      else if (p.type === 'EXTRA_EXPENSE') bucket.EXTRA_EXPENSE += (amt||0);
      else if (p.type === 'INCOME') bucket.INCOME += (amt||0);
    });
    if (byMonth.size === 0) {
      const key = new Date().toISOString().slice(0,7);
      byMonth.set(key, { FIXED_EXPENSE:0, EXTRA_EXPENSE:0, INCOME:0 });
    }
    const labels = Array.from(byMonth.keys()).sort();
    const fixedData = labels.map(m => byMonth.get(m).FIXED_EXPENSE);
    const extraData = labels.map(m => byMonth.get(m).EXTRA_EXPENSE);
    const incomeData = labels.map(m => byMonth.get(m).INCOME);

    const data = {
      labels,
      datasets: [
        { label: 'Gasto fijo', data: fixedData, borderColor: '#ef4444', backgroundColor:'rgba(239,68,68,0.18)', pointRadius: 2, tension:0.35 },
        { label: 'Gasto extra', data: extraData, borderColor: '#f59e0b', backgroundColor:'rgba(245,158,11,0.18)', pointRadius: 2, tension:0.35 },
        { label: 'Ingresos', data: incomeData, borderColor: '#10b981', backgroundColor:'rgba(16,185,129,0.18)', pointRadius: 2, tension:0.35 }
      ]
    };
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: { ticks: { color:'#cbd5e1' }, grid: { color:'rgba(148,163,184,0.12)' } },
        y: { ticks: { color:'#cbd5e1' }, grid: { color:'rgba(148,163,184,0.12)' } }
      },
      plugins: { legend: { position:'bottom', labels: { color:'#e5e7eb' } }, title: { display:false }, tooltip: { enabled: true } }
    };
    if (paymentsChart) { paymentsChart.data = data; paymentsChart.options = options; paymentsChart.config.type = 'line'; paymentsChart.update(); }
    else { paymentsChart = new Chart(ctx.getContext('2d'), { type: 'line', data, options }); }
  }

  function applyPaymentsFilters(){
    const q = (paymentsSearchAnyInput?.value || '').trim().toLowerCase();
    const bank = paymentsBankSel?.value || '';
    const type = paymentsTypeSel?.value || '';
    const status = paymentsStatusSel?.value || '';
    const month = paymentsMonthInput?.value || '';
    const from = paymentsDateFrom?.value || '';
    const to = paymentsDateTo?.value || '';
    filteredPayments = allPayments.filter(p => {
      if (q) {
        const haystack = [
          p?.id,
          p?.title,
          p?.bank,
          p?.type,
          p?.status,
          p?.month,
          p?.amount,
          p?.createdAt,
          p?.updatedAt,
          p?.installments,
          p?.paidInstallments,
        ].map(v => String(v || '').toLowerCase()).join(' ');
        if (!haystack.includes(q)) return false;
      }
      if (bank && p.bank !== bank) return false;
      if (type && p.type !== type) return false;
      if (status && p.status !== status) return false;
      if (month && p.month !== month) return false;
      // Rango de fechas: asume p.createdAt ISO
      if (from){ const f = new Date(from + 'T00:00:00'); const pc = new Date(p.createdAt || p.month + '-01'); if (pc < f) return false; }
      if (to){ const t = new Date(to + 'T23:59:59'); const pc = new Date(p.createdAt || p.month + '-01'); if (pc > t) return false; }
      return true;
    });
    // Reiniciar página si filtros cambian
    paymentsPage = 1;
    renderPaymentsPage();
    renderPaymentsSummary(filteredPayments);
    renderBanksOverview(allPayments);
    renderPaymentFilterChips();
  }

  function renderPaymentsPage(){
    const size = paymentsPageSize;
    const total = filteredPayments.length;
    const pages = Math.max(1, Math.ceil(total / size));
    paymentsPage = Math.min(Math.max(1, paymentsPage), pages);
    const start = (paymentsPage - 1) * size;
    const slice = filteredPayments.slice(start, start + size);
    renderPayments(slice);
    if (paymentsPageInfo) paymentsPageInfo.textContent = `Página ${paymentsPage} de ${pages} · ${total} ítems`;
    if (paymentsPagePrev) paymentsPagePrev.disabled = paymentsPage <= 1;
    if (paymentsPageNext) paymentsPageNext.disabled = paymentsPage >= pages;
  }

  function renderPaymentFilterChips(){ const hostId='payments-filter-chips'; let host=document.getElementById(hostId); if (!host){ host=document.createElement('div'); host.id=hostId; host.style.margin='6px 0 10px'; const ref=document.querySelector('#payments-section .filters-row'); if (ref && ref.parentElement) ref.parentElement.insertBefore(host, ref.nextSibling); }
    host.innerHTML='';
    const q=(paymentsSearchAnyInput?.value||'').trim(); if (q){ host.appendChild(createChip('Buscar: '+q, ()=>{ paymentsSearchAnyInput.value=''; applyPaymentsFilters(); })); }
    const bank=(paymentsBankSel?.value||'').trim(); if (bank){ host.appendChild(createChip('Banco: '+bank, ()=>{ paymentsBankSel.value=''; applyPaymentsFilters(); })); }
    const type=(paymentsTypeSel?.value||'').trim(); if (type){ host.appendChild(createChip('Tipo: '+type, ()=>{ paymentsTypeSel.value=''; applyPaymentsFilters(); })); }
    const status=(paymentsStatusSel?.value||'').trim(); if (status){ host.appendChild(createChip('Estado: '+status, ()=>{ paymentsStatusSel.value=''; applyPaymentsFilters(); })); }
    const month=(paymentsMonthInput?.value||'').trim(); if (month){ host.appendChild(createChip('Mes: '+month, ()=>{ paymentsMonthInput.value=''; applyPaymentsFilters(); })); }
    const from=(paymentsDateFrom?.value||'').trim(); const to=(paymentsDateTo?.value||'').trim();
    if (from){ host.appendChild(createChip('Desde: '+from, ()=>{ paymentsDateFrom.value=''; applyPaymentsFilters(); })); }
    if (to){ host.appendChild(createChip('Hasta: '+to, ()=>{ paymentsDateTo.value=''; applyPaymentsFilters(); })); }
    if (!host.childNodes.length){ const empty=document.createElement('small'); empty.style.color='#94a3b8'; empty.textContent='Sin filtros activos'; host.appendChild(empty); }
  }

  async function fetchPayments(){
    try {
      const [paymentsRes] = await Promise.all([
        fetch('/payments'),
        fetchBankProfiles({ silent: true }),
      ]);
      if (!paymentsRes.ok) throw new Error('Error al obtener pagos');
      allPayments = await paymentsRes.json();
      applyPaymentsFilters();
      showToast('Pagos actualizados', 'success');
    } catch (err) {
      console.error(err);
      if (paymentsListEl) paymentsListEl.innerHTML = '<li>Error cargando pagos</li>';
    }
  }

  // Wire filters
  paymentsRefreshBtn?.addEventListener('click', ()=>{ paymentsBankSel && (paymentsBankSel.value=''); paymentsTypeSel && (paymentsTypeSel.value=''); paymentsStatusSel && (paymentsStatusSel.value=''); paymentsMonthInput && (paymentsMonthInput.value=''); paymentsSearchAnyInput && (paymentsSearchAnyInput.value=''); applyPaymentsFilters(); });
  paymentsBankSel?.addEventListener('change', applyPaymentsFilters);
  paymentsTypeSel?.addEventListener('change', applyPaymentsFilters);
  paymentsStatusSel?.addEventListener('change', applyPaymentsFilters);
  paymentsMonthInput?.addEventListener('change', applyPaymentsFilters);
  paymentsDateFrom?.addEventListener('change', applyPaymentsFilters);
  paymentsDateTo?.addEventListener('change', applyPaymentsFilters);
  paymentsDateClear?.addEventListener('click', ()=>{ if (paymentsDateFrom) paymentsDateFrom.value=''; if (paymentsDateTo) paymentsDateTo.value=''; applyPaymentsFilters(); });
  paymentsPagePrev?.addEventListener('click', ()=>{ paymentsPage = Math.max(1, paymentsPage - 1); renderPaymentsPage(); });
  paymentsPageNext?.addEventListener('click', ()=>{ paymentsPage = paymentsPage + 1; renderPaymentsPage(); });
  paymentsPageSizeSel?.addEventListener('change', ()=>{ paymentsPageSize = parseInt(paymentsPageSizeSel.value || '10', 10) || 10; paymentsPage = 1; renderPaymentsPage(); });
  paymentsSearchAnyInput?.addEventListener('input', applyPaymentsFilters);

  // Month picker buttons
  paymentsMonthBtn?.addEventListener('click', ()=>{ paymentsMonthInput?.focus(); });

  // Clear month filter
  const paymentsMonthClear = document.getElementById('payments-month-clear');
  paymentsMonthClear?.addEventListener('click', ()=>{ if (paymentsMonthInput) { paymentsMonthInput.value=''; applyPaymentsFilters(); } });

  // Create payment modal
  if (paymentCreateToggle) {
    paymentCreateToggle.addEventListener('click', () => {
      showFormModal({
        title: 'Nuevo pago',
        fields: [
          { id: 'title', label: 'Título', type: 'text', value: '' },
          { id: 'amount', label: 'Monto (CLP $)', type: 'number', value: '' },
          // Combo Tipo en español
          { id: 'type', label: 'Tipo de pago', type: 'select', value: 'EXTRA_EXPENSE', options: [
            { label: 'Gasto extra', value: 'EXTRA_EXPENSE' },
            { label: 'Gasto fijo', value: 'FIXED_EXPENSE' },
            { label: 'Ingreso', value: 'INCOME' }
          ] },
          // Combo Banco en español
          { id: 'bank', label: 'Banco', type: 'select', value: 'FALABELLA', options: [
            { label: 'BANCO FALABELLA', value: 'FALABELLA' },
            { label: 'BANCO ESTADO', value: 'ESTADO' },
            { label: 'BANCO DE CHILE', value: 'CHILE' },
            { label: 'BANCO SANTANDER', value: 'SANTANDER' }
          ] },
          { id: 'month', label: 'Mes', type: 'month', value: '' },
          { id: 'installments', label: 'Cuotas (opcional)', type: 'number', value: '' },
          { id: 'paidInstallments', label: 'Cuota actual pagada', type: 'number', value: '' }
        ],
        onSubmit: async (values) => {
          const payload = {
            title: values.title || '',
            amount: values.amount ? parseFloat(values.amount) : 0,
            type: values.type || 'EXTRA_EXPENSE',
            bank: values.bank || 'FALABELLA',
            month: values.month || undefined,
            installments: values.installments ? parseInt(values.installments,10) : undefined,
            paidInstallments: values.paidInstallments ? parseInt(values.paidInstallments,10) : undefined,
          };
          try {
            const res = await fetch('/payments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!res.ok) throw new Error(await res.text());
            showToast('Pago creado', 'success');
            await fetchPayments();
            await showMessageModal('Pago creado correctamente', { title: 'Nuevo pago' });
          } catch (err) {
            console.error(err);
            await showMessageModal('No se pudo crear el pago', { title: 'Error' });
          }
        }
      });
      // Estilizar inputs y calendario del modal
      const overlay = document.getElementById('form-overlay');
      const bodyEl = overlay?.querySelector('#form-body');
      if (bodyEl) { bodyEl.querySelectorAll('input, textarea').forEach(el => { el.style.background='#0b1220'; el.style.color='#e5e7eb'; el.style.border='1px solid #334155'; el.style.borderRadius='8px'; el.style.padding='8px 10px'; }); }
    });
  }
  // Expose payments fetch
  window.fetchPayments = fetchPayments;

  // Estilo para el filtro de mes en Payments
  (function stylePaymentsMonthFilter(){
    const wrapId = 'payments-month-wrap';
    let wrap = document.getElementById(wrapId);
    if (!wrap && paymentsMonthInput) {
      // Crear contenedor estilizado
      wrap = document.createElement('span');
      wrap.id = wrapId;
      wrap.style.display = 'inline-flex';
      wrap.style.alignItems = 'center';
      wrap.style.gap = '8px';
      wrap.style.background = 'linear-gradient(135deg, rgba(14,116,144,0.22), rgba(30,64,175,0.16) 45%, rgba(11,18,32,0.98) 100%)';
      wrap.style.border = '1px solid #0ea5e9';
      wrap.style.borderRadius = '12px';
      wrap.style.padding = '7px 9px';
      wrap.style.boxShadow = '0 8px 22px rgba(2,132,199,0.25), 0 0 0 1px rgba(125,211,252,0.25) inset';
      // Insertar antes del input y mover elementos dentro
      const parent = paymentsMonthInput.parentElement;
      if (parent) {
        parent.insertBefore(wrap, paymentsMonthInput);
        wrap.appendChild(paymentsMonthInput);
        // Estilos del input
        paymentsMonthInput.style.background = 'rgba(2,6,23,0.55)';
        paymentsMonthInput.style.color = '#f0f9ff';
        paymentsMonthInput.style.border = 'none';
        paymentsMonthInput.style.outline = 'none';
        paymentsMonthInput.style.padding = '8px 10px';
        paymentsMonthInput.style.borderRadius = '9px';
        paymentsMonthInput.style.fontWeight = '700';
        paymentsMonthInput.style.minWidth = '130px';
        paymentsMonthInput.addEventListener('focus', ()=>{ wrap.style.transform='translateY(-1px)'; wrap.style.boxShadow='0 10px 24px rgba(2,132,199,0.35), 0 0 0 1px rgba(125,211,252,0.35) inset'; });
        paymentsMonthInput.addEventListener('blur', ()=>{ wrap.style.transform='none'; wrap.style.boxShadow='0 8px 22px rgba(2,132,199,0.25), 0 0 0 1px rgba(125,211,252,0.25) inset'; });
        // Botón 📅 estilizado
        if (paymentsMonthBtn) {
          paymentsMonthBtn.style.background = 'linear-gradient(135deg,#06b6d4,#3b82f6)';
          paymentsMonthBtn.style.color = '#fff';
          paymentsMonthBtn.style.border = '1px solid rgba(186,230,253,0.55)';
          paymentsMonthBtn.style.borderRadius = '10px';
          paymentsMonthBtn.style.padding = '8px 10px';
          paymentsMonthBtn.style.cursor = 'pointer';
          paymentsMonthBtn.style.boxShadow = '0 8px 16px rgba(37,99,235,0.35)';
          wrap.appendChild(paymentsMonthBtn);
        }
        // Botón limpiar dentro del wrap si existe
        const paymentsMonthClear = document.getElementById('payments-month-clear');
        if (paymentsMonthClear) {
          paymentsMonthClear.style.background = '#6b7280';
          paymentsMonthClear.style.color = '#fff';
          paymentsMonthClear.style.border = 'none';
          paymentsMonthClear.style.borderRadius = '8px';
          paymentsMonthClear.style.padding = '6px 8px';
          paymentsMonthClear.style.cursor = 'pointer';
          wrap.appendChild(paymentsMonthClear);
        }
      }
    }
  })();

  // Chips helpers
  function createChip(label, onRemove){ const chip=document.createElement('span'); chip.style.display='inline-flex'; chip.style.alignItems='center'; chip.style.gap='6px'; chip.style.padding='4px 8px'; chip.style.borderRadius='999px'; chip.style.border='1px solid #334155'; chip.style.background='#0b1220'; chip.style.color='#e5e7eb'; chip.style.fontSize='12px'; chip.style.marginRight='6px'; const txt=document.createElement('span'); txt.textContent=label; const x=document.createElement('button'); x.textContent='✕'; x.className='btn btn-neutral'; x.style.padding='2px 6px'; x.style.fontSize='11px'; x.style.lineHeight='1'; x.addEventListener('click', (e)=>{ e.preventDefault(); onRemove && onRemove(); chip.remove(); }); chip.appendChild(txt); chip.appendChild(x); return chip; }

  // Select searchable helper: inject an input to filter options
  function makeSelectSearchable(selectEl){ if (!selectEl) return; const wrap=document.createElement('div'); wrap.style.display='inline-flex'; wrap.style.flexDirection='column'; wrap.style.gap='6px'; const search=document.createElement('input'); applyInput(search); search.placeholder='Buscar...'; search.style.maxWidth='180px'; const parent=selectEl.parentElement; if (parent){ parent.insertBefore(wrap, selectEl); wrap.appendChild(search); wrap.appendChild(selectEl); }
    const original=[...selectEl.options].map(o=>({v:o.value,l:o.textContent}));
    search.addEventListener('input', ()=>{ const q=search.value.toLowerCase(); selectEl.innerHTML=''; original.filter(o=>o.l.toLowerCase().includes(q) || o.v.toLowerCase().includes(q)).forEach(o=>{ const opt=document.createElement('option'); opt.value=o.v; opt.textContent=o.l; selectEl.appendChild(opt); }); });
  }

  // Enhance filters selects
  makeSelectSearchable(tasksStatusSel);
  makeSelectSearchable(paymentsBankSel);
  makeSelectSearchable(paymentsTypeSel);
  makeSelectSearchable(paymentsStatusSel);
  wireStaticFlatpickrInputs();
  enforceInputLimits();

  // Toast utility
  function showToast(message, kind = 'neutral', timeout = 2500){
    try {
      let host = document.getElementById('toast-host');
      if (!host) {
        host = document.createElement('div');
        host.id = 'toast-host';
        host.style.position = 'fixed';
        host.style.right = '16px';
        host.style.bottom = '16px';
        host.style.zIndex = '10060';
        host.style.display = 'flex';
        host.style.flexDirection = 'column';
        host.style.alignItems = 'flex-end';
        host.style.gap = '8px';
        host.style.pointerEvents = 'none';
        document.body.appendChild(host);
      }
      const t = document.createElement('div');
      t.className = 'toast';
      t.style.position = 'relative';
      t.style.right = 'auto';
      t.style.bottom = 'auto';
      t.style.pointerEvents = 'auto';
      t.style.background = kind==='success'? '#052e2b' : kind==='danger'? '#320e12' : '#0a0f1e';
      t.style.borderColor = kind==='success'? '#10b981' : kind==='danger'? '#ef4444' : '#1f2937';
      t.textContent = message;
      host.appendChild(t);
      setTimeout(()=>{
        t.style.opacity = '0';
        t.style.transition = 'opacity 200ms ease';
        setTimeout(()=>{ try { t.remove(); } catch {} }, 220);
      }, timeout);
    } catch {}
  }

  // Notas: estado y elementos
  (function(){
    const notesSection = document.getElementById('notes-section');
    const notesListEl2 = document.getElementById('notes');
    const noteCreateToggle2 = document.getElementById('note-create-toggle');
    const noteCreateForm = document.getElementById('note-create-form');
    const notesCensorToggle2 = document.getElementById('notes-censor-toggle');
    const toggleNotesBtn2 = document.getElementById('toggle-notes');
    const notesPagePrev2 = document.getElementById('notes-page-prev');
    const notesPageNext2 = document.getElementById('notes-page-next');
    const notesPageInfo2 = document.getElementById('notes-page-info');
    const notesPageSizeSel2 = document.getElementById('notes-page-size');
    const notesSearchAnyInput2 = document.getElementById('notes-search-any');
    let allNotes2 = [];
    let notesPage2 = 1;
    let notesPageSize2 = 10;

    /**
     * @typedef {Object} Note
     * @property {number} id
     * @property {string} title
     * @property {string} content
     * @property {string[]} tags
     * @property {string} createdAt
     * @property {string} language
     */

    function loadNotes(){
      try { const raw = localStorage.getItem('quick_notes_v1'); allNotes2 = raw ? JSON.parse(raw) : []; }
      catch { allNotes2 = []; }
      renderNotesPage();
    }
    function saveNotes(){ localStorage.setItem('quick_notes_v1', JSON.stringify(allNotes2)); }
    function getFilteredNotes(){
      const q = String(notesSearchAnyInput2?.value || '').trim().toLowerCase();
      if (!q) return allNotes2;
      return allNotes2.filter((n) => {
        const haystack = [
          n?.id,
          n?.title,
          n?.content,
          n?.language,
          Array.isArray(n?.tags) ? n.tags.join(' ') : String(n?.tags || ''),
          n?.createdAt,
        ].map(v => String(v || '').toLowerCase()).join(' ');
        return haystack.includes(q);
      });
    }
    function renderNotesPage(){
      const filtered = getFilteredNotes();
      const total = filtered.length; const pages = Math.max(1, Math.ceil(total / notesPageSize2));
      notesPage2 = Math.min(Math.max(1, notesPage2), pages);
      const start = (notesPage2 - 1) * notesPageSize2;
      const slice = filtered.slice(start, start + notesPageSize2);
      renderNotes(slice);
      if (notesPageInfo2) notesPageInfo2.textContent = `Página ${notesPage2} de ${pages} · ${total} ítems`;
      if (notesPagePrev2) notesPagePrev2.disabled = notesPage2 <= 1;
      if (notesPageNext2) notesPageNext2.disabled = notesPage2 >= pages;
    }

    // Utilidad para escapar HTML
    function escapeHtml(str){
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    // Resaltado simple de sintaxis JS/TS usando regex (sin dependencias)
    function highlightJs(raw, langHint){
      if (!raw) return '';
      let code = String(raw).trim();
      // Detectar valla ```lang\n...\n```
      let fenceLang = null;
      const fenceMatch = code.match(/^```(js|javascript|ts|typescript)?\n([\s\S]*?)\n```$/i);
      if (fenceMatch) { fenceLang = fenceMatch[1] ? fenceMatch[1].toLowerCase() : null; code = fenceMatch[2]; }
      const lang = (fenceLang || langHint || 'javascript').toLowerCase();

      // Placeholder-based tokenizer to avoid re-processing inside injected HTML
      const placeholders = [];
      const PH = (i) => `@@TOKEN${i}@@`;
      function protect(re, className){
        code = code.replace(re, (m) => {
          const idx = placeholders.push(`<span class="${className}">${escapeHtml(m)}</span>`) - 1;
          return PH(idx);
        });
      }

      // Order matters: comments, strings, numbers, TS types, keywords, literals, punctuation
      // Comments
      protect(/\/\*[\s\S]*?\*\//g, 'tok-cmt');
      protect(/\/\/[^\n]*/g, 'tok-cmt');
      // Strings (incl. template literals)
      protect(/`[^`]*`/g, 'tok-str');
      protect(/"[^"\n]*"|'[^'\n]*'/g, 'tok-str');
      // Numbers
      protect(/\b(0x[0-9a-fA-F]+|\d+\.\d+|\d+)\b/g, 'tok-num');
      // TypeScript-specific (if applicable)
      if (lang.startsWith('ts')){
        protect(/\b(interface|type|enum|implements|private|public|protected|readonly|declare|namespace|abstract)\b/g, 'tok-kw');
        protect(/(:\s*[A-Za-z_][A-Za-z0-9_<>?,\s]*)/g, 'tok-type');
        protect(/\b([A-Z][A-Za-z0-9_]*)\b/g, 'tok-type');
      } else {
        // PascalCase identifiers (commonly classes/types)
        protect(/\b([A-Z][A-Za-z0-9_]*)\b/g, 'tok-type');
      }
      // Keywords
      protect(/\b(const|let|var|function|return|if|else|for|while|switch|case|break|continue|try|catch|finally|new|class|extends|super|import|from|export|default|async|await|typeof|instanceof|void|delete|in|of|yield)\b/g, 'tok-kw');
      // Literals
      protect(/\b(true|false|null|undefined|NaN|Infinity)\b/g, 'tok-lit');
      // Punctuation
      protect(/([{}()[\];,.])/g, 'tok-punc');

      // Escape remaining text, then restore placeholders to HTML spans
      let safe = escapeHtml(code);
      safe = safe.replace(/@@TOKEN(\d+)@@/g, (_, n) => placeholders[Number(n)] || '');

      const style = `
        .tok-kw{ color:#93c5fd; }
        .tok-lit{ color:#fca5a5; }
        .tok-type{ color:#c4b5fd; }
        .tok-punc{ color:#94a3b8; }
        .tok-str{ color:#86efac; }
        .tok-cmt{ color:#64748b; font-style:italic; }
        .tok-num{ color:#fcd34d; }
      `;
      if (!document.getElementById('inline-code-theme')){ const styleEl = document.createElement('style'); styleEl.id = 'inline-code-theme'; styleEl.textContent = style; document.head.appendChild(styleEl); }
      return `<pre style="background:#0b1220; color:#e5e7eb; padding:12px; border:1px solid #334155; border-radius:8px; overflow:auto;"><code>${safe}</code></pre>`;
    }

    function renderNotes(items){
      if (!notesListEl2) return;
      if (!items || items.length === 0){ notesListEl2.innerHTML = '<li style="color:#94a3b8;">Sin notas</li>'; return; }
      notesListEl2.innerHTML = items.map(n => {
        const tags = Array.isArray(n.tags) ? n.tags.join(', ') : (n.tags || '');
        const ts = n.createdAt ? new Date(n.createdAt).toLocaleString() : '';
        const hasFence = typeof n.content === 'string' && /^```/.test(n.content.trim());
        const langPref = (n.language || '').toLowerCase();
        const contentHtml = hasFence ? highlightJs(n.content, langPref) : (langPref === 'javascript' || langPref === 'typescript') ? highlightJs(n.content, langPref) : `<div class="censor-message" style="color:#cbd5e1; margin-top:4px; white-space:pre-wrap;">${escapeHtml(n.content || '')}</div>`;
        return `<li class="card-item" data-id="${n.id}">`+
               `<div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">`+
               `<strong class="censor-title">${escapeHtml(n.title || '')}</strong>`+
               `<small style="color:#94a3b8;">${ts}</small>`+
               `</div>`+
               `${contentHtml}`+
               `<div class="censor-tags" style="color:#94a3b8; margin-top:6px;">Tags: ${escapeHtml(tags)}</div>`+
               `<div style="display:flex; gap:8px; margin-top:8px;">`+
               `<button class="btn btn-primary" data-action="edit">Editar</button>`+
               `<button class="btn btn-danger" data-action="delete">Eliminar</button>`+
               `</div>`+
               `</li>`;
      }).join('');
    }

    // Handlers notas
    noteCreateToggle2?.addEventListener('click', ()=>{
      // Abrir modal estilado para crear nota
      showFormModal({
        title: 'Nueva nota',
        fields: [
          { id: 'title', label: 'Título', type: 'text', value: '' },
          { id: 'content', label: 'Contenido', type: 'textarea', rows: 6, value: '' },
          { id: 'language', label: 'Lenguaje', type: 'select', value: '', options: [
            { label: 'Texto plano', value: '' },
            { label: 'JavaScript', value: 'javascript' },
            { label: 'TypeScript', value: 'typescript' }
          ] },
          { id: 'tags', label: 'Tags (separados por coma)', type: 'text', value: '' }
        ],
        onSubmit: async (values) => {
          const title = String(values.title || '').trim();
          const content = String(values.content || '').trim();
          const tagsRaw = String(values.tags || '').trim();
          const language = String(values.language || '').trim();
          if (!title || !content) { await showMessageModal('Título y contenido son obligatorios', { title: 'Validación' }); return; }
          const note = {
            id: Date.now(),
            title,
            content,
            language, // '' | 'javascript' | 'typescript'
            tags: tagsRaw ? tagsRaw.split(',').map(s=>s.trim()).filter(Boolean) : [],
            createdAt: new Date().toISOString()
          };
          allNotes2.unshift(note);
          saveNotes();
          notesPage2 = 1;
          renderNotesPage();
          showToast('Nota creada', 'success');
        }
      });
      // Estilizar inputs del modal
      const overlay = document.getElementById('form-overlay');
      const bodyEl = overlay?.querySelector('#form-body');
      if (bodyEl) { bodyEl.querySelectorAll('input, textarea, select').forEach(el => { el.style.background='#0b1220'; el.style.color='#e5e7eb'; el.style.border='1px solid #334155'; el.style.borderRadius='8px'; el.style.padding='8px 10px'; }); }
    });
    // El formulario embebido ya no se usa; asegurar que esté oculto si existe
    if (noteCreateForm) noteCreateForm.style.display = 'none';
    // Remover submit del formulario embebido para evitar duplicados
    if (noteCreateForm) {
      noteCreateForm.replaceWith(noteCreateForm); // no-op para conservar estructura sin listeners
    }
    notesListEl2?.addEventListener('click', (e)=>{
      const btn = e.target.closest('button'); if (!btn) return; const li = btn.closest('li[data-id]'); if (!li) return; const id = Number(li.getAttribute('data-id'));
      const action = btn.getAttribute('data-action');
      if (action === 'delete'){
        allNotes2 = allNotes2.filter(n => n.id !== id); saveNotes(); renderNotesPage();
      } else if (action === 'edit') {
        const note = allNotes2.find(n => n.id === id); if (!note) return;
        showFormModal({
          title: 'Editar nota',
          fields: [
            { id: 'title', label: 'Título', type: 'text', value: note.title || '' },
            { id: 'content', label: 'Contenido', type: 'textarea', rows: 6, value: note.content || '' },
            { id: 'language', label: 'Lenguaje', type: 'select', value: (note.language || ''), options: [
              { label: 'Texto plano', value: '' },
              { label: 'JavaScript', value: 'javascript' },
              { label: 'TypeScript', value: 'typescript' }
            ] },
            { id: 'tags', label: 'Tags (separados por coma)', type: 'text', value: Array.isArray(note.tags) ? note.tags.join(', ') : (note.tags || '') }
          ],
          onSubmit: async (values) => {
            const title = String(values.title || '').trim();
            const content = String(values.content || '').trim();
            const tagsRaw = String(values.tags || '').trim();
            const language = String(values.language || '').trim();
            if (!title || !content) { await showMessageModal('Título y contenido son obligatorios', { title: 'Validación' }); return; }
            const idx = allNotes2.findIndex(n => n.id === id); if (idx === -1) return;
            const updated = { ...allNotes2[idx], title, content, language, tags: tagsRaw ? tagsRaw.split(',').map(s=>s.trim()).filter(Boolean) : [] };
            allNotes2[idx] = updated;
            saveNotes();
            renderNotesPage();
            showToast('Nota actualizada', 'success');
          }
        });
        const overlay = document.getElementById('form-overlay');
        const bodyEl = overlay?.querySelector('#form-body');
        if (bodyEl) { bodyEl.querySelectorAll('input, textarea, select').forEach(el => { el.style.background='#0b1220'; el.style.color='#e5e7eb'; el.style.border='1px solid #334155'; el.style.borderRadius='8px'; el.style.padding='8px 10px'; }); }
      }
    });
    notesCensorToggle2?.addEventListener('click', ()=>{
      if (!notesSection) return; const on = notesSection.classList.toggle('censored'); notesCensorToggle2.textContent = `Modo P: ${on ? 'ON' : 'OFF'}`;
    });
    toggleNotesBtn2?.addEventListener('click', ()=>{
      if (!notesListEl2) return; const collapsed = notesListEl2.classList.toggle('collapsed'); toggleNotesBtn2.textContent = collapsed ? 'Expandir' : 'Contraer';
    });
    notesPagePrev2?.addEventListener('click', ()=>{ notesPage2 = Math.max(1, notesPage2 - 1); renderNotesPage(); });
    notesPageNext2?.addEventListener('click', ()=>{ notesPage2 = notesPage2 + 1; renderNotesPage(); });
    notesPageSizeSel2?.addEventListener('change', ()=>{ notesPageSize2 = parseInt(notesPageSizeSel2.value || '10', 10) || 10; notesPage2 = 1; renderNotesPage(); });
    notesSearchAnyInput2?.addEventListener('input', ()=>{ notesPage2 = 1; renderNotesPage(); });

    // Exponer para navegación por pestañas
    window.fetchNotes = loadNotes;

    // Inicializar
    loadNotes();
  })();
});
