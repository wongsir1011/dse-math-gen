// app.js

const State = {
  lang: 'zh', // 'zh' or 'en'
  theme: 'light',
  subject: 'compulsory',
  topic: 'Quadratic Equations in One Unknown',
  paper: 'paper1',
  difficulty: 'A1', // Maps to Sections
  loading: false,
  currentQuestion: null,
  showHint: false,
  showSteps: false,
  selectedOption: null
};

// Elements
const appDiv = document.getElementById('app');

// Initialization
function init() {
  if (window.location.protocol === 'file:') {
    alert('偵測到你直接打開了 HTML 檔案。請使用 http://localhost:3000 來打開網頁，否則 AI 功能將無法運作！');
    return;
  }
  // Load theme preference or detect system theme
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    State.theme = 'dark';
  }
  document.documentElement.setAttribute('data-theme', State.theme);
  
  render();
}

function t(key, nested) {
  const dict = window.DSE_MATH_DATA.i18n[State.lang];
  if(nested) {
    return dict[nested][key] || key;
  }
  return dict[key] || key;
}

// Render Engine
function render() {
  appDiv.innerHTML = `
    <div class="glass">
      <header>
        <div class="title-group">
          <h1>${t('title')}</h1>
        </div>
        <div class="nav-actions">
          <button class="icon-btn" id="lang-toggle" title="Toggle Language">
            <i data-lucide="languages"></i> ${State.lang === 'zh' ? 'EN' : '中文'}
          </button>
          <button class="icon-btn" id="theme-toggle" title="Toggle Theme">
            <i data-lucide="${State.theme === 'light' ? 'moon' : 'sun'}"></i>
          </button>
        </div>
      </header>
      
      <main>
        <div class="form-grid">
          <!-- Subject -->
          <div class="form-group">
            <label>${t('subject')}</label>
            <select id="subject-sel">
              ${window.DSE_MATH_DATA.subjects.map(s => `
                <option value="${s.id}" ${State.subject === s.id ? 'selected' : ''}>
                  ${State.lang === 'en' ? s.labelEn : s.labelZh}
                </option>
              `).join('')}
            </select>
          </div>
          
          <!-- Topic -->
          <div class="form-group">
            <label>${t('topic')}</label>
            <select id="topic-sel">
              ${window.DSE_MATH_DATA.i18n.en.topics[State.subject].map((enTopic, idx) => {
                const zhTopic = window.DSE_MATH_DATA.i18n.zh.topics[State.subject][idx];
                const displayTopic = State.lang === 'en' ? enTopic : zhTopic;
                return `<option value="${enTopic}" ${State.topic === enTopic ? 'selected' : ''}>${displayTopic}</option>`;
              }).join('')}
            </select>
          </div>
          
          <!-- Section / Difficulty -->
          <div class="form-group">
            <label>${State.subject === 'compulsory' ? t('difficulty') : t('level')}</label>
            <select id="diff-sel">
              ${(State.subject === 'compulsory' ? ['A1', 'A2', 'B'] : ['A', 'B']).map(lvl => {
                const levelData = State.subject === 'compulsory' 
                  ? window.DSE_MATH_DATA.i18n[State.lang].levels[lvl]
                  : window.DSE_MATH_DATA.i18n[State.lang].m_levels[lvl];
                return `<option value="${lvl}" ${State.difficulty === lvl ? 'selected' : ''}>${levelData.label}</option>`;
              }).join('')}
            </select>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem; line-height: 1.4;">
              ${(State.subject === 'compulsory' 
                ? window.DSE_MATH_DATA.i18n[State.lang].levels[State.difficulty]
                : window.DSE_MATH_DATA.i18n[State.lang].m_levels[State.difficulty])?.desc || ''}
            </p>
          </div>
        </div>

        <div class="form-grid" style="${State.subject !== 'compulsory' ? 'display:none;' : ''}">
          <!-- Paper (Only for Compulsory) -->
          <div class="form-group" style="grid-column: span 2;">
            <label>${t('paper')}</label>
            <div class="radio-group">
              <div class="radio-card">
                <input type="radio" name="paper" id="p1" value="paper1" ${State.paper === 'paper1' ? 'checked' : ''}>
                <label for="p1">${t('paper1')}</label>
              </div>
              <div class="radio-card">
                <input type="radio" name="paper" id="p2" value="paper2" ${State.paper === 'paper2' ? 'checked' : ''}>
                <label for="p2">${t('paper2')}</label>
              </div>
            </div>
          </div>
        </div>
        
        <div style="display:flex; justify-content: flex-end; align-items: center; margin-bottom: 1.5rem;">
          <button class="btn-primary" id="generate-btn" style="width: 200px;" ${State.loading ? 'disabled' : ''}>
            ${State.loading ? `<i data-lucide="loader-2" class="spinner"></i> ${t('generating')}` : `<i data-lucide="sparkles"></i> ${t('generateBtn')}`}
          </button>
        </div>

        <!-- Question Area -->
        ${State.currentQuestion ? renderQuestionArea() : ''}
      </main>

      <footer class="app-footer">
        &copy; 2026 Designed and Developed by 香港兩餸飯關注組版主Andrew
      </footer>
    </div>
  `;

  // Re-initialize icons
  lucide.createIcons();
  
  // Render Math
  renderMath();

  attachEvents();
}

