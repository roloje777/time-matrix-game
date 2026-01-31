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
let activities = [];           // All activities from JSON
let shuffledActivities = [];   // Randomized order of activities
let currentActivityIndex = 0;  // Current position in shuffled array
let score = 0;                 // User's correct answers
let totalActivities = 0;       // Total number of activities

// DOM elements
const currentActivityEl = document.getElementById('current-activity');
const scoreEl = document.getElementById('score');
const progressEl = document.getElementById('progress');
const feedbackEl = document.getElementById('feedback');

/**
 * Initialize the game when the page loads
 */
document.addEventListener('DOMContentLoaded', function() {
    loadActivities();
});

/**
 * Load activities from data.json file
 * Uses fetch API to load the JSON data with fallback for file:// protocol
 */
async function loadActivities() {
    try {
        // Try to fetch the JSON file
        const response = await fetch('data.json');
        
        // Check if the fetch was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate that we have activities
        if (!data.activities || !Array.isArray(data.activities) || data.activities.length === 0) {
            throw new Error('No activities found in data.json');
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
        console.error('Error loading activities:', error);
        
        // Fallback: Use embedded data if fetch fails (common with file:// protocol)
        if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
            console.log('Using fallback embedded data due to fetch restrictions');
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
    // Embedded data as fallback
    const embeddedData = {
        "activities": [
            {
                "description": "Clean up after a water leak or spill",
                "correctQuadrant": "q1"
            },
            {
                "description": "Cook dinner because the family needs to eat now",
                "correctQuadrant": "q1"
            },
            {
                "description": "Wash dishes when there are none left for the next meal",
                "correctQuadrant": "q1"
            },
            {
                "description": "Emergency grocery run due to no food at home",
                "correctQuadrant": "q1"
            },
            {
                "description": "Fix a broken appliance essential for daily life",
                "correctQuadrant": "q1"
            },
            {
                "description": "Take out overflowing trash",
                "correctQuadrant": "q1"
            },
            {
                "description": "Handle a sudden pest problem",
                "correctQuadrant": "q1"
            },
            {
                "description": "Weekly meal planning",
                "correctQuadrant": "q2"
            },
            {
                "description": "Regular house cleaning schedule",
                "correctQuadrant": "q2"
            },
            {
                "description": "Organizing cupboards and storage areas",
                "correctQuadrant": "q2"
            },
            {
                "description": "Preventive home maintenance",
                "correctQuadrant": "q2"
            },
            {
                "description": "Batch cooking meals for the week",
                "correctQuadrant": "q2"
            },
            {
                "description": "Decluttering unused items",
                "correctQuadrant": "q2"
            },
            {
                "description": "Creating a household budget",
                "correctQuadrant": "q2"
            },
            {
                "description": "Teaching children household routines",
                "correctQuadrant": "q2"
            },
            {
                "description": "Deep cleaning bathrooms and kitchen appliances",
                "correctQuadrant": "q2"
            },
            {
                "description": "Cleaning the house suddenly because guests might arrive",
                "correctQuadrant": "q3"
            },
            {
                "description": "Re-cleaning already clean areas unnecessarily",
                "correctQuadrant": "q3"
            },
            {
                "description": "Cooking an elaborate meal due to social pressure",
                "correctQuadrant": "q3"
            },
            {
                "description": "Responding immediately to non-essential household messages",
                "correctQuadrant": "q3"
            },
            {
                "description": "Impulsively rearranging furniture",
                "correctQuadrant": "q3"
            },
            {
                "description": "Running errands that feel urgent but could wait",
                "correctQuadrant": "q3"
            },
            {
                "description": "Excessive TV watching instead of doing chores",
                "correctQuadrant": "q4"
            },
            {
                "description": "Endless scrolling on the phone",
                "correctQuadrant": "q4"
            },
            {
                "description": "Re-organizing the same drawer repeatedly",
                "correctQuadrant": "q4"
            },
            {
                "description": "Playing games while chores pile up",
                "correctQuadrant": "q4"
            },
            {
                "description": "Researching cleaning methods instead of cleaning",
                "correctQuadrant": "q4"
            },
            {
                "description": "Over-shopping for unnecessary household items",
                "correctQuadrant": "q4"
            }
        ]
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
    
    // Update the activity display
    currentActivityEl.textContent = activity.description;
    
    // Update progress
    progressEl.textContent = `${index + 1} / ${totalActivities}`;
    
    // Clear any previous feedback
    hideFeedback();
    
    // Add pulse animation to all quadrants to indicate they're clickable
    document.querySelectorAll('.quadrant').forEach(quadrant => {
        quadrant.classList.add('pulse');
        setTimeout(() => quadrant.classList.remove('pulse'), 300);
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
    const quadrantElement = document.querySelector(`.quadrant.${selectedQuadrant}`);
    
    if (!quadrantElement) return;
    
    // Remove any existing feedback classes
    quadrantElement.classList.remove('feedback-correct', 'feedback-incorrect');
    
    // Add appropriate feedback class
    if (isCorrect) {
        quadrantElement.classList.add('feedback-correct');
    } else {
        quadrantElement.classList.add('feedback-incorrect');
    }
    
    // Remove feedback after animation duration
    setTimeout(() => {
        quadrantElement.classList.remove('feedback-correct', 'feedback-incorrect');
    }, 1000);
}

/**
 * Show text feedback message to the user
 * @param {boolean} isCorrect - Whether the selection was correct
 * @param {Object} activity - The current activity object
 */
function showTextFeedback(isCorrect, activity) {
    if (isCorrect) {
        feedbackEl.textContent = '✅ Correct! Well done!';
        feedbackEl.className = 'feedback success';
    } else {
        const correctQuadrantName = getQuadrantName(activity.correctQuadrant);
        feedbackEl.textContent = `❌ Incorrect. This activity belongs in ${correctQuadrantName}.`;
        feedbackEl.className = 'feedback error';
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
    feedbackEl.className = 'feedback hidden';
}

/**
 * Get the human-readable name of a quadrant
 * @param {string} quadrant - The quadrant code (q1, q2, q3, q4)
 * @returns {string} The human-readable quadrant name
 */
function getQuadrantName(quadrant) {
    const names = {
        'q1': 'Q1 (Important & Urgent)',
        'q2': 'Q2 (Important & Not Urgent)', 
        'q3': 'Q3 (Not Important & Urgent)',
        'q4': 'Q4 (Not Important & Not Urgent)'
    };
    
    return names[quadrant] || quadrant;
}

/**
 * End the game and display final results
 */
function endGame() {
    currentActivityEl.innerHTML = `
        <div style="text-align: center;">
            <h3 style="color: var(--primary-color); margin-bottom: 10px;">Game Complete!</h3>
            <p style="font-size: 1.2rem; margin-bottom: 10px;">Final Score: ${score} / ${totalActivities}</p>
            <p style="color: #666;">Accuracy: ${Math.round((score / totalActivities) * 100)}%</p>
            <button onclick="resetGame()" style="margin-top: 20px; padding: 10px 20px; background-color: var(--secondary-color); color: white; border: none; border-radius: 4px; cursor: pointer;">Play Again</button>
        </div>
    `;
    
    // Hide the matrix when game is over
    document.querySelector('.time-matrix').style.display = 'none';
}

/**
 * Reset the game to start over
 */
function resetGame() {
    score = 0;
    currentActivityIndex = 0;
    scoreEl.textContent = '0';
    
    // Show the matrix again
    document.querySelector('.time-matrix').style.display = 'grid';
    
    // Start the game again
    startGame();
}

/**
 * Keyboard navigation support
 * Allow users to select quadrants using number keys (1-4)
 */
document.addEventListener('keydown', function(event) {
    // Only respond to number keys when game is active
    if (event.key >= '1' && event.key <= '4') {
        const quadrantMap = {
            '1': 'q1',
            '2': 'q2', 
            '3': 'q3',
            '4': 'q4'
        };
        
        const quadrant = quadrantMap[event.key];
        selectQuadrant(quadrant);
    }
});

// Export functions for potential use in other scripts (optional)
window.selectQuadrant = selectQuadrant;
window.resetGame = resetGame;