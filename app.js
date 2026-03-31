// app.js - Final Professional Version
const State = {
  lang: 'zh',
  theme: 'light',
  subject: 'compulsory',
  topic: 'Quadratic Equations in One Unknown',
  paper: 'paper1',
  difficulty: 'A1',
  loading: false,
  currentQuestion: null,
  showHint: false,
  showSteps: false,
  selectedOption: null,
  history: [],
  confirmingClear: false
};

function init() {
  if (window.location.protocol === 'file:') {
    alert('偵測到你直接打開了 HTML 檔案。請使用 http://localhost:3000。');
    return;
  }
  loadHistory();
  const savedTheme = localStorage.getItem('dse_theme');
  if (savedTheme) State.theme = savedTheme;
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) State.theme = 'dark';
  document.documentElement.setAttribute('data-theme', State.theme);
  render();
}

function loadHistory() {
  const saved = localStorage.getItem('dse_math_history');
  if (saved) {
    try { State.history = JSON.parse(saved); } catch (e) { State.history = []; }
  }
}

function saveToHistory(q) {
  const entry = { id: Date.now(), timestamp: new Date().toLocaleString(), ...q };
  State.history.unshift(entry);
  if (State.history.length > 20) State.history.pop();
  localStorage.setItem('dse_math_history', JSON.stringify(State.history));
}

function t(key, nested) {
  const dict = window.DSE_MATH_DATA.i18n[State.lang];
  if(nested) return dict[nested][key] || key;
  return dict[key] || key;
}

function render() {
  const appDiv = document.getElementById('app');
  if (!appDiv) return;

  appDiv.innerHTML = `
    <div class="app-container">
      <aside class="sidebar">
        <div class="sidebar-header" style="justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <i data-lucide="history"></i>
            <span>${State.lang === 'zh' ? '生成歷史' : 'History'}</span>
          </div>
          ${State.history.length > 0 ? `
            <button class="icon-btn" id="clear-all-history" title="${State.confirmingClear ? 'Confirm' : 'Clear All'}" style="font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 4px; background: ${State.confirmingClear ? 'var(--error)' : 'rgba(239, 68, 68, 0.1)'}; color: ${State.confirmingClear ? 'white' : 'var(--error)'}; display: flex; align-items: center; gap: 0.25rem; transition: all 0.2s;">
              <i data-lucide="${State.confirmingClear ? 'alert-triangle' : 'trash-2'}" style="width: 14px; height: 14px;"></i>
              ${State.confirmingClear ? (State.lang === 'zh' ? '確定清空?' : 'Clear?') : ''}
            </button>
          ` : ''}
        </div>
        <div class="history-list">
          ${State.history.length === 0 ? `
            <div style="padding: 2rem; text-align: center; color: var(--text-muted); font-size: 0.8rem;">
              ${State.lang === 'zh' ? '暫無歷史記錄' : 'No history yet'}
            </div>
          ` : State.history.map(item => `
            <div class="history-item ${State.currentQuestion?.id === item.id ? 'active' : ''}" data-id="${item.id}" style="position: relative;">
              <div class="history-item-meta">${item.timestamp}</div>
              <div class="history-item-title">${item.topic} (${item.section})</div>
              <button class="delete-history-btn" data-id="${item.id}" style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--error); opacity: 0.4; cursor: pointer; padding: 0.4rem;">
                <i data-lucide="x" style="width: 14px; height: 14px;"></i>
              </button>
            </div>
          `).join('')}
        </div>
      </aside>

      <main>
        <div class="content-wrapper">
          <div class="glass-card">
            <header class="app-header">
              <div class="brand"><h1>${t('title')}</h1></div>
              <div class="controls">
                <button class="btn-icon" id="lang-toggle">
                   <span style="font-weight:700; font-size:0.7rem;">${State.lang === 'zh' ? 'EN' : '中'}</span>
                </button>
                <button class="btn-icon" id="theme-toggle">
                  <i data-lucide="${State.theme === 'light' ? 'moon' : 'sun'}"></i>
                </button>
              </div>
            </header>

            <div class="config-grid">
              <div class="field">
                <label>${t('subject')}</label>
                <select id="subject-sel">
                  ${window.DSE_MATH_DATA.subjects.map(s => `
                    <option value="${s.id}" ${State.subject === s.id ? 'selected' : ''}>
                      ${State.lang === 'en' ? s.labelEn : s.labelZh}
                    </option>
                  `).join('')}
                </select>
              </div>
              <div class="field">
                <label>${t('topic')}</label>
                <select id="topic-sel">
                  ${window.DSE_MATH_DATA.i18n.en.topics[State.subject].map((enTopic, idx) => {
                    const zhTopic = window.DSE_MATH_DATA.i18n.zh.topics[State.subject][idx];
                    return `<option value="${enTopic}" ${State.topic === enTopic ? 'selected' : ''}>${State.lang === 'en' ? enTopic : zhTopic}</option>`;
                  }).join('')}
                </select>
              </div>
              <div class="field">
                <label>${State.subject === 'compulsory' ? t('difficulty') : t('level')}</label>
                <select id="diff-sel">
                  ${(State.subject === 'compulsory' ? ['A1', 'A2', 'B'] : ['A', 'B']).map(lvl => {
                    const data = State.subject === 'compulsory' ? window.DSE_MATH_DATA.i18n[State.lang].levels[lvl] : window.DSE_MATH_DATA.i18n[State.lang].m_levels[lvl];
                    return `<option value="${lvl}" ${State.difficulty === lvl ? 'selected' : ''}>${data.label}</option>`;
                  }).join('')}
                </select>
              </div>

              <div class="paper-selector" style="${State.subject !== 'compulsory' ? 'display:none;' : ''}">
                <div class="paper-option">
                  <input type="radio" name="paper" id="p1" value="paper1" ${State.paper === 'paper1' ? 'checked' : ''}>
                  <label for="p1" class="paper-label">${t('paper1')}</label>
                </div>
                <div class="paper-option">
                  <input type="radio" name="paper" id="p2" value="paper2" ${State.paper === 'paper2' ? 'checked' : ''}>
                  <label for="p2" class="paper-label">${t('paper2')}</label>
                </div>
              </div>
            </div>

            <button class="btn-generate" id="generate-btn" ${State.loading ? 'disabled' : ''}>
              ${State.loading ? `<i data-lucide="loader-2" class="spinner"></i> ${t('generating')}` : `<i data-lucide="sparkles"></i> ${t('generateBtn')}`}
            </button>

            ${State.currentQuestion ? renderQuestionArea() : ''}
          </div>
        </div>
      </main>
    </div>
  `;

  lucide.createIcons();
  renderMath();
  attachEvents();
}