function renderQuestionArea() {
  const q = State.currentQuestion;
  return `
    <div class="question-area">
      <div class="content-box math-display">
        <div style="font-size: 0.9rem; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem; border-bottom: 1px solid var(--surface-border); padding-bottom: 0.25rem;">
          ${q.unit.toUpperCase()} | ${q.section} | ${q.topic}
        </div>
        ${q.questionText}
      </div>
      
      ${q.mcOptions ? `
        <div class="mc-grid">
          ${q.mcOptions.list.map((opt, idx) => {
            let className = 'mc-option';
            if(State.selectedOption !== null && idx === State.selectedOption) {
              className += (idx === q.mcOptions.correctIndex) ? ' correct' : ' wrong';
            } else if (State.selectedOption !== null && idx === q.mcOptions.correctIndex) {
              className += ' correct';
            }
            return `
              <div class="${className}" data-idx="${idx}">
                <div class="mc-label">${['A','B','C','D'][idx]}</div>
                <div class="math-display">${opt}</div>
              </div>
            `;
          }).join('')}
        </div>
        ${State.selectedOption !== null ? `
          <div style="margin-top:1rem; font-weight:600; color: ${State.selectedOption === q.mcOptions.correctIndex ? 'var(--success)' : 'var(--error)'}">
            ${State.selectedOption === q.mcOptions.correctIndex ? t('correctMsg') : t('wrongMsg')}
          </div>
        ` : ''}
      ` : ''}

      <div class="actions-row">
        <button class="btn-primary btn-secondary" id="hint-btn">${t('hint')}</button>
        <button class="btn-primary btn-secondary" id="steps-btn">${t('steps')}</button>
      </div>

      ${State.showHint && q.hint ? `
        <div class="content-box math-display" style="margin-top: 1.5rem; background: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b;">
          <strong>Hint:</strong><br/>${q.hint}
        </div>
      ` : ''}

      ${State.showSteps && q.markingScheme ? `
        <div class="marking-scheme math-display">
          <div class="ms-title" style="justify-content: flex-end;"><i data-lucide="check-circle"></i> Marking Scheme</div>
          ${q.markingScheme.map(step => `
            <div class="ms-step">
              <div class="ms-desc" style="text-align: left; flex: 1;">${step.step}</div>
              <div class="ms-mark ms-mark-${step.type.toLowerCase()}">${step.point}</div>
            </div>
          `).join('')}
          <div class="ms-final-row">
            <div style="min-width: 100px;">Final Answer</div>
            <div style="color: var(--success); text-align: left;">${q.finalAnswer}</div>
          </div>
        </div>

        <div class="expert-commentary">
          <div class="ec-title"><i data-lucide="info"></i> 專家點評 (Expert Commentary)</div>
          <div class="ec-badge">難度等級: ${q.expertCommentary.difficulty}</div>
          <div class="ec-content">${q.expertCommentary.keyPoints}</div>
        </div>
      ` : ''}
    </div>
  `;
}

// Math Rendering with KaTeX (finds $...$ and $$...$$ patterns)
function renderMath() {
  const mathElements = document.querySelectorAll('.math-display');
  
  mathElements.forEach(el => {
    try {
      // Use official KaTeX auto-render for robust parsing
      renderMathInElement(el, {
        delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '$', right: '$', display: false},
          {left: '\\(', right: '\\)', display: false},
          {left: '\\[', right: '\\]', display: true}
        ],
        throwOnError: false,
        trust: true
      });
    } catch(e) {
      console.error('KaTeX rendering error:', e);
    }
  });
}

