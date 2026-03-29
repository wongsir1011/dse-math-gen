// app.js

const State = {
  lang: 'zh', // 'zh' or 'en'
  theme: 'light',
  subject: 'compulsory',
  topic: 'Quadratic Equations in One Unknown',
  paper: 'paper1',
  difficulty: 3,
  useAi: false,
  apiKey: localStorage.getItem('dse_math_api_key') || '',
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
          <button class="icon-btn" id="settings-toggle" title="Settings">
            <i data-lucide="settings"></i>
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
          
          <!-- Difficulty -->
          <div class="form-group">
            <label>${t('difficulty')} (${t('level')} ${State.difficulty === 6 ? '5*' : State.difficulty === 7 ? '5**' : State.difficulty})</label>
            <input type="range" id="diff-slider" min="1" max="7" value="${State.difficulty}" style="width:100%">
          </div>
        </div>

        <div class="form-grid">
          <!-- Paper -->
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
        
        <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <label class="toggle-wrapper">
            <input type="checkbox" id="ai-toggle" style="display:none;" ${State.useAi ? 'checked' : ''}>
            <div class="toggle-bg"><div class="toggle-knob"></div></div>
            <span style="font-weight:600;">${t('useAi')}</span>
          </label>
          
          <button class="btn-primary" id="generate-btn" style="width: 200px;" ${State.loading ? 'disabled' : ''}>
            ${State.loading ? `<i data-lucide="loader-2" class="spinner"></i> ${t('generating')}` : `<i data-lucide="sparkles"></i> ${t('generateBtn')}`}
          </button>
        </div>

        <!-- Question Area -->
        ${State.currentQuestion ? renderQuestionArea() : ''}
      </main>
    </div>

    <!-- Settings Modal -->
    <div class="modal-overlay" id="settings-modal">
      <div class="modal-content glass">
        <div class="modal-header">
          <h2>${t('settings')}</h2>
          <button class="modal-close" id="close-settings">&times;</button>
        </div>
        <div class="form-group">
          <label>${t('apiKeyLabel')}</label>
          <input type="text" id="api-key-input" value="${State.apiKey}" placeholder="AIzaSy...">
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem; line-height: 1.4;">${t('apiKeyDesc')}</p>
        </div>
        <button class="btn-primary" id="save-key-btn" style="margin-top: 1.5rem;">${t('submitAiKey')}</button>
      </div>
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
              <div class="mc-option" data-idx="${idx}">
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

      ${State.showSteps && q.steps ? `
        <div class="content-box math-display" style="margin-top: 1.5rem; background: rgba(16, 185, 129, 0.1); border-left: 4px solid var(--success);">
          <strong>Answer & Steps:</strong><br/>${q.steps}
        </div>
      ` : ''}
    </div>
  `;
}

// Math Rendering with KaTeX (finds $...$ and $$...$$ patterns)
function renderMath() {
  const mathElements = document.querySelectorAll('.math-display');
  
  mathElements.forEach(el => {
    // Basic inner HTML parse
    let html = el.innerHTML;
    
    // Regular expression for inline $ $ and block $$ $$
    // Avoid re-rendering if it's already rendered
    html = html.replace(/\$\$(.+?)\$\$/gs, (match, p1) => {
      try {
        const decoded = p1.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
        return katex.renderToString(decoded, { displayMode: true, throwOnError: false });
      } catch(e) { return p1; }
    });
    
    html = html.replace(/\$(.+?)\$/g, (match, p1) => {
      try {
         const decoded = p1.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
         return katex.renderToString(decoded, { displayMode: false, throwOnError: false });
      } catch(e) { return p1; }
    });

    // Handle line breaks
    html = html.replace(/\\n|\n/g, '<br/>');

    el.innerHTML = html;
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

  // Settings Modal
  const modal = document.getElementById('settings-modal');
  document.getElementById('settings-toggle').onclick = () => modal.classList.add('active');
  document.getElementById('close-settings').onclick = () => modal.classList.remove('active');
  
  document.getElementById('save-key-btn').onclick = () => {
    State.apiKey = document.getElementById('api-key-input').value.trim();
    localStorage.setItem('dse_math_api_key', State.apiKey);
    modal.classList.remove('active');
    render();
  };

  // Selectors
  document.getElementById('subject-sel').onchange = (e) => {
    State.subject = e.target.value;
    State.topic = window.DSE_MATH_DATA.i18n.en.topics[State.subject][0];
    State.currentQuestion = null;
    render();
  };

  document.getElementById('topic-sel').onchange = (e) => {
    State.topic = e.target.value;
    State.currentQuestion = null;
    render();
  };

  document.getElementById('diff-slider').oninput = (e) => {
    State.difficulty = parseInt(e.target.value);
    document.querySelector('label[for="diff-slider"]') // fast update text if needed, handled by redraw usually 
    render(); // Redraw might be heavy for strict slider, but ok here
  };

  document.querySelectorAll('input[name="paper"]').forEach(el => {
    el.onchange = (e) => {
      State.paper = e.target.value;
      State.currentQuestion = null;
      render();
    };
  });

  document.getElementById('ai-toggle').onchange = (e) => {
    State.useAi = e.target.checked;
    State.currentQuestion = null;
    render();
  };

  // Generate Action
  document.getElementById('generate-btn').onclick = async () => {
    State.loading = true;
    State.showHint = false;
    State.showSteps = false;
    State.selectedOption = null;
    render();

    try {
      if(State.useAi && State.apiKey) {
        State.currentQuestion = await generateAIQuestion();
      } else {
        // Find chinese topic equivalent
        const idx = window.DSE_MATH_DATA.i18n.en.topics[State.subject].indexOf(State.topic);
        const zhTopic = window.DSE_MATH_DATA.i18n.zh.topics[State.subject][idx];
        State.currentQuestion = window.DSE_MATH_DATA.generateFallback(State.subject, State.topic, zhTopic, State.paper, State.difficulty, State.lang);
      }
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
  const diffStr = State.difficulty === 6 ? '5*' : State.difficulty === 7 ? '5**' : State.difficulty.toString();
  const formatInstructions = State.paper === 'paper1' 
    ? `Since this is Paper 1, return a JSON object with: {"questionText": "...", "hint": "...", "steps": "..."}`
    : `Since this is Paper 2, return a JSON object with: {"questionText": "...", "hint": "...", "steps": "...", "mcOptions": ["option A", "option B", "option C", "option D"], "correctIndex": integer (0 to 3)}`;

  // Find translated terms
  const subjName = State.subject;
  const idx = window.DSE_MATH_DATA.i18n.en.topics[State.subject].indexOf(State.topic);
  const zhTopic = window.DSE_MATH_DATA.i18n.zh.topics[State.subject][idx];
  
  const langReq = State.lang === 'zh' ? 'Traditional Chinese (繁體中文)' : 'English';

  const prompt = `Act as an expert HKDSE Mathematics Teacher. 
Please generate a unique exam-style question for Subject: ${subjName}, Topic: ${State.lang === 'zh' ? zhTopic : State.topic}.
Difficulty level: ${diffStr} (HKDSE standard).
Output Language: ${langReq}.

Use LaTeX formatting with $ for inline and $$ for block math formulas. Make sure numbers and variable names are randomized and different from generic examples. Do NOT wrap values in generic text if it's purely an equation.

CRITICAL VISUAL ELEMENTS REQUIREMENT:
You MUST include non-text elements whenever appropriate for the given topic to make it realistic.
1. For data, statistics, or enumerations, output properly formed HTML <table> elements.
2. For geometry, graphs, charts, or diagrams, output inline HTML <svg> code to draw the exact mathematical figures described in the question. Ensure the SVG has sensible viewBox/width/height and uses stroke/fill cleanly.
3. CRITICAL: Provide HTML tables and SVGs purely minified on a single line with NO newline characters (\\n) inside the tags. Only use \\n to separate text paragraphs.

Embed these HTML elements directly within the "questionText" (or "steps") fields in the JSON.

${formatInstructions}

Return strictly valid JSON without markdown wrapping like \`\`\`json.`;

  // Gemini API call format
  let url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${State.apiKey}`;
  
  const payload = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.9,
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if(!response.ok) {
    throw new Error('API request failed');
  }

  const data = await response.json();
  const rawText = data.candidates[0].content.parts[0].text;
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
          questionText: result.questionText,
          hint: result.hint,
          steps: result.steps,
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
