// Helper function to generate human-like titles
function generateHumanTitle(userInput) {
    // Clean and capitalize properly
    let title = userInput.trim();

    // Remove common prefixes
    title = title.replace(/^(add|create|make|new|remind me to|remember to|i need to|need to)\s+/i, '');
    title = title.replace(/^(note|reminder)\s+(for|about|to)\s+/i, '');

    // Handle common patterns
    if (title.match(/buy|purchase|get|pick up/i)) {
        title = title.replace(/^(buy|purchase|get|pick up)\s+/i, '');
        if (!title.toLowerCase().includes('pick up') && !title.toLowerCase().includes('buy') && !title.toLowerCase().includes('get')) {
            title = 'Pick up ' + title;
        }
    }

    if (title.match(/call|phone|contact/i)) {
        title = title.replace(/^(call|phone|contact)\s+/i, '');
        if (!title.toLowerCase().includes('call')) {
            title = 'Call ' + title;
        }
    }

    if (title.match(/meeting|meet with/i)) {
        if (!title.toLowerCase().includes('meeting')) {
            title = title.replace(/meet with/i, 'Meeting with');
        }
    }

    // Capitalize first letter and important words
    title = title.charAt(0).toUpperCase() + title.slice(1);

    // Limit length to reasonable size
    if (title.length > 50) {
        title = title.substring(0, 47) + '...';
    }

    return title || 'New Note';
}

// Helper function to enhance descriptions
function enhanceDescription(userInput, title) {
    let description = userInput.trim();

    // If description is too short, keep it as is but clean it up
    if (description.length < 10) {
        return description;
    }

    // Remove redundant prefixes from description
    description = description.replace(/^(add|create|make|new|remind me to|remember to|i need to|need to)\s+/i, '');
    description = description.replace(/^(note|reminder)\s+(for|about|to)\s+/i, '');

    // Capitalize first letter
    description = description.charAt(0).toUpperCase() + description.slice(1);

    // Ensure it ends with proper punctuation
    if (!description.match(/[.!?]$/)) {
        description += '.';
    }

    return description;
}

// Helper function for intelligent description updates
function updateDescriptionIntelligently(originalDescription, updateInstruction, userRequest) {
    let newDescription = originalDescription;

    // Handle date changes (like "2nd sep to 4th september")
    const dateChangeMatch = userRequest.match(/from\s+(.+?)\s+to\s+(.+?)(?:\s|$)/i);
    if (dateChangeMatch) {
        const oldDate = dateChangeMatch[1].trim();
        const newDate = dateChangeMatch[2].trim();

        // Try different date format variations
        const oldDateVariations = [
            oldDate,
            oldDate.replace(/sep/i, 'september'),
            oldDate.replace(/september/i, 'sep'),
            oldDate.replace(/(\d+)(st|nd|rd|th)/i, '$1'),
        ];

        for (const variation of oldDateVariations) {
            if (newDescription.toLowerCase().includes(variation.toLowerCase())) {
                newDescription = newDescription.replace(new RegExp(variation, 'gi'), newDate);
                break;
            }
        }
    }

    // Handle time changes (like "2pm to 3pm")
    const timeChangeMatch = userRequest.match(/(\d+(?::\d+)?(?:am|pm)?)\s+(?:instead of|to)\s+(\d+(?::\d+)?(?:am|pm)?)/i);
    if (timeChangeMatch) {
        const oldTime = timeChangeMatch[2];
        const newTime = timeChangeMatch[1];
        newDescription = newDescription.replace(new RegExp(oldTime, 'gi'), newTime);
    }

    // Handle additions (like "add eggs")
    if (userRequest.match(/add\s+/i)) {
        const addMatch = userRequest.match(/add\s+(.+?)(?:\s|$)/i);
        if (addMatch) {
            const itemToAdd = addMatch[1];
            if (!newDescription.toLowerCase().includes(itemToAdd.toLowerCase())) {
                // Add to existing list or append
                if (newDescription.match(/,/)) {
                    newDescription = newDescription.replace(/\.$/, '') + `, and ${itemToAdd}.`;
                } else {
                    newDescription = newDescription.replace(/\.$/, '') + ` and ${itemToAdd}.`;
                }
            }
        }
    }

    // If we have a direct new description, use it
    if (updateInstruction && updateInstruction !== originalDescription) {
        newDescription = updateInstruction;
    }

    return enhanceDescription(newDescription, '');
}

// Helper function to calculate similarity between two strings
function calculateSimilarity(str1, str2) {
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();

    // Exact match
    if (s1 === s2) return 1.0;

    // Contains match
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;

    // Word overlap
    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);
    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = Math.max(words1.length, words2.length);

    return commonWords.length / totalWords;
}

module.exports = {
    generateHumanTitle,
    enhanceDescription,
    updateDescriptionIntelligently,
    calculateSimilarity
};