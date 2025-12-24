// Modal management functionality

// Upload Modal functionality
function initUploadModal() {
    const uploadBtn = document.getElementById('upload-btn');
    const modal = document.getElementById('upload-modal');
    const modalClose = document.getElementById('modal-close');
    const cancelBtn = document.getElementById('cancel-btn');
    const uploadForm = document.getElementById('upload-form');

    if (!uploadBtn || !modal) return;

    uploadBtn.addEventListener('click', () => {
        modal.classList.add('active');
        lucide.createIcons();
    });

    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
        uploadForm.reset();
        clearErrors();
    });

    cancelBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        uploadForm.reset();
        clearErrors();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            uploadForm.reset();
            clearErrors();
        }
    });

    // Form validation and submission
    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const dateInput = document.getElementById('date-input');
        const biomarkerSelect = document.getElementById('biomarker-select');
        const valueInput = document.getElementById('value-input');

        clearErrors();

        let isValid = true;

        // Validate date
        if (!dateInput.value) {
            showError('date-error');
            isValid = false;
        }

        // Validate biomarker
        if (!biomarkerSelect.value) {
            showError('biomarker-error');
            isValid = false;
        }

        // Validate value
        if (!valueInput.value || isNaN(parseFloat(valueInput.value))) {
            showError('value-error');
            isValid = false;
        }

        if (isValid) {
            const formData = {
                date: dateInput.value,
                biomarker: biomarkerSelect.value,
                value: parseFloat(valueInput.value)
            };

            console.log('Form submitted:', formData);

            // Close modal and reset form
            modal.classList.remove('active');
            uploadForm.reset();
        }
    });
}

// Meal Modal functionality
function initMealModal() {
    const addMealBtn = document.getElementById('add-meal-btn');
    const mealModal = document.getElementById('meal-modal');
    const mealModalClose = document.getElementById('meal-modal-close');
    const mealCancelBtn = document.getElementById('meal-cancel-btn');
    const mealForm = document.getElementById('meal-form');

    if (!addMealBtn || !mealModal) return;

    // Open meal modal
    addMealBtn.addEventListener('click', () => {
        mealModal.classList.add('active');
        lucide.createIcons();
    });

    // Close meal modal
    mealModalClose.addEventListener('click', () => {
        mealModal.classList.remove('active');
        mealForm.reset();
        clearErrors();
    });

    mealCancelBtn.addEventListener('click', () => {
        mealModal.classList.remove('active');
        mealForm.reset();
        clearErrors();
    });

    // Close modal on overlay click
    mealModal.addEventListener('click', (e) => {
        if (e.target === mealModal) {
            mealModal.classList.remove('active');
            mealForm.reset();
            clearErrors();
        }
    });

    // Handle meal form submission
    mealForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const mealNameInput = document.getElementById('meal-name-input');
        const mealCaloriesInput = document.getElementById('meal-calories-input');
        const mealProteinInput = document.getElementById('meal-protein-input');
        const mealCarbsInput = document.getElementById('meal-carbs-input');
        const mealFatInput = document.getElementById('meal-fat-input');

        clearErrors();

        let isValid = true;

        // Validate inputs
        if (!mealNameInput.value.trim()) {
            showError('meal-name-error');
            isValid = false;
        }

        if (!mealCaloriesInput.value || isNaN(parseInt(mealCaloriesInput.value))) {
            showError('meal-calories-error');
            isValid = false;
        }

        if (!mealProteinInput.value || isNaN(parseFloat(mealProteinInput.value))) {
            showError('meal-protein-error');
            isValid = false;
        }

        if (!mealCarbsInput.value || isNaN(parseFloat(mealCarbsInput.value))) {
            showError('meal-carbs-error');
            isValid = false;
        }

        if (!mealFatInput.value || isNaN(parseFloat(mealFatInput.value))) {
            showError('meal-fat-error');
            isValid = false;
        }

        if (isValid) {
            const mealData = {
                name: mealNameInput.value.trim(),
                calories: parseInt(mealCaloriesInput.value),
                protein: parseFloat(mealProteinInput.value),
                carbs: parseFloat(mealCarbsInput.value),
                fat: parseFloat(mealFatInput.value)
            };

            // Save to Supabase first
            const savedMeal = await saveMealToSupabase(mealData);
            if (savedMeal) {
                mealData.id = savedMeal.id;
                mealData.supabaseId = savedMeal.id;
            }

            // Add meal to list
            addMealToList(mealData);

            // Update nutrition totals
            currentNutrition.calories += mealData.calories || 0;
            currentNutrition.protein += mealData.protein || 0;
            currentNutrition.carbs += mealData.carbs || 0;
            currentNutrition.fat += mealData.fat || 0;
            currentNutrition.fiber += mealData.fiber || 0;
            currentNutrition.sugar += mealData.sugar || 0;
            currentNutrition.alcohol += mealData.alcohol || 0;

            // Update dashboard
            updateNutritionDashboard();

            console.log('Meal added:', mealData);

            // Close modal and reset form
            mealModal.classList.remove('active');
            mealForm.reset();
        }
    });
}

