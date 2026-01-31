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
let activities = [];
let currentActivityIndex = 0;
let score = 0;
let totalActivities = 0;

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
 * Uses fetch API to load the JSON data
 */
async function loadActivities() {
    try {
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
        
        activities = data.activities;
        totalActivities = activities.length;
        
        // Update progress display
        progressEl.textContent = `0 / ${totalActivities}`;
        
        // Start the game
        startGame();
        
    } catch (error) {
        console.error('Error loading activities:', error);
        currentActivityEl.innerHTML = `
            <div style="color: red; font-weight: bold;">
                Error loading activities: ${error.message}<br>
                Please check that data.json exists and contains valid activity data.
            </div>
        `;
    }
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
 * @param {number} index - Index of the activity to display
 */
function displayActivity(index) {
    // Check if we've reached the end of activities
    if (index >= activities.length) {
        endGame();
        return;
    }
    
    currentActivityIndex = index;
    const activity = activities[index];
    
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
    const currentActivity = activities[currentActivityIndex];
    
    // Check if the selection is correct
    const isCorrect = selectedQuadrant === currentActivity.correctQuadrant;
    
    if (isCorrect) {
        score++;
        scoreEl.textContent = score;
        showFeedback('Correct! Well done!', 'success');
    } else {
        showFeedback(`Incorrect. This activity belongs in ${getQuadrantName(currentActivity.correctQuadrant)}.`, 'error');
    }
    
    // Move to next activity after a short delay
    setTimeout(() => {
        displayActivity(currentActivityIndex + 1);
    }, 1500);
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