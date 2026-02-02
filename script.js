/**
 * FranklinCovey Time Matrix Game
 * JavaScript Logic
 *
 * This script handles:
 * - Loading activities from data.json
 * - Game state management
 * - User interactions
 * - Score tracking
 * - Feedback display
 */

// Game state variables
let activities = []; // All activities from JSON
let shuffledActivities = []; // Randomized order of activities
let currentActivityIndex = 0; // Current position in shuffled array
let score = 0; // User's correct answers
let totalActivities = 0; // Total number of activities
let currentLanguage = "en"; // Current language setting
let translations = {}; // Loaded translations

// DOM elements
const currentActivityEl = document.getElementById("current-activity");
const scoreEl = document.getElementById("score");
const progressEl = document.getElementById("progress");
const feedbackEl = document.getElementById("feedback");
const languageSelectEl = document.getElementById("language-select");

/**
 * Initialize the game when the page loads
 */
document.addEventListener("DOMContentLoaded", function () {
  loadTranslations();
});

/**
 * Load translations from lang.json file
 * Uses fetch API to load the translation data with fallback for file:// protocol
 */
async function loadTranslations() {
  try {
    // Try to fetch the translation file
    const response = await fetch("lang.json");

    // Check if the fetch was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Validate that we have translations
    if (!data || !data.en || !data.pt) {
      throw new Error("Invalid translation file format");
    }

    // Store translations
    translations = data;

    // Set initial language from localStorage or default to 'en'
    const savedLanguage = localStorage.getItem("timeMatrixLanguage");
    if (savedLanguage && translations[savedLanguage]) {
      currentLanguage = savedLanguage;
    } else {
      currentLanguage = "en";
      localStorage.setItem("timeMatrixLanguage", "en");
    }

    // Update language selector
    if (languageSelectEl) {
      languageSelectEl.value = currentLanguage;
    }

    // Apply translations to the UI
    applyTranslations();

    // Load activities after translations are ready
    loadActivities();
  } catch (error) {
    console.error("Error loading translations:", error);

    // Fallback: Use embedded translations if fetch fails
    if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("CORS")
    ) {
      console.log(
        "Using fallback embedded translations due to fetch restrictions",
      );
      useEmbeddedTranslations();
    } else {
      // If translations fail completely, still load the game with default English
      translations = getEmbeddedTranslations();
      applyTranslations();
      loadActivities();
    }
  }
}

/**
 * Fallback function to use embedded translations when fetch fails
 */
function useEmbeddedTranslations() {
  translations = getEmbeddedTranslations();
  applyTranslations();
  loadActivities();
}

/**
 * Get embedded translations as fallback
 */