function renderQuestionArea() {
  const q = State.currentQuestion;
  const options = q.mcOptions?.list || (Array.isArray(q.mcOptions) ? q.mcOptions : null);
  const correctIdx = q.mcOptions?.correctIndex ?? q.correctIndex;
  const isMC = options && Array.isArray(options);

  return `
    <div class="question-display" id="printable-q">
      <div class="badge-row">
        <span class="badge">${q.unit}</span>
        <span class="badge">${q.section}</span>
        <span class="badge">${q.topic}</span>
      </div>

      <div class="q-text math-container">
        ${q.questionText}
        ${!isMC && q.markingScheme ? `
          <div style="text-align: right; font-weight: 700; margin-top: 1.5rem; font-family: serif; font-size: 1.1rem;">
            (${q.markingScheme.reduce((acc, row) => {
              const m = row.point?.toString().match(/\d+/);
              return acc + (m ? parseInt(m[0]) : 0);
            }, 0) || 0} ${State.lang === 'zh' ? '分' : 'marks'})
          </div>
        ` : ''}
      </div>

      ${isMC ? `
        <div class="mc-container">
          ${options.map((opt, idx) => {
            let status = '';
            if (State.selectedOption !== null) {
              if (idx === correctIdx) status = 'correct';
              else if (idx === State.selectedOption) status = 'wrong';
            }
            return `
              <div class="mc-item ${status}" data-idx="${idx}">
                <div class="mc-char">${['A','B','C','D'][idx]}</div>
                <div class="math-container">${opt}</div>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}

      <div class="button-group">
        <button class="btn-secondary" id="hint-trigger"><i data-lucide="lightbulb"></i> ${t('hint')}</button>
        <button class="btn-secondary" id="steps-trigger"><i data-lucide="eye"></i> ${t('steps')}</button>
        <button class="btn-secondary" id="copy-trigger"><i data-lucide="copy"></i> ${t('copy')}</button>
        <button class="btn-secondary" id="print-trigger"><i data-lucide="printer"></i> ${t('print')}</button>
      </div>

      ${State.showHint && q.hint ? `<div class="info-section hint-section"><div class="section-head">${t('hint')}</div><div class="math-container">${q.hint}</div></div>` : ''}
      ${State.showSteps ? `
        <div class="info-section steps-section">
          <div class="section-head">${t('markingScheme')}</div>
          ${q.markingScheme.map(row => `<div class="ms-row"><div class="math-container">${row.step}</div><div class="ms-points">${row.point}</div></div>`).join('')}
          <div class="ms-row" style="font-weight:800; margin-top:1rem; border-top:1.5px solid var(--success);">
            <div>${t('finalAnswer')}</div><div class="math-container" style="color:var(--success); flex:1; text-align:right;">${q.finalAnswer}</div>
          </div>
        </div>
        <div class="info-section comment-section">
          <div class="section-head">${t('expertCommentary')}</div>
          <div style="font-weight:700; margin-bottom:0.5rem; color:var(--primary);">${q.expertCommentary.difficulty}</div>
          <div class="math-container">${q.expertCommentary.keyPoints}</div>
        </div>
      ` : ''}
    </div>
  `;
}

function renderMath() {
  const elements = document.querySelectorAll('.math-container');
  elements.forEach(el => {
    try {
      renderMathInElement(el, {
        delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '$', right: '$', display: false},
          {left: '\\(', right: '\\)', display: false},
          {left: '\\[', right: '\\]', display: true}
        ],
        throwOnError: false
      });
    } catch(e) { console.error(e); }
  });
}

function attachEvents() {
  const safeSetClick = (id, fn) => {
    const el = document.getElementById(id);
    if(el) el.onclick = fn;
  };
  const safeSetChange = (id, fn) => {
    const el = document.getElementById(id);
    if(el) el.onchange = fn;
  };

  safeSetClick('theme-toggle', () => {
    State.theme = State.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('dse_theme', State.theme);
    document.documentElement.setAttribute('data-theme', State.theme);
    render();
  });
  safeSetClick('lang-toggle', () => { State.lang = State.lang === 'zh' ? 'en' : 'zh'; render(); });
  safeSetChange('subject-sel', (e) => {
    State.subject = e.target.value;
    State.topic = window.DSE_MATH_DATA.i18n.en.topics[State.subject][0];
    State.difficulty = State.subject === 'compulsory' ? 'A1' : 'A';
    render();
  });
  safeSetChange('topic-sel', (e) => { State.topic = e.target.value; render(); });
  safeSetChange('diff-sel', (e) => { State.difficulty = e.target.value; render(); });

  document.querySelectorAll('input[name="paper"]').forEach(el => {
    el.onchange = (e) => { State.paper = e.target.value; render(); };
  });

  safeSetClick('generate-btn', async () => {
    State.loading = true;
    State.showHint = false;
    State.showSteps = false;
    State.selectedOption = null;
    State.currentQuestion = null; // Immediately clear previous question
    render();
    try {
      const q = await generateAIQuestion();
      State.currentQuestion = q;
      saveToHistory(q);
    } catch(err) { alert(t('errorGenerative')); }
    State.loading = false; render();
  });

  safeSetClick('hint-trigger', () => { State.showHint = !State.showHint; render(); });
  safeSetClick('steps-trigger', () => { State.showSteps = !State.showSteps; render(); });
  safeSetClick('print-trigger', () => { window.print(); });
  safeSetClick('copy-trigger', () => {
    const text = document.getElementById('printable-q').innerText;
    navigator.clipboard.writeText(text).then(() => alert('Copied!'));
  });

  document.querySelectorAll('.mc-item').forEach(el => {
    el.onclick = () => { State.selectedOption = parseInt(el.getAttribute('data-idx')); render(); };
  });

  document.querySelectorAll('.history-item').forEach(el => {
    el.onclick = (e) => {
      if(e.target.closest('.delete-history-btn')) return;
      const id = parseInt(el.getAttribute('data-id'));
      const found = State.history.find(h => h.id === id);
      if(found) {
        State.currentQuestion = found;
        State.showHint = State.showSteps = false;
        State.selectedOption = null;
        render();
      }
    };
  });

  document.querySelectorAll('.delete-history-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const id = parseInt(btn.getAttribute('data-id'));
      State.history = State.history.filter(h => h.id !== id);
      localStorage.setItem('dse_math_history', JSON.stringify(State.history));
      if(State.currentQuestion?.id === id) State.currentQuestion = null;
      render();
    };
  });

  safeSetClick('clear-all-history', () => {
    if(!State.confirmingClear) {
      State.confirmingClear = true;
      render();
      setTimeout(() => { if(State.confirmingClear) { State.confirmingClear = false; render(); } }, 3000);
    } else {
      State.history = []; localStorage.setItem('dse_math_history', JSON.stringify([]));
      State.currentQuestion = null; State.confirmingClear = false; render();
    }
  });
}

