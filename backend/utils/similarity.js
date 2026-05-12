const levenshteinDistance = (str1, str2) => {
    if (!str1 || !str2) return Math.max((str1 || "").length, (str2 || "").length);
    const track = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(0));
    for (let i = 0; i <= str1.length; i++) track[0][i] = i;
    for (let j = 0; j <= str2.length; j++) track[j][0] = j;
    for (let j = 1; j <= str2.length; j++) {
        for (let i = 1; i <= str1.length; i++) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
            track[j][i] = Math.min(track[j][i - 1] + 1, track[j - 1][i] + 1, track[j - 1][i - 1] + indicator);
        }
    }
    return track[str2.length][str1.length];
};

const calculateSimilarity = (str1, str2) => {
    const s1 = String(str1 || "");
    const s2 = String(str2 || "");
    if (s1 === "" && s2 === "") return 1;
    const distance = levenshteinDistance(s1.toLowerCase(), s2.toLowerCase());
    const maxLen = Math.max(s1.length, s2.length);
    return 1 - distance / maxLen;
};

const findMatches = (item1, item2, thresholdScore = 0.5) => {
    const titleScore = calculateSimilarity(item1.title, item2.title);
    const locationScore = calculateSimilarity(item1.location, item2.location);

    // Pembobotan: Title lebih penting (70%) daripada lokasi (30%)
    const weightedScore = (titleScore * 0.7) + (locationScore * 0.3);

    return {
        isSimilar: weightedScore >= thresholdScore,
        weightedScore,
        matchType: titleScore > locationScore ? "title" : "location"
    };
};

module.exports = { findMatches };