export const question = document.querySelector("#question");
export const answer = document.querySelector("#answer");
export const explanation = document.querySelector("#explanation");
export const answerInput = document.querySelector("#answerInput");
export const answerFeedback = document.querySelector("#answerFeedback");
export const direction = document.querySelector("#direction");
export const contextBadge = document.querySelector("#contextBadge");
export const directionOptions = document.querySelectorAll(
    'input[name="direction"]'
);
export const topicButtons = document.querySelectorAll(".topic-selector .topic-btn");
export const subtopicSelector = document.querySelector(".subtopic-selector");
export const subtopicButtonsRow = document.querySelector("#subtopicButtonsRow");
// Die Kategorie-Buttons werden je nach gewähltem Thema dynamisch neu erzeugt
// (siehe renderCategoryButtons in render.js) – deshalb hier keine statische
// NodeList, sondern der Container fürs Klick-Delegieren in main.js.
export const categorySelector = document.querySelector(".category-selector");
export const categoryAllBtn = document.querySelector("#categoryAllBtn");
export const categoryButtonsRow = document.querySelector("#categoryButtonsRow");
export const showAnswerBtn = document.querySelector("#showAnswerBtn");
export const boxes = document.querySelector("#boxes");
export const status = document.querySelector("#status");
export const resetProgressBtn = document.querySelector("#resetProgressBtn");
export const leitnerInfoBtn = document.querySelector("#leitnerInfoBtn");
export const freeModeInfoBtn = document.querySelector("#freeModeInfoBtn");
export const freeModeStartBtn = document.querySelector("#freeModeStartBtn");
export const freeModeContent = document.querySelector("#freeModeContent");
export const freeModeBackBtn = document.querySelector("#freeModeBackBtn");

export const weeklyDirection = document.querySelector("#weeklyDirection");
export const weeklyContextBadge = document.querySelector("#weeklyContextBadge");
export const weeklyQuestion = document.querySelector("#weeklyQuestion");
export const weeklyAnswerInput = document.querySelector("#weeklyAnswerInput");
export const weeklyAnswerFeedback = document.querySelector(
    "#weeklyAnswerFeedback"
);
export const weeklyAnswer = document.querySelector("#weeklyAnswer");
export const weeklyExplanation = document.querySelector("#weeklyExplanation");
export const weeklyShowAnswerBtn = document.querySelector(
    "#weeklyShowAnswerBtn"
);
export const weeklyStatus = document.querySelector("#weeklyStatus");
export const weeklyGroups = document.querySelector("#weeklyGroups");
export const weeklyResetProgressBtn = document.querySelector(
    "#weeklyResetProgressBtn"
);
export const weeklyModeInfoBtn = document.querySelector("#weeklyModeInfoBtn");
export const weeklyModeStartBtn = document.querySelector("#weeklyModeStartBtn");
export const weeklyModeContent = document.querySelector("#weeklyModeContent");
export const weeklyModeBackBtn = document.querySelector("#weeklyModeBackBtn");

export const infoDialog = document.querySelector("#infoDialog");
export const infoDialogTitle = document.querySelector("#infoDialogTitle");
export const infoDialogContent = document.querySelector("#infoDialogContent");
export const infoDialogCloseBtn = document.querySelector("#infoDialogCloseBtn");