function robustJSONParse(text) {
  try { return JSON.parse(text); } catch (e) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) { try { return JSON.parse(match[0]); } catch (e2) {} }
    throw new Error('JSON Parse failed');
  }
}

async function generateAIQuestion() {
  const diffObj = State.subject === 'compulsory' ? window.DSE_MATH_DATA.i18n[State.lang].levels[State.difficulty] : window.DSE_MATH_DATA.i18n[State.lang].m_levels[State.difficulty];
  const idx = window.DSE_MATH_DATA.i18n.en.topics[State.subject].indexOf(State.topic);
  const currentTopic = window.DSE_MATH_DATA.i18n[State.lang].topics[State.subject][idx];
  const langReq = State.lang === 'zh' ? 'Traditional Chinese' : 'English';
  const isP2 = State.subject === 'compulsory' && State.paper === 'paper2';

  const prompt = `
${isP2 ? '# MODE: MULTIPLE CHOICE (MC) QUESTION REQUIRED. ONE Correct answer, THREE distractors.' : '# MODE: STRUCTURED QUESTION (Long/Short Q).'}
# Role: HKDSE Mathematics Verification Expert
Topic: ${currentTopic}. Section: ${diffObj.label}.
Output Language: ALL text (math descriptions, hints, solutions, commentary) MUST be in ${langReq}.

## 1. MATHEMATICAL INTEGRITY (CRITICAL):
- SELF-CORRECTION: Before outputting, solve the question internally. Ensure chosen numbers result in solvable, standard DSE results (avoid ugly decimals).
- ALGEBRA: Discriminants ($b^2-4ac$) must be $\ge 0$ unless complex roots are intended. For rational roots, $\Delta$ MUST be a perfect square. 
- GEOMETRY: All lengths MUST satisfy geometrical axioms (Triangle Inequality, Circle Theorems). If O is center, radius $R$ must be consistent with chord $c$ and distance $d$ via $R^2 = d^2 + (c/2)^2$.
- CONSISTENCY: Labels in <svg> (A, B, C...) MUST correspond exactly to the problem text.

## 2. VISUAL REQUIREMENTS:
- DIAGRAMS: For Geometry/Trig/Coordinate topics, MANDATORY inline <svg> (400x240). Use stroke="currentColor", stroke-width="2", fill="none".
- TABLES: For Statistics/Data, use professional HTML <table> with borders.

Return ONLY a strictly valid JSON object:
{
  "unit": "${State.subject.toUpperCase()}", "section": "${diffObj.label}", "topic": "${currentTopic}",
  "questionText": "Question text in ${langReq}...",
  "hint": "Logical hint in ${langReq}...",
  "markingScheme": [
    {"step": "One line of working in ${langReq}...", "point": "1M", "type": "M"},
    {"step": "Final step in ${langReq}...", "point": "1A", "type": "A"}
  ],
  "finalAnswer": "Final result in ${langReq}...",
  "expertCommentary": {"difficulty": "Easy/Medium/Hard", "keyPoints": "Explain key logic in ${langReq}."}
  ${isP2 ? ', "mcOptions": ["Distractor A", "Distractor B", "Distractor C", "Correct Option (all in ' + langReq + ')"], "correctIndex": 3' : ''}
}
CRITICAL: NO CHINESE characters allowed in English output mode.
Do not include reasoning or markdown code blocks.`;

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  if(!response.ok) throw new Error('API Error');
  const data = await response.json();
  const res = robustJSONParse(data.text);
  if(res.mcOptions && !res.mcOptions.list) {
    return { ...res, mcOptions: { list: res.mcOptions, correctIndex: res.correctIndex } };
  }
  return res;
}

init();
