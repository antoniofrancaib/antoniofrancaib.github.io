// Mind/cognitive tracking functionality

// Initialize mind tab features
function initMindFeatures() {
    updateCognitiveMetrics();
}

// Update cognitive metrics
function updateCognitiveMetrics() {
    // Update deep work progress
    const deepworkCurrent = document.getElementById('deepwork-current');
    const deepworkProgress = document.getElementById('deepwork-progress');

    if (deepworkCurrent && deepworkProgress) {
        const timeString = deepworkCurrent.textContent;
        const hours = parseFloat(timeString.split('h')[0]);
        const minutes = parseFloat(timeString.split('h')[1].split('m')[0]);
        const totalHours = hours + (minutes / 60);

        const percent = (totalHours / CONFIG.ACTIVITY_GOALS.deepWorkHours) * 100;
        deepworkProgress.style.width = `${Math.min(percent, 100)}%`;

        if (percent > 100) {
            deepworkProgress.classList.add('over');
        } else if (percent > 80) {
            deepworkProgress.classList.add('warning');
        }
    }

    // Update screen time progress
    const screentimeCurrent = document.getElementById('screentime-current');
    const screentimeProgress = document.getElementById('screentime-progress');

    if (screentimeCurrent && screentimeProgress) {
        const timeString = screentimeCurrent.textContent;
        const hours = parseFloat(timeString.split('h')[0]);
        const minutes = parseFloat(timeString.split('h')[1].split('m')[0]);
        const totalHours = hours + (minutes / 60);

        const percent = (totalHours / CONFIG.ACTIVITY_GOALS.screenTimeLimit) * 100;
        screentimeProgress.style.width = `${Math.min(percent, 100)}%`;

        if (percent > 100) {
            screentimeProgress.classList.add('over');
        } else if (percent > 80) {
            screentimeProgress.classList.add('warning');
        }
    }

    // Update focus ratio
    const focusratioCurrent = document.getElementById('focusratio-current');
    const focusratioProgress = document.getElementById('focusratio-progress');

    if (focusratioCurrent && focusratioProgress) {
        const ratio = parseFloat(focusratioCurrent.textContent.replace('%', '')) / 100;
        const percent = ratio * 100;
        focusratioProgress.style.width = `${percent}%`;
    }
}

// Update Google Calendar deep work data
function updateDeepWorkFromCalendar(calendarData) {
    // Placeholder for Google Calendar API integration
    console.log('Deep work data from calendar:', calendarData);
}

// Update RescueTime screen time data
function updateScreenTimeFromRescueTime(screenTimeData) {
    // Placeholder for RescueTime API integration
    console.log('Screen time data:', screenTimeData);
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMindFeatures,
        updateCognitiveMetrics,
        updateDeepWorkFromCalendar,
        updateScreenTimeFromRescueTime
    };
}