function getEmbeddedTranslations() {
  return {
    en: {
      title: "FranklinCovey Time Matrix Game",
      instructions:
        "Classify each activity into the correct quadrant of the Time Matrix: <strong>Q1 (Important & Urgent)</strong>, <strong>Q2 (Important & Not Urgent)</strong>, <strong>Q3 (Not Important & Urgent)</strong>, or <strong>Q4 (Not Important & Not Urgent)</strong>.",
      scoreLabel: "Score:",
      activitiesLabel: "Activities:",
      currentActivityTitle: "Current Activity",
      timeMatrixTitle: "Time Matrix Quadrants",
      helpButton: "Help",
      helpModalTitle: "Game Rules & Instructions",
      howToPlay: "How to Play",
      howToPlayStep1:
        "Read the Activity: An activity description will appear above the Time Matrix.",
      howToPlayStep2:
        "Classify the Activity: Click on the quadrant (Q1, Q2, Q3, or Q4) where you think this activity belongs.",
      howToPlayStep3:
        "Get Feedback: You'll see immediate feedback - green for correct, red for incorrect.",
      howToPlayStep4:
        "Learn: If incorrect, you'll see which quadrant was correct with an explanation.",
      howToPlayStep5:
        "Continue: The next activity will appear automatically after a short delay.",
      quadrantGuide: "The Four Quadrants",
      q1Title: "Q1: Important & Urgent",
      q1Examples: "Examples: Crises, deadlines, emergencies, urgent problems",
      q1Strategy:
        "Strategy: Handle immediately, but try to reduce these through better planning",
      q2Title: "Q2: Important & Not Urgent",
      q2Examples:
        "Examples: Planning, prevention, values, relationship building",
      q2Strategy:
        "Strategy: Schedule time for these - they're key to long-term success",
      q3Title: "Q3: Not Important & Urgent",
      q3Examples: "Examples: Some calls, meetings, interruptions, some emails",
      q3Strategy:
        "Strategy: Delegate or minimize - they feel urgent but aren't truly important",
      q4Title: "Q4: Not Important & Not Urgent",
      q4Examples:
        "Examples: Time wasters, excessive entertainment, trivial busywork",
      q4Strategy:
        "Strategy: Eliminate or minimize - these are pure time drains",
      scoringTitle: "Scoring",
      scoringCorrect: "+1 point for each correct classification",
      scoringIncorrect: "0 points for incorrect answers (no penalty)",
      scoringProgress: "See your progress and final accuracy percentage",
      learningGoals: "Learning Goals",
      learningGoal1: "Identify what's truly important vs. just urgent",
      learningGoal2: "Recognize time-wasting activities",
      learningGoal3: "Focus energy on Q2 activities for long-term success",
      learningGoal4: "Reduce time spent in Q1 through better planning",
      proTip: "Pro Tip:",
      proTipText:
        "The goal isn't just to win the game, but to learn how to apply these principles to your real life. Ask yourself: 'Which quadrant does this activity in my life belong to?'",
      gameComplete: "Game Complete!",
      finalScore: "Final Score:",
      accuracy: "Accuracy:",
      playAgain: "Play Again",
      correctFeedback: "✅ Correct! Well done!",
      incorrectFeedback: "❌ Incorrect. This activity belongs in",
      languageLabel: "Language:",
      english: "English",
      portuguese: "Português",
    },
    pt: {
      title: "Jogo da Matriz de Tempo FranklinCovey",
      instructions:
        "Classifique cada atividade no quadrante correto da Matriz de Tempo: <strong>Q1 (Importante & Urgente)</strong>, <strong>Q2 (Importante & Não Urgente)</strong>, <strong>Q3 (Não Importante & Urgente)</strong>, ou <strong>Q4 (Não Importante & Não Urgente)</strong>.",
      scoreLabel: "Pontuação:",
      activitiesLabel: "Atividades:",
      currentActivityTitle: "Atividade Atual",
      timeMatrixTitle: "Quadrantes da Matriz de Tempo",
      helpButton: "Ajuda",
      helpModalTitle: "Regras do Jogo & Instruções",
      howToPlay: "Como Jogar",
      howToPlayStep1:
        "Leia a Atividade: Uma descrição de atividade aparecerá acima da Matriz de Tempo.",
      howToPlayStep2:
        "Classifique a Atividade: Clique no quadrante (Q1, Q2, Q3 ou Q4) onde você acha que essa atividade pertence.",
      howToPlayStep3:
        "Receba Feedback: Você verá feedback imediato - verde para correto, vermelho para incorreto.",
      howToPlayStep4:
        "Aprenda: Se estiver incorreto, você verá qual quadrante estava correto com uma explicação.",
      howToPlayStep5:
        "Continue: A próxima atividade aparecerá automaticamente após um curto intervalo.",
      quadrantGuide: "Os Quatro Quadrantes",
      q1Title: "Q1: Importante & Urgente",
      q1Examples: "Exemplos: Crises, prazos, emergências, problemas urgentes",
      q1Strategy:
        "Estratégia: Lidar imediatamente, mas tentar reduzir isso através de melhor planejamento",
      q2Title: "Q2: Importante & Não Urgente",
      q2Examples:
        "Exemplos: Planejamento, prevenção, valores, construção de relacionamentos",
      q2Strategy:
        "Estratégia: Agendar tempo para isso - são fundamentais para o sucesso a longo prazo",
      q3Title: "Q3: Não Importante & Urgente",
      q3Examples:
        "Exemplos: Algumas chamadas, reuniões, interrupções, alguns e-mails",
      q3Strategy:
        "Estratégia: Delegar ou minimizar - parecem urgentes mas não são realmente importantes",
      q4Title: "Q4: Não Importante & Não Urgente",
      q4Examples:
        "Exemplos: Perda de tempo, entretenimento excessivo, trabalho trivial",
      q4Strategy:
        "Estratégia: Eliminar ou minimizar - são puro desperdício de tempo",
      scoringTitle: "Pontuação",
      scoringCorrect: "+1 ponto para cada classificação correta",
      scoringIncorrect: "0 pontos para respostas incorretas (sem penalidade)",
      scoringProgress: "Veja seu progresso e percentual de acerto final",
      learningGoals: "Objetivos de Aprendizagem",
      learningGoal1:
        "Identificar o que é realmente importante versus apenas urgente",
      learningGoal2: "Reconhecer atividades que desperdiçam tempo",
      learningGoal3:
        "Focar energia nas atividades Q2 para sucesso a longo prazo",
      learningGoal4: "Reduzir tempo gasto no Q1 através de melhor planejamento",
      proTip: "Dica Profissional:",
      proTipText:
        "O objetivo não é apenas vencer o jogo, mas aprender a aplicar esses princípios à sua vida real. Pergunte-se: 'Em qual quadrante essa atividade da minha vida pertence?'",
      gameComplete: "Jogo Completo!",
      finalScore: "Pontuação Final:",
      accuracy: "Precisão:",
      playAgain: "Jogar Novamente",
      correctFeedback: "✅ Correto! Muito bem!",
      incorrectFeedback: "❌ Incorreto. Esta atividade pertence ao",
      languageLabel: "Idioma:",
      english: "Inglês",
      portuguese: "Português",
    },
  };
}

