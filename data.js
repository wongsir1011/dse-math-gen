// data.js
// Stores syllabus, question bank, and localized strings

window.DSE_MATH_DATA = {
  // Bilingual translations
  i18n: {
    en: {
      title: "HKDSE Mathematics Exercise Generator",
      subject: "Subject",
      topic: "Topic",
      paper: "Paper",
      difficulty: "Difficulty",
      level: "Level",
      levels: {
        A1: { label: "Section A(1)", desc: "Level 1-2: Single Topic | Basic Calculation | Direct Application." },
        A2: { label: "Section A(2)", desc: "Level 3-4: Cross Topic | Integrated Application | Explanation Required." },
        B: { label: "Section B", desc: "Level 5-5**: Abstraction | Complex Synthesis | Proof & 3D Spatial reasoning." }
      },
      m_levels: {
        A: { label: "Section A", desc: "Level 3-5: Short questions (5-8 marks), core calculation techniques." },
        B: { label: "Section B", desc: "Level 5-5**: Long questions (10-12 marks), modeling, deep proof, multi-step reasoning." }
      },
      generateBtn: "Generate Question",
      hint: "Show Hint",
      steps: "Show Answer & Steps",
      correctMsg: "Correct!",
      wrongMsg: "Incorrect, try again.",
      paper1: "Paper 1 (Long/Short Qs)",
      paper2: "Paper 2 (Multiple Choice)",
      selectTopic: "-- Select a Topic --",
      generating: "Generating...",
      errorGenerative: "Error generating question. Check API Key or try again.",
      topics: {
        compulsory: [
          "Basic Operations and Estimation",
          "Algebraic Operations",
          "Applications of Percentages",
          "Equations and Functions",
          "Polynomials",
          "Variations",
          "Inequalities",
          "Sequences",
          "Plane Geometry",
          "Circle Geometry",
          "Trigonometry",
          "Coordinate Geometry",
          "Mensuration",
          "Statistics",
          "Probability"
        ],
        m1: [
          "Binomial Expansion",
          "Derivatives",
          "Integration",
          "Further Probability",
          "Probability Distributions",
          "Normal Distribution",
          "Statistical Inference"
        ],
        m2: [
          "Proofs and Theorems",
          "Further Trigonometry",
          "Matrices",
          "Vectors",
          "Advanced Differentiation",
          "Advanced Integration",
          "Applications (Area and Volume of Revolution)"
        ]
      }
    },
    zh: {
      title: "香港DSE數學科練習題生成器",
      subject: "學科",
      topic: "課題",
      paper: "試卷",
      difficulty: "難度",
      level: "等級",
      levels: {
        A1: { label: "甲部(1)", desc: "Level 1-2: 單一課題 | 基礎運算 | 直接應用。" },
        A2: { label: "甲部(2)", desc: "Level 3-4: 跨課題結合 | 綜合應用 | 須作解釋。" },
        B: { label: "乙部", desc: "Level 5-5**: 抽象概念 | 綜合推導 | 證明及立體空間想像。" }
      },
      m_levels: {
        A: { label: "甲部", desc: "Level 3-5: 短題 (5-8 分)。考察核心計算技巧。" },
        B: { label: "乙部", desc: "Level 5-5**: 長題 (10-12 分)。涉及建模、深度證明或多步驟推理。" }
      },
      generateBtn: "生成題目",
      hint: "顯示提示",
      steps: "顯示答案及運算步驟",
      correctMsg: "正確！",
      wrongMsg: "錯誤，請再試一次。",
      paper1: "卷一 (長/短題目)",
      paper2: "卷二 (多項選擇題)",
      selectTopic: "-- 請選擇課題 --",
      generating: "生成中...",
      errorGenerative: "生成題目失敗，請檢查 API Key 或稍後再試。",
      topics: {
        compulsory: [
          "基礎運算與估算",
          "代數操作",
          "百分比應用",
          "方程與函數",
          "多項式",
          "變分",
          "不等式",
          "數列",
          "平面幾何",
          "圓形幾何",
          "三角學",
          "坐標幾何",
          "求積法",
          "統計學",
          "概率"
        ],
        m1: [
          "二項展開式",
          "導數",
          "積分",
          "進階概率",
          "概率分佈",
          "正態分佈",
          "統計推論"
        ],
        m2: [
          "證明與定理",
          "三角學進階",
          "矩陣",
          "向量",
          "導數進階",
          "積分進階",
          "應用 (面積/旋轉體)"
        ]
      }
    }
  },

  subjects: [
    { id: 'compulsory', labelEn: 'Compulsory Part', labelZh: '必修部分' },
    { id: 'm1', labelEn: 'Module 1 (M1)', labelZh: '單元一 (M1)' },
    { id: 'm2', labelEn: 'Module 2 (M2)', labelZh: '單元二 (M2)' }
  ]
};
