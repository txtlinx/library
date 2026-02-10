document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('errors');
  const ipEl = document.getElementById('ip');
  const timeLocalEl = document.getElementById('time-local');
  const timeSantiagoEl = document.getElementById('time-santiago');
  const nextTaskTextEl = document.getElementById('next-task-text');
  const tasksListEl = document.getElementById('tasks');
  const tasksRefreshBtn = document.getElementById('tasks-refresh');
  const tasksSortSel = document.getElementById('tasks-sort');
  const tasksMinDurInput = document.getElementById('tasks-min-duration');
  const tasksStatusSel = document.getElementById('tasks-status-filter');
  const tasksTagFilterInput = document.getElementById('tasks-tag-filter');
  const taskCreateToggle = document.getElementById('task-create-toggle');
  const weekViewContainer = document.getElementById('week-view-container');
  const weekViewEl = document.getElementById('week-view');
  const tasksSubtabListBtn = document.getElementById('tasks-subtab-list');
  const tasksSubtabWeekBtn = document.getElementById('tasks-subtab-week');
  const tasksCalendarBtn = document.getElementById('tasks-calendar-btn');
  const calModal = document.getElementById('tasks-calendar-modal');
  const calPrevBtn = document.getElementById('cal-prev');
  const calNextBtn = document.getElementById('cal-next');
  const calCloseBtn = document.getElementById('cal-close');
  const calHeader = document.getElementById('cal-header');
  const calGrid = document.getElementById('cal-grid');
  const paymentsListEl = document.getElementById('payments');
  const paymentCreateToggle = document.getElementById('payment-create-toggle');
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

  // Notes selectors
  const notesListEl = document.getElementById('notes');
  const noteCreateToggle = document.getElementById('note-create-toggle');
  const notesPagePrev = document.getElementById('notes-page-prev');
  const notesPageNext = document.getElementById('notes-page-next');
  const notesPageInfo = document.getElementById('notes-page-info');
  const notesPageSizeSel = document.getElementById('notes-page-size');

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
  let calYear, calMonth; // 0-based month
  let allPayments = [];
  let filteredPayments = [];
  let paymentsChart = null;

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
  const TYPE_BADGE = {
    'Gasto extra': { bg:'#7c3aed', fg:'#e9d5ff' },
    'Gasto fijo': { bg:'#7c2d12', fg:'#fde68a' },
    'Ingreso': { bg:'#065f46', fg:'#d1fae5' }
  };

  function applyBtn(el, variant='primary'){ if (!el) return; el.classList.add('btn'); if (variant) el.classList.add('btn-'+variant); }
  function applyInput(el){ if (!el) return; el.classList.add('input'); }
  function applyCard(el){ if (!el) return; el.classList.add('card'); }

  async function fetchIP() {
    if (!ipEl) return;
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      if (!res.ok) throw new Error('no response');
      const data = await res.json();
      ipEl.textContent = data.ip || 'no disponible';
    } catch (err) {
      console.error('fetchIP error', err);
      ipEl.textContent = 'no disponible';
    }
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
  fetchIP(); updateClocks(); setInterval(updateClocks, 1000);

  async function fetchErrors() {
    try { const res = await fetch('/errors'); if (!res.ok) throw new Error('Error al obtener errores'); allErrors = await res.json(); applyErrorsFilters(); }
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

  // Modal de formulario (crear/editar)
  function ensureFormModal() {
    let overlay = document.getElementById('form-overlay');
    if (!overlay) {
      overlay = document.createElement('div'); overlay.id = 'form-overlay';
      overlay.style.position='fixed'; overlay.style.inset='0'; overlay.style.background='rgba(15,23,42,0.75)'; overlay.style.backdropFilter='blur(4px)';
      overlay.style.display='flex'; overlay.style.alignItems='center'; overlay.style.justifyContent='center'; overlay.style.zIndex='10003';
      overlay.style.visibility='hidden'; overlay.style.opacity='0'; overlay.style.transition='opacity 0.15s ease-out, visibility 0.15s ease-out';
      overlay.innerHTML = `
        <div class="form-modal" role="dialog" aria-modal="true" aria-labelledby="form-title" style="background:#020617;border:1px solid #1f2937;border-radius:12px;max-width:520px;width:92%;padding:16px;box-shadow:0 20px 60px rgba(0,0,0,0.7);max-height:90vh;overflow:auto;">
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
          wrap.style.background='#0b1220'; wrap.style.border='1px solid #334155'; wrap.style.borderRadius='10px'; wrap.style.padding='8px'; wrap.style.boxShadow='0 6px 18px rgba(0,0,0,0.3)';
          input=document.createElement('input'); input.type='datetime-local'; input.id=f.id; input.value=f.value||'';
          input.style.flex='1'; input.style.background='#0b1220'; input.style.color='#e5e7eb'; input.style.border='none'; input.style.outline='none'; input.style.padding='8px 10px'; input.style.borderRadius='8px';
          const btn=document.createElement('button'); btn.type='button'; btn.textContent='📅'; btn.title='Abrir calendario'; btn.style.background='#3b82f6'; btn.style.color='#fff'; btn.style.border='none'; btn.style.borderRadius='8px'; btn.style.padding='8px 10px'; btn.style.cursor='pointer'; btn.style.boxShadow='0 4px 12px rgba(0,0,0,0.25)';
          btn.addEventListener('click', ()=>{ try { if (typeof input.showPicker === 'function') input.showPicker(); else input.focus(); } catch { input.focus(); } });
          wrap.appendChild(input); wrap.appendChild(btn); row.appendChild(wrap);
        } else if (f.type==='month'){
          const wrap = document.createElement('div');
          wrap.style.display='flex'; wrap.style.alignItems='center'; wrap.style.gap='8px';
          wrap.style.background='#0b1220'; wrap.style.border='1px solid #334155'; wrap.style.borderRadius='10px'; wrap.style.padding='8px'; wrap.style.boxShadow='0 6px 18px rgba(0,0,0,0.3)';
          input=document.createElement('input'); input.type='month'; input.id=f.id; input.value=f.value||'';
          input.style.flex='1'; input.style.background='#0b1220'; input.style.color='#e5e7eb'; input.style.border='none'; input.style.outline='none'; input.style.padding='8px 10px'; input.style.borderRadius='8px';
          const btn=document.createElement('button'); btn.type='button'; btn.textContent='📅'; btn.title='Abrir calendario'; btn.style.background='#3b82f6'; btn.style.color='#fff'; btn.style.border='none'; btn.style.borderRadius='8px'; btn.style.padding='8px 10px'; btn.style.cursor='pointer'; btn.style.boxShadow='0 4px 12px rgba(0,0,0,0.25)';
          btn.addEventListener('click', ()=>{ try { if (typeof input.showPicker === 'function') input.showPicker(); else input.focus(); } catch { input.focus(); } });
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
    }
    function cleanup(){ overlay.style.opacity='0'; overlay.style.visibility='hidden'; btnCancel.removeEventListener('click', onCancel); btnSubmit.removeEventListener('click', onSubmitClick); btnClose.removeEventListener('click', onCancel); overlay.removeEventListener('click', onOverlayClick); document.removeEventListener('keydown', onKey); }
    function onCancel(e){ e.preventDefault(); cleanup(); }
    function onOverlayClick(e){ if (e.target===overlay) onCancel(e); }
    function onKey(e){ if (e.key==='Escape') onCancel(e); }
    async function onSubmitClick(e){ e.preventDefault(); const values={}; fields.forEach(f=>{ const el=overlay.querySelector('#'+f.id); if (!el) return; if (f.type==='file'){ values[f.id]=el.files; } else { values[f.id]=(el.value||'').trim(); } }); cleanup(); try { await onSubmit(values); } catch (err) { console.error('form submit error', err); await showMessageModal('No se pudo enviar el formulario', { title: 'Error' }); } }
    btnCancel.addEventListener('click', onCancel); btnSubmit.addEventListener('click', onSubmitClick); btnClose.addEventListener('click', onCancel); overlay.addEventListener('click', onOverlayClick); document.addEventListener('keydown', onKey);
    overlay.style.visibility='visible'; overlay.style.opacity='1'; setTimeout(()=>{ try { btnSubmit.focus(); } catch {} },0);
  }

  // Render de errores
  function renderErrors(errors) {
    if (!listEl) return;
    listEl.innerHTML = '';
    if (!errors || errors.length === 0) { listEl.innerHTML = '<li>No hay errores</li>'; return; }
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
      btnDelete.addEventListener('click', async ()=>{ const confirmed = await showConfirm('¿Eliminar este error?'); if (!confirmed) return; try { const res = await fetch('/errors/'+e.id,{method:'DELETE'}); if (!res.ok) throw new Error(await res.text()||'Error eliminando'); await fetchErrors(); } catch (err) { console.error(err); await showMessageModal('No se pudo eliminar el error', { title: 'Error' }); } });
      li.appendChild(viewDiv); li.appendChild(btnUpdate); if (btnToggle) li.appendChild(btnToggle); li.appendChild(btnDelete); if (thumbs) li.appendChild(thumbs);
      listEl.appendChild(li);
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
  tabButtons.forEach(btn=>{ btn.addEventListener('click',()=>{ const tab=btn.getAttribute('data-tab'); if (!tab) return; showTab(tab); if (tab==='errors') fetchErrors(); if (tab==='tasks') { if (typeof fetchTasks === 'function') fetchTasks(); } if (tab==='payments') { if (typeof fetchPayments === 'function') fetchPayments(); } if (tab==='notes') { if (typeof fetchNotes === 'function') fetchNotes(); } }); });
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
    const q = ''; // se retiró input de búsqueda superior
    const minDur = parseInt(tasksMinDurInput?.value || '0', 10) || 0;
    const status = tasksStatusSel?.value || '';
    const tagFilter = (tasksTagFilterInput?.value || '').trim().toLowerCase();
    const sort = tasksSortSel?.value || 'all';
    const from = tasksDateFrom?.value || '';
    const to = tasksDateTo?.value || '';
    filteredTasks = allTasks.filter(t => {
      // min duration
      if (minDur > 0 && (t.durationMinutes || 0) < minDur) return false;
      // status
      if (status && t.status !== status) return false;
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
    if (sort === 'start-desc') filteredTasks.sort((a,b)=>byDate(b,a,'startAt'));
    else if (sort === 'start-asc') filteredTasks.sort((a,b)=>byDate(a,b,'startAt'));
    else if (sort === 'created-desc') filteredTasks.sort((a,b)=>byDate(b,a,'createdAt'));
    else if (sort === 'created-asc') filteredTasks.sort((a,b)=>byDate(a,b,'createdAt'));

    tasksPage = 1;
    renderTasksPage();
    updateNextTaskMarquee(filteredTasks);
    renderWeekView(filteredTasks);
    renderTaskFilterChips();
  }
  function renderTasksPage(){
    const total = filteredTasks.length; const pages = Math.max(1, Math.ceil(total / tasksPageSize));
    tasksPage = Math.min(Math.max(1, tasksPage), pages);
    const start = (tasksPage - 1) * tasksPageSize;
    const slice = filteredTasks.slice(start, start + tasksPageSize);
    renderTasks(slice);
    if (tasksPageInfo) tasksPageInfo.textContent = `Página ${tasksPage} de ${pages} · ${total} ítems`;
    if (tasksPagePrev) tasksPagePrev.disabled = tasksPage <= 1;
    if (tasksPageNext) tasksPageNext.disabled = tasksPage >= pages;
  }
  tasksPagePrev?.addEventListener('click', ()=>{ tasksPage = Math.max(1, tasksPage - 1); renderTasksPage(); });
  tasksPageNext?.addEventListener('click', ()=>{ tasksPage = tasksPage + 1; renderTasksPage(); });
  tasksPageSizeSel?.addEventListener('change', ()=>{ tasksPageSize = parseInt(tasksPageSizeSel.value || '10', 10) || 10; tasksPage = 1; renderTasksPage(); });
  tasksDateFrom?.addEventListener('change', applyTaskFilters);
  tasksDateTo?.addEventListener('change', applyTaskFilters);
  tasksDateClear?.addEventListener('click', ()=>{ if (tasksDateFrom) tasksDateFrom.value=''; if (tasksDateTo) tasksDateTo.value=''; applyTaskFilters(); });

  // Botón Crear error -> modal
  const createBtn = document.getElementById('error-create-toggle');
  if (createBtn) {
    applyBtn(createBtn, 'primary');
    createBtn.textContent = 'Crear error';
    createBtn.addEventListener('click', () => {
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
            await fetchErrors();
            await showMessageModal('Error creado correctamente', { title: 'Nuevo error' });
          } catch (err) {
            console.error(err);
            await showMessageModal('No se pudo crear el error', { title: 'Error' });
          }
        }
      });
    });
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
          await fetchErrors();
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
    COMPLETED: { bg: '#10b981', text: '#052e2b' }    // emerald-500
  };
  function createStatusBadge(status){
    const s = String(status || 'IN_PROGRESS');
    const cfg = STATUS_COLORS[s] || STATUS_COLORS.IN_PROGRESS;
    const el = document.createElement('span');
    el.textContent = s.replace('_',' ');
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
    return t.status === 'IN_PROGRESS' && now >= start && now < end;
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
  }, 1000);

  // Tiempo y alertas
  function msToStart(t){ if (!t?.startAt) return Infinity; return new Date(t.startAt).getTime() - Date.now(); }
  function msToEnd(t){ if (!t?.startAt || !t?.durationMinutes) return Infinity; const end = new Date(t.startAt).getTime() + t.durationMinutes*60_000; return end - Date.now(); }
  function canStartEarly(t){ const ms = msToStart(t); return ms <= 60*60_000; } // 1 hora antes
  function needsStartAlert(t){ const ms = msToStart(t); return ms <= 30*60_000 && ms > 0; } // 30 min antes
  function needsFinishAlert(t){ const ms = msToEnd(t); return ms <= 15*60_000 && ms > 0; } // 15 min antes
  function makeAlertBadge(kind){ const el=document.createElement('span'); el.style.display='inline-block'; el.style.padding='2px 8px'; el.style.borderRadius='999px'; el.style.fontSize='12px'; el.style.fontWeight='800'; el.style.marginLeft='8px'; if (kind==='start'){ el.textContent='⏳ inicia pronto'; el.style.background='#f59e0b'; el.style.color='#111827'; } else { el.textContent='⌛ termina pronto'; el.style.background='#ef4444'; el.style.color='#fff'; } return el; }

  // Render de tareas
  function renderTasks(tasks) {
    if (!tasksListEl) return;
    tasksListEl.innerHTML = '';
    taskTimers.clear();
    const arr = Array.isArray(tasks) ? tasks : [];
    if (arr.length === 0) { tasksListEl.innerHTML = '<li>No hay tareas</li>'; return; }
    arr.forEach(t => {
      const li = document.createElement('li');
      applyCard(li);
      li.style.border = '1px solid #1f2937'; li.style.borderRadius='10px'; li.style.padding='10px'; li.style.background='#0b1220'; li.style.boxShadow='0 4px 14px rgba(0,0,0,0.25)'; li.style.marginBottom='8px';
      const startTxt = formatDateTime(t.startAt);
      const tagsTxt = Array.isArray(t.tags) ? t.tags.map(escapeHtml).join(', ') : escapeHtml(t.tags || '');
      const durTxt = t.durationMinutes ? String(t.durationMinutes) + ' min' : '-';
      const statusTxt = String(t.status || 'IN_PROGRESS');

      const top = document.createElement('div');
      top.innerHTML = `<strong class="censor-title">${escapeHtml(t.title)}</strong>`;
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
      const btnStart = mkBtn('Reanudar', '#06b6d4', 'primary');
      const btnComplete = mkBtn('Completar', '#10b981', 'success');
      const btnDelete = mkBtn('Eliminar', '#ef4444', 'danger');
      btnEdit.addEventListener('click', () => openTaskEditModal(t));
      btnPause.addEventListener('click', () => updateTaskStatus(t.id, 'pause'));
      btnStart.addEventListener('click', () => updateTaskStatus(t.id, 'start'));
      btnComplete.addEventListener('click', () => updateTaskStatus(t.id, 'complete'));
      btnDelete.addEventListener('click', async () => { const ok = await showConfirm('¿Eliminar esta tarea?'); if (!ok) return; try { const res = await fetch('/tasks/' + t.id, { method: 'DELETE' }); if (!res.ok) throw new Error(await res.text()); showToast('Tarea eliminada', 'success'); await fetchTasks(true); } catch (err) { console.error(err); await showMessageModal('No se pudo eliminar la tarea', { title: 'Error' }); } });
      actions.appendChild(btnEdit); actions.appendChild(btnPause); actions.appendChild(btnStart); actions.appendChild(btnComplete); actions.appendChild(btnDelete);

      // Lógica de habilitación: Start y Pause
      const activeWindow = isTaskActiveNow(t);
      const isInProgress = t.status === 'IN_PROGRESS';

      // Si está activa con cronómetro, ocultar ambos: Pausar y Reanudar
      if (activeWindow) {
        btnPause.style.display = 'none'; btnPause.disabled = true; btnPause.title = 'Cronómetro activo';
        btnStart.style.display = 'none'; btnStart.disabled = true; btnStart.title = 'Cronómetro activo';
      } else {
        // Start: permitido si está PAUSED o IN_PROGRESS, o hasta 1h antes de iniciar y no COMPLETED
        if (canStartEarly(t) && t.status !== 'COMPLETED') { btnStart.disabled = false; btnStart.style.opacity='1'; btnStart.style.display='inline-block'; btnStart.title='Puedes iniciar/reanudar hasta 1 hora antes'; }
        else if (t.status === 'PAUSED' || t.status === 'IN_PROGRESS') { btnStart.disabled = false; btnStart.style.opacity='1'; btnStart.style.display='inline-block'; }
        else { btnStart.disabled = true; btnStart.style.opacity='0.6'; btnStart.style.display='inline-block'; btnStart.title='No disponible'; }
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
        { id: 'startAt', label: 'Inicio', type: 'datetime-local', value: t.startAt ? new Date(t.startAt).toISOString().slice(0,16) : '' },
        { id: 'durationMinutes', label: 'Duración (minutos)', type: 'number', value: t.durationMinutes != null ? String(t.durationMinutes) : '' },
        { id: 'tags', label: 'Tags (separados por coma)', type: 'text', value: Array.isArray(t.tags)? t.tags.join(', ') : (t.tags||'') },
        // Estado como combobox
        { id: 'status', label: 'Estado', type: 'select', value: t.status || 'IN_PROGRESS', options: [
          { label: 'En progreso', value: 'IN_PROGRESS' },
          { label: 'Pausada', value: 'PAUSED' },
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

  function formatDateTime(iso){ if (!iso) return ''; try { const d=new Date(iso); return new Intl.DateTimeFormat('es-CL',{ weekday:'short', day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit', hour12:false }).format(d); } catch { return String(iso); } }

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

  function renderTaskFilterChips(){ const hostId='task-filter-chips'; let host=document.getElementById(hostId); if (!host){ host=document.createElement('div'); host.id=hostId; host.style.margin='6px 0 10px'; const ref=document.querySelector('#tasks-section .filters-row'); if (ref && ref.parentElement) ref.parentElement.insertBefore(host, ref.nextSibling); }
    host.innerHTML='';
    const minDur=(tasksMinDurInput?.value||'').trim(); if (minDur){ host.appendChild(createChip('Min: '+minDur+' min', ()=>{ tasksMinDurInput.value=''; applyTaskFilters(); })); }
    const status=(tasksStatusSel?.value||'').trim(); if (status){ host.appendChild(createChip('Estado: '+status.replace('_',' '), ()=>{ tasksStatusSel.value=''; applyTaskFilters(); })); }
    const tags=(tasksTagFilterInput?.value||'').trim(); if (tags){ host.appendChild(createChip('Tags: '+tags, ()=>{ tasksTagFilterInput.value=''; applyTaskFilters(); })); }
    const sort=(tasksSortSel?.value||'').trim(); if (sort && sort!=='all'){ host.appendChild(createChip('Orden: '+sort, ()=>{ tasksSortSel.value='all'; applyTaskFilters(); })); }
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
    const days = ['Lunes','Martes','Miércoles','Jueves','Viernes'];
    const groups = [[],[],[],[],[]];
    tasks.forEach(t => {
      if (!t.startAt) return;
      const d = new Date(t.startAt);
      const day = (d.getDay() + 6) % 7;
      if (day >= 0 && day <= 4) groups[day].push(t);
    });
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    // columnas más anchas para que el texto no se corte
    wrap.style.gridTemplateColumns = 'repeat(5, minmax(240px, 1fr))';
    wrap.style.gap = '16px';
    wrap.style.width = '100%';
    wrap.style.boxSizing = 'border-box';

    const todayMid = new Date(); todayMid.setHours(0,0,0,0);

    groups.forEach((items, i) => {
      const col = document.createElement('div');
      col.style.border = '1px solid #1f2937'; col.style.borderRadius = '12px'; col.style.padding = '12px'; col.style.background = '#0b1220'; col.style.minHeight='220px'; col.style.boxShadow='0 4px 14px rgba(0,0,0,0.25)';
      const h = document.createElement('div'); h.textContent = days[i]; h.style.fontWeight = '800'; h.style.margin='2px 0 10px'; h.style.color = '#e5e7eb'; h.style.position='sticky'; h.style.top='0'; h.style.background='#0b1220'; h.style.padding='6px 4px';
      col.appendChild(h);
      const sorted = items.sort((a,b)=>new Date(a.startAt) - new Date(b.startAt));
      sorted.forEach(t => {
        const card = document.createElement('div');
        card.style.border='1px solid #1f2937'; card.style.borderRadius='10px'; card.style.padding='10px'; card.style.marginBottom='10px'; card.style.background='linear-gradient(180deg,#0b1220,#0a1222)';
        card.style.wordWrap = 'break-word'; card.style.whiteSpace = 'normal';
        const head = document.createElement('div'); head.style.display='flex'; head.style.justifyContent='space-between'; head.style.alignItems='flex-start'; head.style.gap='8px';
        const title = document.createElement('div'); title.innerHTML = `<strong class="censor-title">${escapeHtml(t.title)}</strong>`; title.style.wordBreak='break-word';
        const badge = createStatusBadge(t.status);
        head.appendChild(title); head.appendChild(badge); card.appendChild(head);
        const info = document.createElement('div'); info.style.color='#94a3b8'; info.style.fontSize='12px'; info.textContent = `${formatDateTime(t.startAt)} · ${t.durationMinutes||'-'} min`;
        info.style.marginTop='6px';
        card.appendChild(info);
        const alertBar = document.createElement('div'); alertBar.style.marginTop='8px';
        if (needsStartAlert(t)) { const ab = makeAlertBadge('start'); alertBar.appendChild(ab); }
        if (needsFinishAlert(t)) { const ab = makeAlertBadge('finish'); alertBar.appendChild(ab); }
        if (alertBar.childNodes.length>0) card.appendChild(alertBar);

        // Botón Editar (deshabilitado si es pasado)
        const actions = document.createElement('div'); actions.style.marginTop='8px';
        const btn = document.createElement('button'); btn.textContent = '✏️ Editar';
        btn.style.background = '#3b82f6'; btn.style.color = '#fff'; btn.style.border = 'none'; btn.style.borderRadius = '6px'; btn.style.padding = '6px 10px'; btn.style.cursor = 'pointer';
        const isPast = t.startAt ? (new Date(t.startAt).setHours(0,0,0,0) < todayMid.getTime()) : false;
        if (isPast) { btn.disabled = true; btn.style.opacity = '0.5'; btn.title = 'No editable (tarea del pasado)'; }
        else { btn.addEventListener('click', () => openTaskEditModal(t)); btn.title = 'Editar tarea'; }
        actions.appendChild(btn);
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
      if (!force) showTab('tasks');
      showToast('Tareas actualizadas', 'success');
    } catch (err) {
      console.error(err);
      if (tasksListEl) tasksListEl.innerHTML = '<li>Error cargando tareas</li>';
    }
  }

  // Task creation modal
  if (taskCreateToggle) {
    taskCreateToggle.addEventListener('click', () => {
      showFormModal({
        title: 'Nueva tarea',
        fields: [
          { id: 'title', label: 'Título', type: 'text', value: '' },
          { id: 'description', label: 'Descripción (opcional)', type: 'textarea', rows: 3, value: '' },
          { id: 'startAt', label: 'Inicio', type: 'datetime-local', value: '' },
          { id: 'durationMinutes', label: 'Duración (minutos)', type: 'number', value: '' },
          { id: 'tags', label: 'Tags (separados por coma)', type: 'text', value: '' },
          // Estado como combobox
          { id: 'status', label: 'Estado', type: 'select', value: 'IN_PROGRESS', options: [
            { label: 'En progreso', value: 'IN_PROGRESS' },
            { label: 'Pausada', value: 'PAUSED' },
            { label: 'Completada', value: 'COMPLETED' }
          ] }
        ],
        onSubmit: async (values) => {
          const payload = {
            title: values.title || '',
            description: values.description || undefined,
            startAt: values.startAt || new Date().toISOString(),
            durationMinutes: values.durationMinutes ? parseInt(values.durationMinutes, 10) : 30,
            tags: (values.tags || '').split(',').map(t => t.trim()).filter(Boolean),
            status: values.status || undefined,
          };
          try {
            const res = await fetch('/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!res.ok) throw new Error(await res.text());
            showToast('Tarea creada', 'success');
            await fetchTasks(true);
            await showMessageModal('Tarea creada correctamente', { title: 'Nueva tarea' });
          } catch (err) {
            console.error(err);
            await showMessageModal('No se pudo crear la tarea', { title: 'Error' });
          }
        }
      });
      const overlay = document.getElementById('form-overlay');
      const bodyEl = overlay?.querySelector('#form-body');
      if (bodyEl) { bodyEl.querySelectorAll('input, textarea').forEach(el => { el.style.background='#0b1220'; el.style.color='#e5e7eb'; el.style.border='1px solid #334155'; el.style.borderRadius='8px'; el.style.padding='8px 10px'; }); }
    });
  }

  // Filters wiring
  tasksRefreshBtn?.addEventListener('click', () => { tasksMinDurInput && (tasksMinDurInput.value = ''); tasksStatusSel && (tasksStatusSel.value = ''); tasksTagFilterInput && (tasksTagFilterInput.value = ''); tasksSortSel && (tasksSortSel.value = 'all'); tasksDateFrom && (tasksDateFrom.value = ''); tasksDateTo && (tasksDateTo.value = ''); applyTaskFilters(); });
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
  function closeTasksCalendar(){ if (calModal) calModal.style.display = 'none'; }

  function renderCalendar(){
    if (!calGrid || !calHeader) return;
    calGrid.innerHTML = '';
    const firstDay = new Date(calYear, calMonth, 1);
    const lastDay = new Date(calYear, calMonth + 1, 0);
    const monthName = new Intl.DateTimeFormat('es-CL', { month: 'long' }).format(firstDay);
    calHeader.textContent = `${capitalize(monthName)} ${calYear}`;

    const weekdays = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
    weekdays.forEach(w => { const h=document.createElement('div'); h.textContent=w; h.style.fontWeight='600'; h.style.color='#cbd5e1'; h.style.textAlign='center'; calGrid.appendChild(h); });

    const padStart = (firstDay.getDay() + 6) % 7;
    for (let i = 0; i < padStart; i++) { const cell = document.createElement('div'); cell.style.minHeight = '64px'; calGrid.appendChild(cell); }

    const today = new Date(); today.setHours(0,0,0,0);

    for (let d=1; d<=lastDay.getDate(); d++){
      const date = new Date(calYear, calMonth, d);
      const cell = document.createElement('div');
      cell.style.border = '1px solid #1f2937'; cell.style.borderRadius='8px'; cell.style.padding='6px';
      const header = document.createElement('div'); header.textContent = String(d); header.style.fontWeight='700'; header.style.color='#e5e7eb'; cell.appendChild(header);
      const isPast = date < today;
      if (isPast){ cell.style.background='#7c2d12'; cell.style.borderColor='#f59e0b'; }
      else { cell.style.background='#0b2a5b'; cell.style.borderColor='#3b82f6'; }

      const dayTasks = (filteredTasks.length ? filteredTasks : allTasks).filter(t => {
        if (!t.startAt) return false;
        const ts = new Date(t.startAt);
        return ts.getFullYear() === date.getFullYear() && ts.getMonth() === date.getMonth() && ts.getDate() === date.getDate();
      }).sort((a,b)=>new Date(a.startAt) - new Date(b.startAt));

      dayTasks.forEach(t => {
        const item = document.createElement('div');
        item.className = 'card';
        item.style.marginTop='4px'; item.style.fontSize='12px'; item.style.fontWeight='600'; item.style.borderRadius='6px'; item.style.padding='2px 6px';
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
        item.innerHTML = `${pad2(new Date(t.startAt).getHours())}:${pad2(new Date(t.startAt).getMinutes())} <span class="censor-title">${escapeHtml(t.title)}</span>`;
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
    if (tasksSortSel) tasksSortSel.value = 'all';
    if (tasksDateFrom) tasksDateFrom.value = '';
    if (tasksDateTo) tasksDateTo.value = '';
    applyTaskFilters();
  });
  calPrevBtn?.addEventListener('click', () => { if (calMonth === 0) { calMonth = 11; calYear--; } else calMonth--; renderCalendar(); });
  calNextBtn?.addEventListener('click', () => { if (calMonth === 11) { calMonth = 0; calYear++; } else calMonth++; renderCalendar(); });
  calCloseBtn?.addEventListener('click', closeTasksCalendar);
  calModal?.addEventListener('click', (e) => { if (e.target === calModal) closeTasksCalendar(); });

  // Expose for tab handler
  window.fetchTasks = fetchTasks;

  // Inicialización
  showTab('errors');
  fetchErrors();

  // Actualización periódica de alertas y cronómetros
  setInterval(() => { try { applyTaskFilters(); } catch {} }, 30*1000);

  const BANK_ICON = {
    FALABELLA: '/bancos/banco-falabella.png',
    ESTADO: '/bancos/banco-estado.png',
    CHILE: '/bancos/banco-chile.jpg',
    SANTANDER: '/bancos/banco-santander.png'
  };

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
              const res = await fetch('/payments/' + p.id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
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
    const bank = paymentsBankSel?.value || '';
    const type = paymentsTypeSel?.value || '';
    const status = paymentsStatusSel?.value || '';
    const month = paymentsMonthInput?.value || '';
    const from = paymentsDateFrom?.value || '';
    const to = paymentsDateTo?.value || '';
    filteredPayments = allPayments.filter(p => {
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
      const res = await fetch('/payments');
      if (!res.ok) throw new Error('Error al obtener pagos');
      allPayments = await res.json();
      applyPaymentsFilters();
      showToast('Pagos actualizados', 'success');
    } catch (err) {
      console.error(err);
      if (paymentsListEl) paymentsListEl.innerHTML = '<li>Error cargando pagos</li>';
    }
  }

  // Wire filters
  paymentsRefreshBtn?.addEventListener('click', ()=>{ paymentsBankSel && (paymentsBankSel.value=''); paymentsTypeSel && (paymentsTypeSel.value=''); paymentsStatusSel && (paymentsStatusSel.value=''); paymentsMonthInput && (paymentsMonthInput.value=''); applyPaymentsFilters(); });
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

  // Month picker buttons
  paymentsMonthBtn?.addEventListener('click', ()=>{ try { if (paymentsMonthInput && typeof paymentsMonthInput.showPicker==='function') paymentsMonthInput.showPicker(); else paymentsMonthInput?.focus(); } catch { paymentsMonthInput?.focus(); } });

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
      wrap.style.background = '#0b1220';
      wrap.style.border = '1px solid #334155';
      wrap.style.borderRadius = '10px';
      wrap.style.padding = '6px 8px';
      wrap.style.boxShadow = '0 6px 18px rgba(0,0,0,0.3)';
      // Insertar antes del input y mover elementos dentro
      const parent = paymentsMonthInput.parentElement;
      if (parent) {
        parent.insertBefore(wrap, paymentsMonthInput);
        wrap.appendChild(paymentsMonthInput);
        // Estilos del input
        paymentsMonthInput.style.background = '#0b1220';
        paymentsMonthInput.style.color = '#e5e7eb';
        paymentsMonthInput.style.border = 'none';
        paymentsMonthInput.style.outline = 'none';
        paymentsMonthInput.style.padding = '4px 6px';
        paymentsMonthInput.style.borderRadius = '8px';
        paymentsMonthInput.style.minWidth = '130px';
        // Botón 📅 estilizado
        if (paymentsMonthBtn) {
          paymentsMonthBtn.style.background = '#3b82f6';
          paymentsMonthBtn.style.color = '#fff';
          paymentsMonthBtn.style.border = 'none';
          paymentsMonthBtn.style.borderRadius = '8px';
          paymentsMonthBtn.style.padding = '6px 8px';
          paymentsMonthBtn.style.cursor = 'pointer';
          paymentsMonthBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
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
  makeSelectSearchable(tasksSortSel);
  makeSelectSearchable(tasksStatusSel);
  makeSelectSearchable(paymentsBankSel);
  makeSelectSearchable(paymentsTypeSel);
  makeSelectSearchable(paymentsStatusSel);

  // Toast utility
  function showToast(message, kind = 'neutral', timeout = 2500){
    try {
      const t = document.createElement('div');
      t.className = 'toast';
      t.style.background = kind==='success'? '#052e2b' : kind==='danger'? '#320e12' : '#0a0f1e';
      t.style.borderColor = kind==='success'? '#10b981' : kind==='danger'? '#ef4444' : '#1f2937';
      t.textContent = message;
      document.body.appendChild(t);
      setTimeout(()=>{ t.style.opacity = '0'; t.style.transition = 'opacity 200ms ease'; setTimeout(()=>{ try { document.body.removeChild(t); } catch {} }, 220); }, timeout);
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
    function renderNotesPage(){
      const total = allNotes2.length; const pages = Math.max(1, Math.ceil(total / notesPageSize2));
      notesPage2 = Math.min(Math.max(1, notesPage2), pages);
      const start = (notesPage2 - 1) * notesPageSize2;
      const slice = allNotes2.slice(start, start + notesPageSize2);
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

    // Inicializar
    loadNotes();
  })();
});