/**
 * Load activities from data.json file
 * Uses fetch API to load the JSON data with fallback for file:// protocol
 */
async function loadActivities() {
  try {
    // Try to fetch the JSON file
    const response = await fetch("data.json");

    // Check if the fetch was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Validate that we have activities
    if (
      !data.activities ||
      !Array.isArray(data.activities) ||
      data.activities.length === 0
    ) {
      throw new Error("No activities found in data.json");
    }

    // Store all activities
    activities = data.activities;
    totalActivities = activities.length;

    // Randomize the order of activities
    shuffledActivities = shuffleArray([...activities]);

    // Update progress display
    progressEl.textContent = `0 / ${totalActivities}`;

    // Start the game
    startGame();
  } catch (error) {
    console.error("Error loading activities:", error);

    // Fallback: Use embedded data if fetch fails (common with file:// protocol)
    if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("CORS")
    ) {
      console.log("Using fallback embedded data due to fetch restrictions");
      useEmbeddedData();
    } else {
      currentActivityEl.innerHTML = `
                <div style="color: red; font-weight: bold;">
                    Error loading activities: ${error.message}<br>
                    Please check that data.json exists and contains valid activity data.
                </div>
            `;
    }
  }
}

/**
 * Fallback function to use embedded data when fetch fails
 * This happens when opening HTML files directly in browsers with CORS restrictions
 */
function useEmbeddedData() {
  // Embedded data as fallback with bilingual support
  const embeddedData = {
    activities: [
      {
        description: {
          en: "Clean up after a water leak or spill",
          pt: "Limpar após um vazamento de água ou derramamento",
        },
        correctQuadrant: "q1",
      },
      {
        description: {
          en: "Cook dinner because the family needs to eat now",
          pt: "Cozinhar o jantar porque a família precisa comer agora",
        },
        correctQuadrant: "q1",
      },
      {
        description: {
          en: "Wash dishes when there are none left for the next meal",
          pt: "Lavar a louça quando não há mais para a próxima refeição",
        },
        correctQuadrant: "q1",
      },
      {
        description: {
          en: "Emergency grocery run due to no food at home",
          pt: "Compra de emergência de mantimentos por falta de comida em casa",
        },
        correctQuadrant: "q1",
      },
      {
        description: {
          en: "Fix a broken appliance essential for daily life",
          pt: "Consertar um eletrodoméstico quebrado essencial para o dia a dia",
        },
        correctQuadrant: "q1",
      },
      {
        description: {
          en: "Take out overflowing trash",
          pt: "Colocar o lixo transbordando para fora",
        },
        correctQuadrant: "q1",
      },
      {
        description: {
          en: "Handle a sudden pest problem",
          pt: "Resolver um problema súbito de pragas",
        },
        correctQuadrant: "q1",
      },
      {
        description: {
          en: "Weekly meal planning",
          pt: "Planejamento semanal de refeições",
        },
        correctQuadrant: "q2",
      },
      {
        description: {
          en: "Regular house cleaning schedule",
          pt: "Agenda regular de limpeza da casa",
        },
        correctQuadrant: "q2",
      },
      {
        description: {
          en: "Organizing cupboards and storage areas",
          pt: "Organizar armários e áreas de armazenamento",
        },
        correctQuadrant: "q2",
      },
      {
        description: {
          en: "Preventive home maintenance",
          pt: "Manutenção preventiva da casa",
        },
        correctQuadrant: "q2",
      },
      {
        description: {
          en: "Batch cooking meals for the week",
          pt: "Cozinhar refeições em lote para a semana",
        },
        correctQuadrant: "q2",
      },
      {
        description: {
          en: "Decluttering unused items",
          pt: "Desfazer-se de itens não utilizados",
        },
        correctQuadrant: "q2",
      },
      {
        description: {
          en: "Creating a household budget",
          pt: "Criar um orçamento doméstico",
        },
        correctQuadrant: "q2",
      },
      {
        description: {
          en: "Teaching children household routines",
          pt: "Ensinar às crianças rotinas domésticas",
        },
        correctQuadrant: "q2",
      },
      {
        description: {
          en: "Deep cleaning bathrooms and kitchen appliances",
          pt: "Limpeza profunda de banheiros e eletrodomésticos",
        },
        correctQuadrant: "q2",
      },
      {
        description: {
          en: "Cleaning the house suddenly because guests might arrive",
          pt: "Limpar a casa de repente porque os convidados podem chegar",
        },
        correctQuadrant: "q3",
      },
      {
        description: {
          en: "Re-cleaning already clean areas unnecessarily",
          pt: "Re-limpar áreas já limpas desnecessariamente",
        },
        correctQuadrant: "q3",
      },
      {
        description: {
          en: "Cooking an elaborate meal due to social pressure",
          pt: "Cozinhar uma refeição elaborada por pressão social",
        },
        correctQuadrant: "q3",
      },
      {
        description: {
          en: "Responding immediately to non-essential household messages",
          pt: "Responder imediatamente a mensagens domésticas não essenciais",
        },
        correctQuadrant: "q3",
      },
      {
        description: {
          en: "Impulsively rearranging furniture",
          pt: "Reorganizar impulsivamente os móveis",
        },
        correctQuadrant: "q3",
      },
      {
        description: {
          en: "Running errands that feel urgent but could wait",
          pt: "Fazer recados que parecem urgentes mas podem esperar",
        },
        correctQuadrant: "q3",
      },
      {
        description: {
          en: "Excessive TV watching instead of doing chores",
          pt: "Assistir TV em excesso em vez de fazer tarefas",
        },
        correctQuadrant: "q4",
      },
      {
        description: {
          en: "Endless scrolling on the phone",
          pt: "Rolagem interminável no telefone",
        },
        correctQuadrant: "q4",
      },
      {
        description: {
          en: "Re-organizing the same drawer repeatedly",
          pt: "Re-organizar a mesma gaveta repetidamente",
        },
        correctQuadrant: "q4",
      },
      {
        description: {
          en: "Playing games while chores pile up",
          pt: "Jogar videogames enquanto as tarefas se acumulam",
        },
        correctQuadrant: "q4",
      },
      {
        description: {
          en: "Researching cleaning methods instead of cleaning",
          pt: "Pesquisar métodos de limpeza em vez de limpar",
        },
        correctQuadrant: "q4",
      },
      {
        description: {
          en: "Over-shopping for unnecessary household items",
          pt: "Comprar demais itens domésticos desnecessários",
        },
        correctQuadrant: "q4",
      },
    ],
  };

  // Use the embedded data
  activities = embeddedData.activities;
  totalActivities = activities.length;

  // Randomize the order of activities
  shuffledActivities = shuffleArray([...activities]);

  // Update progress display
  progressEl.textContent = `0 / ${totalActivities}`;

  // Start the game
  startGame();
}

