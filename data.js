// data.js
// Stores syllabus, question bank, and localized strings

window.DSE_MATH_DATA = {
  // Bilingual translations
  i18n: {
    en: {
      title: "HKDSE Mathematics Exercise Generator",
      settings: "Settings",
      subject: "Subject",
      topic: "Topic",
      paper: "Paper",
      difficulty: "Difficulty",
      level: "Level",
      levels: {
        A1: { label: "Level A1 (Basic)", desc: "Basic topics only, direct calculation, no cross-topics, 1-2 steps to complete." },
        A2: { label: "Level A2 (Standard)", desc: "Includes non-basic content, conceptual links, requires steps/reasoning, 3-5 steps." },
        B: { label: "Level B (Advanced)", desc: "Combines multiple topics, 3D contexts or complex real-world applications, requires analysis and synthesis." }
      },
      useAi: "Use AI Generation",
      generateBtn: "Generate Question",
      hint: "Show Hint",
      steps: "Show Answer & Steps",
      submitAiKey: "Save API Key",
      apiKeyLabel: "Gemini API Key (Optional)",
      apiKeyDesc: "Enter your Gemini API Key to enable truly unique AI-generated questions. If left blank, local randomized questions will be used.",
      correctMsg: "Correct!",
      wrongMsg: "Incorrect, try again.",
      close: "Close",
      paper1: "Paper 1 (Long/Short Qs)",
      paper2: "Paper 2 (Multiple Choice)",
      selectTopic: "-- Select a Topic --",
      generating: "Generating...",
      errorGenerative: "Error generating question. Check API Key or try again.",
      topics: {
        compulsory: [
          "Quadratic Equations in One Unknown",
          "Functions and their Graphs",
          "Exponential and Logarithmic Functions",
          "More about Polynomials",
          "More about Equations",
          "Variations",
          "Arithmetic and Geometric Sequences and their Summation",
          "Inequalities and Linear Programming",
          "More about Graphs of Functions",
          "Basic Properties of Circles",
          "Loci",
          "Equations of Straight Lines and Circles",
          "More about Trigonometry",
          "Permutation and Combination",
          "More about Probability",
          "Measures of Dispersion",
          "Uses and Abuses of Statistics",
          "Further Applications of Mathematics",
          "Inquiry and Investigation"
        ],
        m1: [
          "Binomial Expansion",
          "Exponential and Logarithmic Functions",
          "Derivatives of Functions",
          "Differentiation of Functions",
          "Second Derivatives",
          "Applications of Differentiation",
          "Indefinite Integrals and their Applications",
          "Definite Integrals and their Applications",
          "Approximating Definite Integrals using Trapezoidal Rule",
          "Conditional Probability and Independence",
          "Bayes' Theorem",
          "Discrete Random Variables",
          "Probability Distributions, Expectation and Variance",
          "Binomial Distribution",
          "Geometric Distribution",
          "Poisson Distribution",
          "Applications of Binomial, Geometric and Poisson Distributions",
          "Basic Definitions and Properties of Normal Distribution",
          "Standardisation of Normal Variables",
          "Applications of Normal Distribution",
          "Sampling Distributions and Point Estimation",
          "Confidence Intervals for Population Mean",
          "Confidence Intervals for Population Proportion"
        ],
        m2: [
          "Surds",
          "Mathematical Induction",
          "Binomial Theorem",
          "More about Trigonometric Functions",
          "Introduction to e",
          "Limits",
          "Differentiation",
          "Applications of Differentiation",
          "Indefinite Integration",
          "Definite Integration",
          "Applications of Definite Integration",
          "Determinants",
          "Matrices",
          "Systems of Linear Equations",
          "Introduction to Vectors",
          "Scalar Product and Vector Product",
          "Applications of Vectors"
        ]
      }
    },
    zh: {
      title: "香港DSE數學科練習題生成器",
      settings: "設定",
      subject: "學科",
      topic: "課題",
      paper: "試卷",
      difficulty: "難度",
      level: "等級",
      levels: {
        A1: { label: "Level A1 (基礎)", desc: "僅限基礎課題，直接運算，無須跨課題，1-2 步完成。" },
        A2: { label: "Level A2 (標準)", desc: "包含非基礎內容，涉及概念聯繫，須書寫步驟或理由，步驟約 3-5 步。" },
        B: { label: "Level B (進階)", desc: "綜合多個課題，包含三維情境或複雜現實應用題，要求分析與綜合能力。" }
      },
      useAi: "使用 AI 出題",
      generateBtn: "生成題目",
      hint: "顯示提示",
      steps: "顯示答案及運算步驟",
      submitAiKey: "儲存 API Key",
      apiKeyLabel: "Gemini API Key (選填)",
      apiKeyDesc: "輸入您的 Gemini API Key 以啟用無限隨機的 AI 出題功能。若保持空白，將使用內建隨機題庫。",
      correctMsg: "正確！",
      wrongMsg: "錯誤，請再試一次。",
      close: "關閉",
      paper1: "卷一 (長/短題目)",
      paper2: "卷二 (多項選擇題)",
      selectTopic: "-- 請選擇課題 --",
      generating: "生成中...",
      errorGenerative: "生成題目失敗，請檢查 API Key 或稍後再試。",
      topics: {
        compulsory: [
          "一元二次方程",
          "函數及其圖像",
          "指數函數與對數函數",
          "續多項式",
          "續方程",
          "變分",
          "等差數列與等比數列及其求和法",
          "不等式與線性規畫",
          "續函數圖像",
          "圓的基本性質",
          "軌跡",
          "直線與圓的方程",
          "續三角",
          "排列與組合",
          "續概率",
          "離差的度量",
          "統計的應用及誤用",
          "數學的進一步應用",
          "探索與研究"
        ],
        m1: [
          "二項展式",
          "指數函數及對數函數",
          "函數的導數",
          "函數的求導法",
          "二階導數",
          "求導法的應用",
          "不定積分及其應用",
          "定積分及其應用",
          "使用梯形法則計算定積分的近似值",
          "條件概率和獨立性",
          "貝葉斯定理",
          "離散隨機變量",
          "概率分佈, 期望值和方差",
          "二項分佈",
          "幾何分佈",
          "泊松分佈",
          "二項、幾何和泊松分佈的應用",
          "基本定義及其性質（正態分佈）",
          "正態變量的標準化及標準正態分佈表的使用",
          "正態分佈的應用",
          "抽樣分佈和點估計",
          "總體平均值的置信區間",
          "總體比例的置信區間"
        ],
        m2: [
          "根式",
          "數學歸納法",
          "二項式定理",
          "續三角函數",
          "e 的簡介",
          "極限",
          "求導法",
          "求導法的應用",
          "不定積分法",
          "定積分法",
          "定積分法的應用",
          "行列式",
          "矩陣",
          "線性方程組",
          "向量的簡介",
          "純量積與向量積",
          "向量的應用"
        ]
      }
    }
  },

  subjects: [
    { id: 'compulsory', labelEn: 'Compulsory Part', labelZh: '必修部分' },
    { id: 'm1', labelEn: 'Module 1 (M1)', labelZh: '單元一 (M1)' },
    { id: 'm2', labelEn: 'Module 2 (M2)', labelZh: '單元二 (M2)' }
  ],

  // Fallback local question templates for when AI is disabled
  // Uses {{var}} to be dynamically replaced.
  localBank: {
    compulsory: {
      "Quadratic Equations in One Unknown": {
        paper1: [
          {
            template: {
              en: "Solve the quadratic equation $x^2 + {{a}}x + {{b}} = 0$.",
              zh: "解一元二次方程 $x^2 + {{a}}x + {{b}} = 0$。"
            },
            hint: {
              en: "Try to factorize or use the quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$.",
              zh: "嘗試因式分解，或者使用二次公式: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$。"
            },
            steps: {
              en: "Using quadratic formula:\n$x = \\frac{-{{a}} \\pm \\sqrt{{{a}}^2 - 4(1)({{b}})}}{2}$",
              zh: "使用二次公式：\n$x = \\frac{-{{a}} \\pm \\sqrt{{{a}}^2 - 4(1)({{b}})}}{2}$"
            },
            vars: () => {
              // Generates integer roots to make b and a nice.
              const root1 = Math.floor(Math.random() * 10) - 5;
              const root2 = Math.floor(Math.random() * 10) - 5;
              const a = -(root1 + root2);
              const b = root1 * root2;
              return { a, b, answerStr: `x = ${root1} or x = ${root2}` };
            }
          }
        ],
        paper2: [
          {
            template: {
              en: "If $\\alpha$ and $\\beta$ are the roots of the equation $x^2 - {{a}}x + {{b}} = 0$, what is the value of $\\alpha + \\beta$?",
              zh: "如果 $\\alpha$ 和 $\\beta$ 是方程式 $x^2 - {{a}}x + {{b}} = 0$ 的根，請問 $\\alpha + \\beta$ 的值是多少？"
            },
            hint: {
              en: "Use the sum of roots property: $\\alpha + \\beta = -b/a$",
              zh: "利用兩根之和公式：$\\alpha + \\beta = -b/a$"
            },
            steps: {
              en: "For $ax^2 + bx + c = 0$, sum of roots is $-b/a$.\nHere, sum is $-(-{{a}})/1 = {{a}}$.",
              zh: "對於 $ax^2 + bx + c = 0$，兩根之和為 $-b/a$。\n因此，和為 $-(-{{a}})/1 = {{a}}$。"
            },
            vars: () => {
              const a = Math.floor(Math.random() * 15) + 2;
              const b = Math.floor(Math.random() * 10) + 1;
              return { 
                a, b, 
                mcOptions: [
                  `${a}`, `${-a}`, `${b}`, `${-b}`
                ],
                correctIndex: 0
              };
            }
          }
        ]
      }
      // Added a default fallback for missing topics
    }
  },
  
  // Generic fallback generator
  generateFallback: function(subject, topicEn, topicZh, paper, difficulty, lang) {
    // Try to find specific bank
    if(this.localBank[subject] && this.localBank[subject][topicEn] && this.localBank[subject][topicEn][paper]) {
      const qs = this.localBank[subject][topicEn][paper];
      const q = qs[Math.floor(Math.random() * qs.length)];
      const v = q.vars();
      let text = q.template[lang];
      let steps = q.steps[lang];
      for(const [key, val] of Object.entries(v)) {
        text = text.replace(new RegExp(`{{${key}}}`, 'g'), val);
        steps = steps.replace(new RegExp(`{{${key}}}`, 'g'), val);
      }
      return {
        questionText: text,
        hint: q.hint[lang],
        steps: steps,
        answer: v.answerStr || (paper === 'paper1' ? steps : `Correct option: ${['A','B','C','D'][v.correctIndex]}`),
        mcOptions: v.mcOptions ? this.shuffleOptions(v.mcOptions, v.correctIndex) : null
      };
    } else {
      // Very generic math placeholder
      const diffMultiplier = difficulty === 'A1' ? 1 : difficulty === 'A2' ? 3 : 6;
      const a = Math.floor(Math.random() * 10 * diffMultiplier) + 1;
      const b = Math.floor(Math.random() * 10 * diffMultiplier) + 1;
      
      let textEn = `(Mock Question for ${topicEn}) Solve $${a}x = ${b}$.`;
      let textZh = `(${topicZh} 模擬題目) 解 $${a}x = ${b}$。`;
      
      if(paper === 'paper2') {
        const cIdx = Math.floor(Math.random() * 4);
        const fraction = `${b}/${a}`;
        return {
          questionText: lang === 'en' ? textEn : textZh,
          hint: lang === 'en' ? "Divide both sides by " + a : `等式兩邊同除以 ${a}`,
          steps: `$x = \\frac{${b}}{${a}}$`,
          mcOptions: this.shuffleOptions([fraction, `-${fraction}`, `${a}/${b}`, `-${a}/${b}`], 0)
        };
      }
      
      return {
         questionText: lang === 'en' ? textEn : textZh,
         hint: lang === 'en' ? "Divide both sides by " + a : `等式兩邊同除以 ${a}`,
         steps: `$x = \\frac{${b}}{${a}}$`,
         answer: `$x = \\frac{${b}}{${a}}$`,
         mcOptions: null
      };
    }
  },
  
  shuffleOptions: function(options, correctIdx) {
    const correctVal = options[correctIdx];
    let arr = [...options];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const newCorrectIdx = arr.indexOf(correctVal);
    return { list: arr, correctIndex: newCorrectIdx };
  }
};
