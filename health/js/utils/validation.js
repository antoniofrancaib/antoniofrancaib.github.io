// Form validation helpers

// Validate meal form data
function validateMealForm(formData) {
    const errors = {};

    if (!formData.name || !formData.name.trim()) {
        errors.name = 'Please enter a meal name';
    }

    if (!formData.calories || isNaN(parseInt(formData.calories))) {
        errors.calories = 'Please enter a valid number for calories';
    }

    if (!formData.protein || isNaN(parseFloat(formData.protein))) {
        errors.protein = 'Please enter a valid number for protein';
    }

    if (!formData.carbs || isNaN(parseFloat(formData.carbs))) {
        errors.carbs = 'Please enter a valid number for carbs';
    }

    if (!formData.fat || isNaN(parseFloat(formData.fat))) {
        errors.fat = 'Please enter a valid number for fat';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// Validate biomarker form data
function validateBiomarkerForm(formData) {
    const errors = {};

    if (!formData.date) {
        errors.date = 'Please select a date';
    }

    if (!formData.biomarker) {
        errors.biomarker = 'Please select a biomarker';
    }

    if (!formData.value || isNaN(parseFloat(formData.value))) {
        errors.value = 'Please enter a valid number';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// Validate camera upload form
function validateCameraForm(formData) {
    const errors = {};

    if (!formData.photo || formData.photo.length === 0) {
        errors.photo = 'Please select a photo';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// Display validation errors in form
function displayFormErrors(formId, errors) {
    // Clear existing errors
    document.querySelectorAll(`#${formId} .form-error`).forEach(el => {
        el.classList.remove('active');
        el.textContent = '';
    });

    // Display new errors
    Object.keys(errors).forEach(field => {
        const errorElement = document.getElementById(`${field}-error`);
        if (errorElement) {
            errorElement.textContent = errors[field];
            errorElement.classList.add('active');
        }
    });
}

// Clear all form errors
function clearFormErrors(formId) {
    document.querySelectorAll(`#${formId} .form-error`).forEach(el => {
        el.classList.remove('active');
        el.textContent = '';
    });
}