/**
 * Fisher-Yates shuffle algorithm to randomize array order
 * @param {Array} array - The array to shuffle
 * @returns {Array} - New shuffled array
 */
function shuffleArray(array) {
  // Create a copy to avoid mutating the original array
  const shuffled = [...array];

  // Fisher-Yates shuffle algorithm
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Generate random index between 0 and i
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at positions i and j
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Start the game by displaying the first activity
 */
function startGame() {
  if (activities.length === 0) {
    return;
  }

  displayActivity(0);
}

/**
 * Display the current activity
 * @param {number} index - Index of the activity to display in the shuffled array
 */
function displayActivity(index) {
  // Check if we've reached the end of activities
  if (index >= shuffledActivities.length) {
    endGame();
    return;
  }

  currentActivityIndex = index;
  const activity = shuffledActivities[index];

  // Get the activity description in the current language
  let activityText = activity.description;

  // If description is an object with language keys, get the current language version
  if (
    typeof activity.description === "object" &&
    activity.description !== null
  ) {
    activityText =
      activity.description[currentLanguage] || activity.description.en;
  }

  // Update the activity display
  currentActivityEl.textContent = activityText;

  // Update progress
  progressEl.textContent = `${index + 1} / ${totalActivities}`;

  // Clear any previous feedback
  hideFeedback();

  // Ensure quadrant translations are maintained in the current language
  // updateQuadrantTranslations();

  // Add pulse animation to all quadrants to indicate they're clickable
  document.querySelectorAll(".quadrant").forEach((quadrant) => {
    quadrant.classList.add("pulse");
    setTimeout(() => quadrant.classList.remove("pulse"), 300);
  });
}

/**
 * Handle user selection of a quadrant
 * @param {string} selectedQuadrant - The quadrant the user selected (q1, q2, q3, q4)
 */
function selectQuadrant(selectedQuadrant) {
  const currentActivity = shuffledActivities[currentActivityIndex];

  // Check if the selection is correct
  const isCorrect = selectedQuadrant === currentActivity.correctQuadrant;

  // Update score if correct
  if (isCorrect) {
    updateScore(1);
  }

  // Show visual feedback on the selected quadrant
  showQuadrantFeedback(selectedQuadrant, isCorrect);

  // Show text feedback message
  showTextFeedback(isCorrect, currentActivity);

  // Move to next activity after a short delay
  setTimeout(() => {
    showNextActivity();
  }, 1500);
}

/**
 * Update the score display
 * @param {number} points - Points to add to the score (1 for correct, 0 for incorrect)
 */
function updateScore(points) {
  score += points;
  scoreEl.textContent = score;
}

/**
 * Show visual feedback on the selected quadrant
 * @param {string} selectedQuadrant - The quadrant that was clicked
 * @param {boolean} isCorrect - Whether the selection was correct
 */
function showQuadrantFeedback(selectedQuadrant, isCorrect) {
  // Get the clicked quadrant element
  const quadrantElement = document.querySelector(
    `.quadrant.${selectedQuadrant}`,
  );

  if (!quadrantElement) return;

  // Remove any existing feedback classes
  quadrantElement.classList.remove("feedback-correct", "feedback-incorrect");

  // Add appropriate feedback class
  if (isCorrect) {
    quadrantElement.classList.add("feedback-correct");
  } else {
    quadrantElement.classList.add("feedback-incorrect");
  }

  // Remove feedback after animation duration
  setTimeout(() => {
    quadrantElement.classList.remove("feedback-correct", "feedback-incorrect");
  }, 2500);
}

/**
 * Show text feedback message to the user
 * @param {boolean} isCorrect - Whether the selection was correct
 * @param {Object} activity - The current activity object
 */
function showTextFeedback(isCorrect, activity) {
  if (isCorrect) {
    feedbackEl.textContent = "✅ Correct! Well done!";
    feedbackEl.className = "feedback success";
  } else {
    const correctQuadrantName = getQuadrantName(activity.correctQuadrant);
    feedbackEl.textContent = `❌ Incorrect. This activity belongs in ${correctQuadrantName}.`;
    feedbackEl.className = "feedback error";
  }
}

/**
 * Show the next activity in the sequence
 */
function showNextActivity() {
  const nextIndex = currentActivityIndex + 1;

  // Check if we've reached the end of activities
  if (nextIndex >= shuffledActivities.length) {
    endGame();
    return;
  }

  // Display the next activity
  displayActivity(nextIndex);
}

/**
 * Display feedback message to the user
 * @param {string} message - The feedback message to display
 * @param {string} type - Type of feedback ('success' or 'error')
 */
function showFeedback(message, type) {
  feedbackEl.textContent = message;
  feedbackEl.className = `feedback ${type}`; // Remove 'hidden' class and add type
}

/**
 * Hide the feedback message
 */
function hideFeedback() {
  feedbackEl.className = "feedback hidden";
}

/**
 * Get the human-readable name of a quadrant
 * @param {string} quadrant - The quadrant code (q1, q2, q3, q4)
 * @returns {string} The human-readable quadrant name
 */
function getQuadrantName(quadrant) {
  if (!translations || !translations[currentLanguage]) {
    // Fallback to English if translations not loaded
    const names = {
      q1: "Q1 (Important & Urgent)",
      q2: "Q2 (Important & Not Urgent)",
      q3: "Q3 (Not Important & Urgent)",
      q4: "Q4 (Not Important & Not Urgent)",
    };
    return names[quadrant] || quadrant;
  }

  const t = translations[currentLanguage];

  const names = {
    q1: t.q1Title,
    q2: t.q2Title,
    q3: t.q3Title,
    q4: t.q4Title,
  };

  return names[quadrant] || quadrant;
}

/**
 * Apply translations to all UI elements
 */
function applyTranslations() {
  if (!translations || !translations[currentLanguage]) {
    console.error("Translations not loaded or current language not found");
    return;
  }

  const t = translations[currentLanguage];

  // Update page title
  document.title = t.title;

  // Update header elements
  const header = document.querySelector(".header");
  if (header) {
    const h1 = header.querySelector("h1");
    const instructions = header.querySelector(".instructions");

    if (h1) h1.textContent = t.title;
    if (instructions) instructions.innerHTML = t.instructions;
  }

  // Update score board labels
  const scoreLabel = document.querySelector(".score-label");
  const activitiesLabel = document.querySelector(
    ".score-item:nth-child(2) .score-label",
  );

  if (scoreLabel) scoreLabel.textContent = t.scoreLabel;
  if (activitiesLabel) activitiesLabel.textContent = t.activitiesLabel;

  // Update activity section
  const activitySection = document.querySelector(".activity-section h2");
  if (activitySection) activitySection.textContent = t.currentActivityTitle;

  // Update matrix container
  const matrixTitle = document.querySelector(".matrix-container h2");
  if (matrixTitle) matrixTitle.textContent = t.timeMatrixTitle;

  // Update help button text
  const helpBtn = document.querySelector(".help-btn");
  if (helpBtn) helpBtn.title = t.helpButton;

  // Update quadrant titles and descriptions in the matrix
  updateQuadrantTranslations();

  // Update help modal content
  updateHelpModalTranslations();

  // Update language selector options
  updateLanguageSelectorOptions();
}

/**
 * Update help modal content with current language
 */
function updateHelpModalTranslations() {
  if (!translations || !translations[currentLanguage]) return;

  const t = translations[currentLanguage];

  // Update help modal title
  const helpModalTitle = document.getElementById("help-modal-title");
  if (helpModalTitle) helpModalTitle.textContent = t.helpModalTitle;

  // Update help sections
  const howToPlayTitle = document.getElementById("how-to-play-title");
  if (howToPlayTitle) howToPlayTitle.textContent = t.howToPlay;

  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const step3 = document.getElementById("step3");
  const step4 = document.getElementById("step4");
  const step5 = document.getElementById("step5");

  if (step1) step1.textContent = t.howToPlayStep1;
  if (step2) step2.textContent = t.howToPlayStep2;
  if (step3) step3.textContent = t.howToPlayStep3;
  if (step4) step4.textContent = t.howToPlayStep4;
  if (step5) step5.textContent = t.howToPlayStep5;

  // Update quadrant guide
  const quadrantGuideTitle = document.getElementById("quadrant-guide-title");
  if (quadrantGuideTitle) quadrantGuideTitle.textContent = t.quadrantGuide;

  const q1Title = document.getElementById("q1-title");
  const q1Examples = document.getElementById("q1-examples");
  const q1Strategy = document.getElementById("q1-strategy");

  const q2Title = document.getElementById("q2-title");
  const q2Examples = document.getElementById("q2-examples");
  const q2Strategy = document.getElementById("q2-strategy");

  const q3Title = document.getElementById("q3-title");
  const q3Examples = document.getElementById("q3-examples");
  const q3Strategy = document.getElementById("q3-strategy");

  const q4Title = document.getElementById("q4-title");
  const q4Examples = document.getElementById("q4-examples");
  const q4Strategy = document.getElementById("q4-strategy");

  if (q1Title) q1Title.textContent = t.q1Title;
  if (q1Examples) q1Examples.textContent = t.q1Examples;
  if (q1Strategy) q1Strategy.textContent = t.q1Strategy;

  if (q2Title) q2Title.textContent = t.q2Title;
  if (q2Examples) q2Examples.textContent = t.q2Examples;
  if (q2Strategy) q2Strategy.textContent = t.q2Strategy;

  if (q3Title) q3Title.textContent = t.q3Title;
  if (q3Examples) q3Examples.textContent = t.q3Examples;
  if (q3Strategy) q3Strategy.textContent = t.q3Strategy;

  if (q4Title) q4Title.textContent = t.q4Title;
  if (q4Examples) q4Examples.textContent = t.q4Examples;
  if (q4Strategy) q4Strategy.textContent = t.q4Strategy;

  // Update scoring section
  const scoringTitle = document.getElementById("scoring-title");
  if (scoringTitle) scoringTitle.textContent = t.scoringTitle;

  const scoringCorrect = document.getElementById("scoring-correct");
  const scoringIncorrect = document.getElementById("scoring-incorrect");
  const scoringProgress = document.getElementById("scoring-progress");

  if (scoringCorrect) scoringCorrect.textContent = t.scoringCorrect;
  if (scoringIncorrect) scoringIncorrect.textContent = t.scoringIncorrect;
  if (scoringProgress) scoringProgress.textContent = t.scoringProgress;

  // Update learning goals
  const learningGoalsTitle = document.getElementById("learning-goals-title");
  if (learningGoalsTitle) learningGoalsTitle.textContent = t.learningGoals;

  const learningGoal1 = document.getElementById("learning-goal1");
  const learningGoal2 = document.getElementById("learning-goal2");
  const learningGoal3 = document.getElementById("learning-goal3");
  const learningGoal4 = document.getElementById("learning-goal4");

  if (learningGoal1) learningGoal1.textContent = t.learningGoal1;
  if (learningGoal2) learningGoal2.textContent = t.learningGoal2;
  if (learningGoal3) learningGoal3.textContent = t.learningGoal3;
  if (learningGoal4) learningGoal4.textContent = t.learningGoal4;

  // Update pro tip
  const proTipTitle = document.getElementById("pro-tip-title");
  const proTipText = document.getElementById("pro-tip-text");

  if (proTipTitle) proTipTitle.textContent = t.proTip;
  if (proTipText) proTipText.textContent = t.proTipText;
}

/**
 * Update language selector options
 */
function updateLanguageSelectorOptions() {
  if (!languageSelectEl) return;

  // Clear existing options
  languageSelectEl.innerHTML = "";

  // Add English option
  const enOption = document.createElement("option");
  enOption.value = "en";
  enOption.textContent = translations.en.english;
  languageSelectEl.appendChild(enOption);

  // Add Portuguese option
  const ptOption = document.createElement("option");
  ptOption.value = "pt";
  ptOption.textContent = translations.pt.portuguese;
  languageSelectEl.appendChild(ptOption);

  // Set current language
  languageSelectEl.value = currentLanguage;
}

/**
 * Update quadrant titles and descriptions in the matrix with current language
 */
function updateQuadrantTranslations() {
  if (!translations || !translations[currentLanguage]) {
    console.log("Translations not loaded or current language not found");
    return;
  }

  const t = translations[currentLanguage];
  console.log("Updating quadrant translations for language:", currentLanguage);
  console.log("Translation data:", t);

  // Update Q1 quadrant
  const q1Header = document.querySelector(".quadrant.q1 .quadrant-header h3");
  const q1Subtitle = document.querySelector(".quadrant.q1 .quadrant-header p");
  const q1Description = document.querySelector(
    ".quadrant.q1 .quadrant-description",
  );
  const q1Button = document.querySelector(".quadrant.q1 .select-btn");

  console.log("Q1 elements found:", {
    q1Header,
    q1Subtitle,
    q1Description,
    q1Button,
  });
  console.log("Q1 translations:", {
    q1Subtitle: t.q1Subtitle,
    q1Description: t.q1Description,
    q1Button: t.q1Button,
  });

  if (q1Header) q1Header.textContent = "Q1";
  // if (q1Subtitle) q1Subtitle.textContent = t.q1Subtitle || 'Important & Urgent';
  // if (q1Description) q1Description.textContent = t.q1Description || 'Crises, deadlines, emergencies';
  // if (q1Button) q1Button.textContent = t.q1Button || 'Select Q1';
  if (q1Subtitle) q1Subtitle.textContent = t.q1Title.split(": ")[1];
  if (q1Description) q1Description.textContent = t.q1Examples;
  if (q1Button) q1Button.textContent = `${t.q1Title.split(":")[0]}`;

  // Update Q2 quadrant
  const q2Header = document.querySelector(".quadrant.q2 .quadrant-header h3");
  const q2Subtitle = document.querySelector(".quadrant.q2 .quadrant-header p");
  const q2Description = document.querySelector(
    ".quadrant.q2 .quadrant-description",
  );
  const q2Button = document.querySelector(".quadrant.q2 .select-btn");

  console.log("Q2 elements found:", {
    q1Header,
    q1Subtitle,
    q1Description,
    q1Button,
  });
  console.log("Q2 translations:", {
    q1Subtitle: t.q1Subtitle,
    q1Description: t.q1Description,
    q1Button: t.q1Button,
  });

  if (q2Header) q2Header.textContent = "Q2";
//   if (q2Subtitle)
//     q2Subtitle.textContent = t.q2Subtitle || "Important & Not Urgent";
//   if (q2Description)
//     q2Description.textContent =
//       t.q2Description || "Planning, prevention, values";
//   if (q2Button) q2Button.textContent = t.q2Button || "Select Q2";
if (q2Subtitle) q2Subtitle.textContent = t.q2Title.split(': ')[1];
if (q2Description) q2Description.textContent = t.q2Examples;
if (q2Button) q2Button.textContent = `${t.q2Title.split(':')[0]}`;


  // Update Q3 quadrant
  const q3Header = document.querySelector(".quadrant.q3 .quadrant-header h3");
  const q3Subtitle = document.querySelector(".quadrant.q3 .quadrant-header p");
  const q3Description = document.querySelector(
    ".quadrant.q3 .quadrant-description",
  );
  const q3Button = document.querySelector(".quadrant.q3 .select-btn");

  if (q3Header) q3Header.textContent = "Q3";
//   if (q3Subtitle)
//     q3Subtitle.textContent = t.q3Subtitle || "Not Important & Urgent";
//   if (q3Description)
//     q3Description.textContent = t.q3Description || "Interruptions, some calls";
//   if (q3Button) q3Button.textContent = t.q3Button || "Select Q3";
if (q3Subtitle) q3Subtitle.textContent = t.q3Title.split(': ')[1];
if (q3Description) q3Description.textContent = t.q3Examples;
if (q3Button) q3Button.textContent = `${t.q3Title.split(':')[0]}`;


  // Update Q4 quadrant
  const q4Header = document.querySelector(".quadrant.q4 .quadrant-header h3");
  const q4Subtitle = document.querySelector(".quadrant.q4 .quadrant-header p");
  const q4Description = document.querySelector(
    ".quadrant.q4 .quadrant-description",
  );
  const q4Button = document.querySelector(".quadrant.q4 .select-btn");

  if (q4Header) q4Header.textContent = "Q4";
//   if (q4Subtitle)
//     q4Subtitle.textContent = t.q4Subtitle || "Not Important & Not Urgent";
//   if (q4Description)
//     q4Description.textContent =
//       t.q4Description || "Time wasters, entertainment";
//   if (q4Button) q4Button.textContent = t.q4Button || "Select Q4";
if (q4Subtitle) q4Subtitle.textContent = t.q4Title.split(': ')[1];
if (q4Description) q4Description.textContent = t.q4Examples;
if (q4Button) q4Button.textContent = `${t.q4Title.split(':')[0]}`;


  console.log("Quadrant translations updated successfully");
}

/**
 * Change language and update UI
 * @param {string} language - The language code (e.g., 'en', 'pt')
 */
function changeLanguage(language) {
  if (!translations || !translations[language]) {
    console.error("Language not available:", language);
    return;
  }

  // Update current language
  currentLanguage = language;

  // Save to localStorage
  localStorage.setItem("timeMatrixLanguage", language);

  // Apply translations
  applyTranslations();

  // Update quadrant translations specifically
  // updateQuadrantTranslations();

  // Reset the game to start from the beginning with the new language
  resetGameToLanguage();

  // Update help modal if open
  const modal = document.getElementById("help-modal");
  if (modal && modal.classList.contains("active")) {
    updateHelpModalTranslations();
  }
}

/**
 * Reset the game to start from the beginning with the current language
 */
function resetGameToLanguage() {
  score = 0;
  currentActivityIndex = 0;
  scoreEl.textContent = "0";

  // Show the matrix again
  document.querySelector(".time-matrix").style.display = "grid";

  // Reset progress display
  progressEl.textContent = `0 / ${totalActivities}`;

  // Clear any previous feedback
  hideFeedback();

  // Start the game from the beginning with the current language
  if (activities.length > 0) {
    displayActivity(0);
  }
}

/**
 * Toggle the help modal visibility
 */
function toggleHelp() {
  const modal = document.getElementById("help-modal");

  if (modal) {
    if (modal.classList.contains("active")) {
      modal.classList.remove("active");
      // Remove active class from body to prevent scrolling issues
      document.body.style.overflow = "";
    } else {
      modal.classList.add("active");
      // Prevent background scrolling when modal is open
      document.body.style.overflow = "hidden";

      // Update help modal content if language has changed
      updateHelpModalTranslations();
    }
  }
}

/**
 * Show text feedback message to the user with translations
 * @param {boolean} isCorrect - Whether the selection was correct
 * @param {Object} activity - The current activity object
 */
function showTextFeedback(isCorrect, activity) {
  if (!translations || !translations[currentLanguage]) {
    // Fallback to default English if translations not loaded
    if (isCorrect) {
      feedbackEl.textContent = "✅ Correct! Well done!";
      feedbackEl.className = "feedback success";
    } else {
      const correctQuadrantName = getQuadrantName(activity.correctQuadrant);
      feedbackEl.textContent = `❌ Incorrect. This activity belongs in ${correctQuadrantName}.`;
      feedbackEl.className = "feedback error";
    }
    return;
  }

  const t = translations[currentLanguage];

  if (isCorrect) {
    feedbackEl.textContent = t.correctFeedback;
    feedbackEl.className = "feedback success";
  } else {
    const correctQuadrantName = getQuadrantName(activity.correctQuadrant);
    feedbackEl.textContent = `${t.incorrectFeedback} ${correctQuadrantName}.`;
    feedbackEl.className = "feedback error";
  }
}

/**
 * End the game and display final results with translations
 */
function endGame() {
  if (!translations || !translations[currentLanguage]) {
    // Fallback to default English if translations not loaded
    currentActivityEl.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: var(--primary-color); margin-bottom: 10px;">Game Complete!</h3>
                <p style="font-size: 1.2rem; margin-bottom: 10px;">Final Score: ${score} / ${totalActivities}</p>
                <p style="color: #666;">Accuracy: ${Math.round((score / totalActivities) * 100)}%</p>
                <button onclick="resetGame()" style="margin-top: 20px; padding: 10px 20px; background-color: var(--secondary-color); color: white; border: none; border-radius: 4px; cursor: pointer;">Play Again</button>
            </div>
        `;
    document.querySelector(".time-matrix").style.display = "none";
    return;
  }

  const t = translations[currentLanguage];

  currentActivityEl.innerHTML = `
        <div style="text-align: center;">
            <h3 style="color: var(--primary-color); margin-bottom: 10px;">${t.gameComplete}</h3>
            <p style="font-size: 1.2rem; margin-bottom: 10px;">${t.finalScore} ${score} / ${totalActivities}</p>
            <p style="color: #666;">${t.accuracy}: ${Math.round((score / totalActivities) * 100)}%</p>
            <button onclick="resetGame()" style="margin-top: 20px; padding: 10px 20px; background-color: var(--secondary-color); color: white; border: none; border-radius: 4px; cursor: pointer;">${t.playAgain}</button>
        </div>
    `;

  // Hide the matrix when game is over
  document.querySelector(".time-matrix").style.display = "none";
}

/**
 * Reset the game to start over
 */
function resetGame() {
  score = 0;
  currentActivityIndex = 0;
  scoreEl.textContent = "0";

  // Show the matrix again
  document.querySelector(".time-matrix").style.display = "grid";

  // Start the game again
  startGame();
}

/**
 * Keyboard navigation support
 * Allow users to select quadrants using number keys (1-4)
 */
document.addEventListener("keydown", function (event) {
  // Only respond to number keys when game is active
  if (event.key >= "1" && event.key <= "4") {
    const quadrantMap = {
      1: "q1",
      2: "q2",
      3: "q3",
      4: "q4",
    };

    const quadrant = quadrantMap[event.key];
    selectQuadrant(quadrant);
  }
});

// Export functions for potential use in other scripts (optional)
window.selectQuadrant = selectQuadrant;
window.resetGame = resetGame;