// Camera Upload Modal functionality
function initCameraModal() {
    const cameraUploadBtn = document.getElementById('camera-upload-btn');
    const cameraModal = document.getElementById('camera-modal');
    const cameraModalClose = document.getElementById('camera-modal-close');
    const cameraCancelBtn = document.getElementById('camera-cancel-btn');
    const cameraForm = document.getElementById('camera-form');

    if (!cameraUploadBtn || !cameraModal) return;

    // Open camera modal
    cameraUploadBtn.addEventListener('click', () => {
        cameraModal.classList.add('active');
        lucide.createIcons();
    });

    // Close camera modal
    cameraModalClose.addEventListener('click', () => {
        cameraModal.classList.remove('active');
        cameraForm.reset();
        clearErrors();
    });

    cameraCancelBtn.addEventListener('click', () => {
        cameraModal.classList.remove('active');
        cameraForm.reset();
        clearErrors();
    });

    // Close modal on overlay click
    cameraModal.addEventListener('click', (e) => {
        if (e.target === cameraModal) {
            cameraModal.classList.remove('active');
            cameraForm.reset();
            clearErrors();
        }
    });

    // Handle camera form submission
    cameraForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const photoInput = document.getElementById('meal-photo-input');
        const loadingDiv = document.getElementById('camera-loading');
        const errorDiv = document.getElementById('camera-error');
        const submitBtn = document.getElementById('camera-submit-btn');

        clearErrors();
        errorDiv.style.display = 'none';

        if (!photoInput.files || photoInput.files.length === 0) {
            showError('photo-error');
            return;
        }

        // Check if Supabase is configured
        if (!supabaseClient) {
            errorDiv.textContent = 'Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in the code.';
            errorDiv.style.display = 'block';
            return;
        }

        // Show loading state
        loadingDiv.style.display = 'block';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Analyzing...';

        try {
            // Convert image to base64
            const file = photoInput.files[0];
            const reader = new FileReader();

            const imageBase64 = await new Promise((resolve, reject) => {
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            // Call Supabase Edge Function
            console.log('Calling Edge Function: bright-api');
            console.log('Image size:', imageBase64.length, 'characters');

            let data, error;

            try {
                const result = await supabaseClient.functions.invoke('bright-api', {
                    body: { image: imageBase64 }
                });
                data = result.data;
                error = result.error;
            } catch (invokeError) {
                console.error('Function invoke error:', invokeError);
                // Try direct fetch as fallback
                console.log('Trying direct fetch to Edge Function...');
                try {
                    const functionUrl = `${CONFIG.SUPABASE_URL}/functions/v1/bright-api`;
                    const response = await fetch(functionUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
                            'apikey': CONFIG.SUPABASE_ANON_KEY
                        },
                        body: JSON.stringify({ image: imageBase64 })
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`Edge Function returned ${response.status}: ${errorText}`);
                    }

                    const result = await response.json();
                    data = result;
                    error = null;
                } catch (fetchError) {
                    console.error('Direct fetch error:', fetchError);
                    throw new Error(`Failed to reach Edge Function: ${fetchError.message}`);
                }
            }

            console.log('Edge Function response:', { data, error });

            if (error) {
                console.error('Edge Function error details:', error);
                throw new Error(error.message || 'Failed to send a request to the Edge Function');
            }

            if (!data) {
                throw new Error('No data received from Edge Function');
            }

            if (!data.success) {
                throw new Error(data?.error || 'Failed to analyze image');
            }

            const mealData = {
                ...data.data,
                id: data.data.id,
                supabaseId: data.data.id
            };

            // Add meal to list
            addMealToList(mealData);

            // Update nutrition totals
            currentNutrition.calories += mealData.calories || 0;
            currentNutrition.protein += mealData.protein || 0;
            currentNutrition.carbs += mealData.carbs || 0;
            currentNutrition.fat += mealData.fat || 0;
            currentNutrition.fiber += mealData.fiber || 0;
            currentNutrition.sugar += mealData.sugar || 0;
            currentNutrition.alcohol += mealData.alcohol || 0;

            // Update dashboard
            updateNutritionDashboard();

            // Close modal and reset form
            cameraModal.classList.remove('active');
            cameraForm.reset();
            loadingDiv.style.display = 'none';

            // Show success message
            alert('Meal analyzed and added to your daily nutrition!');

        } catch (error) {
            console.error('Error analyzing meal:', error);
            errorDiv.textContent = error.message || 'Failed to analyze image. Please try again.';
            errorDiv.style.display = 'block';
            loadingDiv.style.display = 'none';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Analyze Photo';
        }
    });
}

// Initialize all modals
function initModals() {
    initUploadModal();
    initMealModal();
    initCameraModal();
}

// Error handling utilities
function showError(errorId) {
    document.getElementById(errorId).classList.add('active');
}

function clearErrors() {
    document.querySelectorAll('.form-error').forEach(error => {
        error.classList.remove('active');
    });
    const errorDiv = document.getElementById('camera-error');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// Initialize modals when DOM is loaded
document.addEventListener('DOMContentLoaded', initModals);
