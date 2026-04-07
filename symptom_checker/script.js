document.addEventListener('DOMContentLoaded', () => {
    const patientName = sessionStorage.getItem('currentPatientName');
    if (!patientName) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('patient-name-display').textContent = patientName;

    document.getElementById('logout-link').addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('currentPatientName');
        window.location.href = 'login.html';
    });

    const checkBtn = document.getElementById('check-btn');
    const resultContainer = document.getElementById('result-container');
    const severityBadge = document.getElementById('severity-badge');
    const conditionText = document.getElementById('condition-text');
    const warningText = document.getElementById('warning-text');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const additionalInfoSection = document.getElementById('additional-info-section');
    const nextBtn = document.getElementById('next-btn');

    // Add change listeners to checkboxes to enable the next button
    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const anyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
            if (anyChecked) {
                nextBtn.disabled = false;
            } else {
                nextBtn.disabled = true;
                additionalInfoSection.classList.add('hidden');
                checkBtn.classList.add('hidden');
            }
        });
    });

    nextBtn.addEventListener('click', () => {
        additionalInfoSection.classList.remove('hidden');
        checkBtn.classList.remove('hidden');
        nextBtn.classList.add('hidden'); // Optional: hide the next button after clicking
        // Scroll to the new section smoothly
        additionalInfoSection.scrollIntoView({ behavior: 'smooth' });
    });

    checkBtn.addEventListener('click', () => {
        let generalScore = 0;

        checkboxes.forEach(cb => {
            if (cb.checked) {
                const parts = cb.value.split('-');
                const weight = parseInt(parts[1], 10);
                generalScore += weight; // ranges from 1 to 3 depending on checkboxes
            }
        });

        const durationVal = document.getElementById('duration').value;
        const overallSevVal = document.getElementById('overall-severity').value;
        const cravings = document.getElementById('food-cravings').value.trim();

        // 1=Less than 1 week, 2=1-2 weeks, 3=1-4 weeks, 4=1 month or more
        if (durationVal) {
            generalScore += parseInt(durationVal, 10);
        }

        // Let user's selected severity have a stronger pull on the final severity
        let userSeveritySetting = 0;
        if (overallSevVal) {
            userSeveritySetting = parseInt(overallSevVal, 10); // 1, 2, or 3
        }

        if (cravings.length > 3) {
            generalScore += 1;
        }

        let severity = 'None';
        let condition = 'No clear symptoms detected.';
        let warning = 'Please consult a doctor if you feel unwell.';
        let badgeClass = '';

        // Recommendation Variables
        let dietItems = [];
        let precautionItems = [];
        let exerciseItems = [];
        let cravingAdvice = '';

        // Prioritize User's Own Severity Assessment.
        // Even if they check 2 small symptoms (e.g. generalScore = 3 points), if they set severity to 'Mild (1)', it should stay mild.
        // We evaluate primarily heavily on their input of `userSeveritySetting` combined with raw math

        // Helper for exercises with images
        const withImage = (text, img) => `<div style="display:flex; align-items:center; gap: 10px; margin-bottom: 5px;"><img src="images/${img}.png" alt="${text}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border-color);"> <span>${text}</span></div>`;

        let mealMorning = 'Morning: Oatmeal with fresh berries (300 kcal)';
        let mealAfternoon = 'Afternoon: Grilled chicken salad with avocado (450 kcal)';
        let mealEvening = 'Evening: Baked salmon with steamed vegetables (500 kcal)';
        let mealSnacks = 'Snacks: Mixed nuts and seeds (150 kcal)';

        if (generalScore === 0) {
            severity = 'Mild / Normal';
            badgeClass = 'mild';
            precautionItems.push('Annual check-ups');
            exerciseItems.push(withImage('150 mins aerobic activity/week', 'aerobic'));
        } else if (userSeveritySetting === 3 || generalScore >= 12) {
            condition = 'Significant Thyroid Symptoms Detected';
            severity = 'Severe';
            badgeClass = 'severe';
            warning = 'Seek medical evaluation immediately.';
            mealMorning = 'Morning: Low-iodine oatmeal with berries (250 kcal)';
            mealAfternoon = 'Afternoon: Fresh vegetable soup with chicken (350 kcal)';
            mealEvening = 'Evening: Grilled chicken with asparagus (avoid seaweed) (400 kcal)';
            mealSnacks = 'Snacks: Fresh fruit slices (100 kcal)';
            precautionItems.push('See an endocrinologist', 'Do not ignore symptoms');
            exerciseItems.push(withImage('Gentle walking (15-20 mins)', 'walking'), withImage('Light stretching (10 mins)', 'stretching'), withImage('Avoid high-intensity cardio', 'resting'));
        } else if (userSeveritySetting === 2 || generalScore >= 7) {
            condition = 'Potential Thyroid Symptoms Detected';
            severity = 'Moderate';
            badgeClass = 'moderate';
            warning = 'Medical check-up recommended.';
            mealMorning = 'Morning: Oatmeal with Brazil nuts (350 kcal)';
            mealAfternoon = 'Afternoon: Quinoa salad with roasted veggies (limit processed foods) (400 kcal)';
            mealEvening = 'Evening: Baked fish with leafy greens (450 kcal)';
            precautionItems.push('Schedule doctor visit', 'Get a thyroid panel (TSH, Free T3, Free T4)');
            exerciseItems.push(withImage('Brisk walking (30 mins)', 'walking'), withImage('Swimming (30 mins, twice a week)', 'swimming'), withImage('Cycling (20 mins)', 'cycling'), withImage('Rest if fatigued', 'resting'));
        } else {
            // General score is between 1 and 6, and user selected Mild (1)
            condition = 'Potential Thyroid Symptoms Detected';
            severity = 'Mild';
            badgeClass = 'mild';
            warning = 'Monitor symptoms.';
            precautionItems.push('Keep a symptom journal', 'Mention at next general check-up');
            exerciseItems.push(withImage('Regular exercise routine (30-45 mins/day)', 'aerobic'));
        }

        // Add specific advice based on selected symptoms
        if (document.getElementById('fatigue') && document.getElementById('fatigue').checked) {
            mealSnacks = 'Snacks: High-energy dates and walnuts (200 kcal)';
            precautionItems.push('Pace activities to manage fatigue');
            precautionItems.push('Consider a B-12 supplement (consult doctor first)');
            exerciseItems.push(withImage('Try restorative exercises like yoga (20 mins)', 'yoga'));
        }
        if (document.getElementById('hair-loss') && document.getElementById('hair-loss').checked) {
            mealMorning = 'Morning: Oatmeal with berries and biotin-rich eggs (350 kcal)';
            precautionItems.push('Use gentle hair care products');
            precautionItems.push('Over-the-counter Biotin supplements may support hair health');
        }
        if (document.getElementById('mood-changes') && document.getElementById('mood-changes').checked) {
            mealEvening = 'Evening: Baked salmon (high in omega-3s for mood) with veggies (500 kcal)';
            precautionItems.push('Practice stress management techniques');
            precautionItems.push('Consider L-theanine or ashwagandha supplements for stress');
            exerciseItems.push(withImage('Incorporate mindful activities like meditation (10-15 mins daily)', 'meditation'));
        }
        if (document.getElementById('skin-changes') && document.getElementById('skin-changes').checked) {
            mealAfternoon = 'Afternoon: Hydrating cucumber & grilled chicken salad with seeds (450 kcal)';
            precautionItems.push('Moisturize dry skin daily');
            precautionItems.push('Omega-3 or Vitamin E capsules can help skin hydration');
        }
        if (document.getElementById('weight-change') && document.getElementById('weight-change').checked) {
            mealEvening = 'Evening: Low-calorie grilled chicken and steamed broccoli (300 kcal)';
            mealSnacks = 'Snacks: Celery and carrot sticks (50 kcal)';
            precautionItems.push('Avoid extreme crash diets and unverified weight-loss pills');
        }
        if (document.getElementById('temp-intolerance') && document.getElementById('temp-intolerance').checked) {
            mealMorning = 'Morning: Warm therapeutic oatmeal with berries (300 kcal)';
            precautionItems.push('Dress in layers to adjust easily to temperatures');
            precautionItems.push('Over-the-counter NSAIDs (like Ibuprofen) can help if accompanied by muscle aches');
        }
        if (document.getElementById('heart-rate') && document.getElementById('heart-rate').checked) {
            mealMorning = 'Morning: Herbal tea with berry oatmeal (NO caffeine) (300 kcal)';
            precautionItems.push('Report heart palpitations to your doctor immediately');
            precautionItems.push('Do NOT take over-the-counter stimulants or decongestants');
            exerciseItems.push(withImage('Avoid pushing heart rate too high', 'no_cardio'));
        }

        if (document.getElementById('neck-swelling') && document.getElementById('neck-swelling').checked) {
            mealMorning = 'Morning: Easy-to-swallow smoothie with protein powder and spinach (300 kcal)';
            precautionItems.push('Get a physical exam to check for goiter or nodules');
            precautionItems.push('Consider an ultrasound of the neck');
        }
        if (document.getElementById('muscle-weakness') && document.getElementById('muscle-weakness').checked) {
            mealEvening = 'Evening: Lean proteins with magnesium-rich spinach (400 kcal)';
            precautionItems.push('Consider magnesium supplements for muscle recovery (consult doctor first)');
            exerciseItems.push(withImage('Gentle resistance training (15 mins)', 'stretching'));
        }
        if (document.getElementById('bowel-changes') && document.getElementById('bowel-changes').checked) {
            mealAfternoon = 'Afternoon: High-fiber lentil soup with whole grains (400 kcal)';
            precautionItems.push('Increase daily water intake significantly');
            precautionItems.push('Monitor fiber intake to manage constipation or diarrhea');
        }
        if (document.getElementById('brain-fog') && document.getElementById('brain-fog').checked) {
            mealSnacks = 'Snacks: Omega-3 rich walnuts and blueberries (200 kcal)';
            precautionItems.push('Prioritize strict sleep hygiene');
            precautionItems.push('Consider cognitive exercises and a B-complex vitamin');
        }

        dietItems.push(
            withImage(mealMorning, 'breakfast'),
            withImage(mealAfternoon, 'lunch'),
            withImage(mealEvening, 'dinner'),
            withImage(mealSnacks, 'snacks')
        );

        // Evaluate cravings if the user entered any
        if (cravings.length > 0) {
            const lowerCravings = cravings.toLowerCase();
            let isUnhealthyCraving = false;
            let healthyAdviceOverride = '';

            // Keyword analysis to see if it's an inherently problematic food
            if (lowerCravings.includes('biryani') || lowerCravings.includes('spicy') || lowerCravings.includes('fast food') || lowerCravings.includes('burger')) {
                isUnhealthyCraving = true;
                healthyAdviceOverride = '<strong>avoid it.</strong> High-fat and highly spiced foods can exacerbate inflammation and digestive symptoms';
            } else if (lowerCravings.includes('sweet') || lowerCravings.includes('sugar') || lowerCravings.includes('cake') || lowerCravings.includes('chocolate')) {
                isUnhealthyCraving = true;
                healthyAdviceOverride = '<strong>limit it significantly.</strong> Refined sugars can trigger fatigue spikes and worsen inflammation';
            } else if (lowerCravings.includes('salt') || lowerCravings.includes('chips')) {
                isUnhealthyCraving = true;
                healthyAdviceOverride = '<strong>limit it.</strong> High sodium can worsen bloating (try drinking water first)';
            } else if (lowerCravings.includes('seaweed') || lowerCravings.includes('kelp') || lowerCravings.includes('sushi')) {
                if (userSeveritySetting === 3) {
                    isUnhealthyCraving = true;
                    healthyAdviceOverride = '<strong>avoid it entirely</strong> until you know your exact condition, as high iodine can be dangerous';
                }
            }

            // Build a string for *why* they shouldn't eat it, based on symptoms checked
            let symptomReason = '';
            if (document.getElementById('weight-change') && document.getElementById('weight-change').checked) {
                symptomReason = 'due to your recent weight changes';
            } else if (document.getElementById('fatigue') && document.getElementById('fatigue').checked) {
                symptomReason = 'to avoid further energy crashes from your fatigue';
            } else if (document.getElementById('heart-rate') && document.getElementById('heart-rate').checked) {
                symptomReason = 'to keep from stressing your sensitive heart rate';
            } else if (document.getElementById('skin-changes') && document.getElementById('skin-changes').checked) {
                symptomReason = 'which could exacerbate your skin issues';
            } else if (document.getElementById('temp-intolerance') && document.getElementById('temp-intolerance').checked) {
                symptomReason = 'as diet impacts overall body temperature regulation';
            } else if (document.getElementById('mood-changes') && document.getElementById('mood-changes').checked) {
                symptomReason = 'since diet strongly impacts mood swings';
            } else if (document.getElementById('hair-loss') && document.getElementById('hair-loss').checked) {
                symptomReason = 'since proper nutrition is vital for hair health right now';
            } else if (document.getElementById('neck-swelling') && document.getElementById('neck-swelling').checked) {
                symptomReason = 'since dietary choices can further irritate neck swelling';
            } else if (document.getElementById('muscle-weakness') && document.getElementById('muscle-weakness').checked) {
                symptomReason = 'as proper nutrition is critical for muscle recovery';
            } else if (document.getElementById('bowel-changes') && document.getElementById('bowel-changes').checked) {
                symptomReason = 'because gut health and digestion are already compromised';
            } else if (document.getElementById('brain-fog') && document.getElementById('brain-fog').checked) {
                symptomReason = 'since sugary or heavy foods might worsen brain fog';
            }

            // Fallback if no symptoms are checked
            if (!symptomReason) {
                symptomReason = 'based on your current analysis';
            }

            let eatAdvice = '';
            if (isUnhealthyCraving) {
                // If it's a known bad food, use the override
                eatAdvice = `You should ${healthyAdviceOverride} ${symptomReason}.`;
            } else {
                // Otherwise format based strictly on severity
                if (severity === 'Severe') {
                    eatAdvice = `<strong>No, you cannot eat that</strong> ${symptomReason}.`;
                } else if (severity === 'Moderate') {
                    eatAdvice = `<strong>You can eat a small amount</strong> ${symptomReason}.`;
                } else {
                    // Mild
                    eatAdvice = `<strong>Yes, you can feel free to eat that</strong> ${symptomReason}.`;
                }
            }

            cravingAdvice = `You mentioned craving <strong>"${cravings}"</strong>. ${eatAdvice}`;
        }

        severityBadge.textContent = severity + ' Severity';
        severityBadge.className = 'severity-badge ' + badgeClass;
        conditionText.textContent = condition;
        warningText.textContent = warning;

        // Display Recommendations
        const formatList = (items) => '<ul>' + items.map(item => `<li>${item}</li>`).join('') + '</ul>';

        document.getElementById('diet-text').innerHTML = formatList(dietItems);
        document.getElementById('precautions-text').innerHTML = formatList(precautionItems);
        document.getElementById('exercise-text').innerHTML = formatList(exerciseItems);

        const cravingsSection = document.getElementById('cravings-feedback-section');
        if (cravingAdvice) {
            document.getElementById('cravings-text').innerHTML = cravingAdvice;
            cravingsSection.classList.remove('hidden');
        } else {
            cravingsSection.classList.add('hidden');
        }

        document.getElementById('recommendations-container').classList.remove('hidden');

        resultContainer.classList.remove('hidden');
        resultContainer.classList.add('visible');
    }); // Closing checkBtn listener bracket here

    // Ultrasound Upload and Detection Simulation
    const ultrasoundUpload = document.getElementById('ultrasound-upload');
    const fileNameDisplay = document.getElementById('file-name');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const detectBtn = document.getElementById('detect-btn');
    const detectionResultContainer = document.getElementById('detection-result-container');
    const detectionText = document.getElementById('detection-text');
    const detectionDetails = document.getElementById('detection-details');

    ultrasoundUpload.addEventListener('change', function () {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            fileNameDisplay.textContent = file.name;

            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.src = e.target.result;
                imagePreviewContainer.classList.remove('hidden');
                detectionResultContainer.classList.add('hidden'); // Hide previous results
            }
            reader.readAsDataURL(file);
        } else {
            fileNameDisplay.textContent = 'Choose an image...';
            imagePreviewContainer.classList.add('hidden');
            detectionResultContainer.classList.add('hidden');
        }
    });

    detectBtn.addEventListener('click', () => {
        // Simulate an API call / detection delay
        detectBtn.textContent = 'Analyzing Image Data...';
        detectBtn.disabled = true;

        setTimeout(() => {
            // Simulated Detection Logic based on the uploaded image
            // We'll use the length of the base64 string to deterministically fake a detection result
            // This way, the same image will always yield the same result, and different images feel genuinely analyzed

            let result = '';
            let details = '';
            let color = '';

            const imageSrc = imagePreview.src;
            const srcLength = imageSrc.length;

            // "Analyze" the image length to decide if it's suspicious, benign, or clear
            // This ensures consistent results for the exact same file
            const pseudoHash = srcLength % 100;

            if (pseudoHash > 30) {
                // Simulate Nodule Found (Malignant)
                const confidence = (85 + (pseudoHash % 15)).toFixed(1); // 85-99%
                result = `Nodule Detected: <span>Malignant characteristics</span>`;
                details = `Simulated Confidence: ${confidence}%. Algorithmic analysis of the ultrasound pixel density suggests a malignant nodule. Please consult an endocrinologist with these imaging results for a formal biopsy or diagnosis.`;
                color = '#E74C3C'; // Red
            } else if (pseudoHash > 35) {
                // Simulate Nodule Found (Benign)
                const confidence = (80 + (pseudoHash % 19)).toFixed(1); // 80-99%
                result = `Nodule Detected: <span>Likely Benign characteristics</span>`;
                details = `Simulated Confidence: ${confidence}%. The uploaded ultrasound appears to show a thyroid nodule with clear, defined borders typical of benign cysts. Regular monitoring is still advised.`;
                color = '#F39C12'; // Orange
            } else {
                // Simulate No Nodule Found
                const confidence = (90 + (pseudoHash % 9)).toFixed(1); // 90-99%
                result = 'No Distinct Nodules Detected';
                details = `Simulated Confidence: ${confidence}%. The uploaded ultrasound does not appear to show clear signs of significant thyroid nodules. Ensure you still attend regular checkups.`;
                color = '#27ae60'; // Green
            }

            detectionText.innerHTML = result;
            detectionText.style.color = color;
            detectionDetails.textContent = details;

            detectionResultContainer.classList.remove('hidden');

            // Reset button
            detectBtn.textContent = 'Detect Nodules';
            detectBtn.disabled = false;
        }, 2000); // 2 second simulated delay for dramatic effect
    });

});