function attachEvents() {
  // Theme Toggle
  document.getElementById('theme-toggle').onclick = () => {
    State.theme = State.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', State.theme);
    render();
  };
  
  // Lang Toggle
  document.getElementById('lang-toggle').onclick = () => {
    State.lang = State.lang === 'zh' ? 'en' : 'zh';
    render();
  };

  // Selectors
  document.getElementById('subject-sel').onchange = (e) => {
    State.subject = e.target.value;
    State.topic = window.DSE_MATH_DATA.i18n.en.topics[State.subject][0];
    State.difficulty = State.subject === 'compulsory' ? 'A1' : 'A';
    State.currentQuestion = null;
    render();
  };

  document.getElementById('topic-sel').onchange = (e) => {
    State.topic = e.target.value;
    State.currentQuestion = null;
    render();
  };

  document.getElementById('diff-sel').onchange = (e) => {
    State.difficulty = e.target.value;
    State.currentQuestion = null;
    render();
  };

  document.querySelectorAll('input[name="paper"]').forEach(el => {
    el.onchange = (e) => {
      State.paper = e.target.value;
      State.currentQuestion = null;
      render();
    };
  });

  // Generate Action
  document.getElementById('generate-btn').onclick = async () => {

    console.log('[App] Generate button clicked');
    State.loading = true;
    State.showHint = false;
    State.showSteps = false;
    State.selectedOption = null;
    render();

    try {
      State.currentQuestion = await generateAIQuestion();
    } catch(err) {
      console.error(err);
      alert(t('errorGenerative'));
      State.currentQuestion = null;
    }

    State.loading = false;
    render();
  };

  // Hint / Steps
  const hintBtn = document.getElementById('hint-btn');
  if(hintBtn) hintBtn.onclick = () => { State.showHint = !State.showHint; render(); };
  
  const stepsBtn = document.getElementById('steps-btn');
  if(stepsBtn) stepsBtn.onclick = () => { State.showSteps = !State.showSteps; render(); };

  // MC Options
  document.querySelectorAll('.mc-option').forEach(el => {
    el.onclick = () => {
      State.selectedOption = parseInt(el.getAttribute('data-idx'));
      render();
    }
  });
}

// AI Integration Service
async function generateAIQuestion() {
  const diffObj = State.subject === 'compulsory' 
    ? window.DSE_MATH_DATA.i18n[State.lang].levels[State.difficulty]
    : window.DSE_MATH_DATA.i18n[State.lang].m_levels[State.difficulty];
  
  const diffStr = `${diffObj.label} - ${diffObj.desc}`;
  
  // Find translated terms
  const subjName = State.subject;
  const idx = window.DSE_MATH_DATA.i18n.en.topics[State.subject].indexOf(State.topic);
  const zhTopic = window.DSE_MATH_DATA.i18n.zh.topics[State.subject][idx];
  
  const langReq = State.lang === 'zh' ? 'Traditional Chinese (繁體中文)' : 'English';

  const prompt = `
# Role: DSE Mathematics Question Generator (Compulsory/M1/M2)

## 1. Role Definition
You are a master HKDSE Mathematics Specialist and Senior Marker. Your goal is to generate high-quality, logically rigorous math questions that match HKEAA formats.

## 2. Knowledge Boundaries (Strict Firewall)
According to the choice "{Unit}", rules must be strictly enforced:

### 【Compulsory Part】
- **Scope**: Number & Algebra (Percentage, Indices, Factorization, Equations, Delta, Graphs, Polynomials, Inequalities, Linear Programming, Variation, AS/GS), Geometry & Space (Properties, Circles, Trigonometry, 2D/3D, Coordinates), Data Handling (Probability, Stats).
- **FIREWALL**: NEVER use $e$, $\ln$, Calculus, Matrices, Vectors, Complex numbers $i$.

### 【M1: Calculus and Statistics】
- **Scope**: Binomial Expansion, $e^x$/$\ln x$ Calculus, Conditional Probability, Bayes', Binomial/Poisson/Normal Distributions, Sampling, Confidence Intervals.
- **FIREWALL**: NEVER use Trig Calculus, Mathematical Induction (MI), Vectors, Matrices.

### 【M2: Algebra and Calculus】
- **Scope**: MI, Binomial Theorem, Trig Identities, Limits, Differentiation/Integration, Volume, Vectors (Dot/Cross), Matrices & Linear Systems.
- **FIREWALL**: NEVER use Statistics distributions (Normal/Poisson/Binomial) or Confidence Intervals.

---

## 3. Difficulty & Section Logic
- **Compulsory**: 
  - Section A(1): (Level 1-2) Basic. 2-4 steps, direct formula application.
  - Section A(2): (Level 3-4) Integrated. Cross-topic, includes "Explain your answer" parts.
  - Section B: (Level 5-5**) High logic. Complex scenarios, deep deduction or 3D traps.
- **M1 / M2**:
  - Section A: (Level 3-5) Short questions (5-8 marks). Core calculation.
  - Section B: (Level 5-5**) Long questions (10-12 marks). Modeling, proof, multi-step.

---

## 4. Current Request Parameters
- **Unit**: ${State.subject.toUpperCase()}
- **Section**: ${diffObj.label}
- **Topic**: ${State.lang === 'zh' ? zhTopic : State.topic}
- **Output Language**: ${langReq}

---

## 5. Mathematical Integrity & Formatting
1. Solveability: Must be logically sound.
2. Values: Prefer integers, fractions, surds, or $\pi$.
3. LaTeX: Use standard LaTeX. CRITICAL: EVERY single mathematical symbol, variable, or equation MUST be wrapped in $...$ (inline) or $$...$$ (block).
   - Variables: Use $x$, not x.
   - Symbols: Use $\Delta$ (\\Delta), $\pi$ (\\pi), $\sqrt{x}$ (\\sqrt{x}), $30^\circ$ (30^\\circ).
   - Formulas: Use $y = mx + c$.
   - Fractions: Use $\frac{a}{b}$.
4. MANDATORY VISUALS: For any question involving Geometry, 3D Space, Trigonometry, Coordinate Geometry, or Statistics, you MUST include a professionally drawn inline HTML <svg>. 
   - Label it as "(Figure 1)" or "(圖 1)" below the diagram.
   - Coordinate System: standard viewBox="0 0 400 240".
   - Proportionality: Shapes must match the numbers in the problem.
   - Styling: stroke="currentColor", stroke-width="2", fill="none".

---

## 6. Output Format (STRICT JSON)
You MUST return a strictly valid JSON object:
{
  "unit": "${State.subject.toUpperCase()}",
  "section": "${diffObj.label}",
  "topic": "${State.lang === 'zh' ? zhTopic : State.topic}",
  "questionText": "Question body in ${langReq}. Include SVG directly here if needed.",
  "hint": "Brief hint in ${langReq}.",
  "markingScheme": [
    {"step": "Step 1 text with LaTeX", "point": "1M", "type": "M"},
    {"step": "Step 2 text with LaTeX", "point": "1A", "type": "A"}
  ],
  "finalAnswer": "The clean final value",
  "expertCommentary": {
    "difficulty": "Predicted DSE Level (e.g., Level 5)",
    "keyPoints": "Analysis of common errors or core techniques in ${langReq}."
  }${State.subject === 'compulsory' && State.paper === 'paper2' ? `,
  "mcOptions": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0` : ''}
}

Return ONLY the JSON. No markdown backticks.`;

  console.log('[App] Calling /api/generate with prompt length:', prompt.length);
  // Call Serverless Function (Using relative path for better compatibility)
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  console.log('[App] API response status:', response.status);

  if(!response.ok) {
    throw new Error('API request failed');
  }

  const data = await response.json();
  const rawText = data.text;
  let cleanText = rawText.trim();
  if(cleanText.startsWith('```json')) {
    cleanText = cleanText.substring(7);
  }
  if(cleanText.endsWith('```')) {
    cleanText = cleanText.substring(0, cleanText.length - 3);
  }

  const result = JSON.parse(cleanText);
  if(result.mcOptions) {
      return {
          unit: result.unit,
          section: result.section,
          topic: result.topic,
          questionText: result.questionText,
          hint: result.hint,
          markingScheme: result.markingScheme,
          finalAnswer: result.finalAnswer,
          expertCommentary: result.expertCommentary,
          mcOptions: {
              list: result.mcOptions,
              correctIndex: result.correctIndex
          }
      };
  } else {
      return result;
  }
}

// Start app
init();
