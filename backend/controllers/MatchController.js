const matchModel = require("../models/MatchModel");
const itemModel = require("../models/ItemModel");
const { findMatches } = require("../utils/similarity");

exports.scanForMatches = async (req, res) => {
    try {
        const { threshold = 0.5 } = req.body; 
        const allItems = await itemModel.getItem();

        if (!allItems || allItems.length < 2) {
            return res.status(200).json({ status: 200, message: "Not enough items to scan", data: { matchesCreated: 0 } });
        }

        let matchesCreated = 0;

        for (let i = 0; i < allItems.length; i++) {
            for (let j = i + 1; j < allItems.length; j++) {
                const item1 = allItems[i];
                const item2 = allItems[j];

                const userId1 = item1.user_id || (item1.user && item1.user.id);
                const userId2 = item2.user_id || (item2.user && item2.user.id);

                if (userId1 === userId2) continue;

                if (item1.status === item2.status) continue; 

                const matchResult = findMatches(item1, item2, threshold);

                if (matchResult.isSimilar) {
                    const exists = await matchModel.checkMatchExists(item1.id, item2.id);
                    
                    if (!exists) {
                        await matchModel.createMatch(
                            item1.id,
                            item2.id,
                            matchResult.weightedScore,
                            matchResult.matchType
                        );
                        matchesCreated++;
                    }
                }
            }
        }

        res.status(200).json({
            status: 200,
            message: `Scan complete. Found ${matchesCreated} matches.`,
            data: { matchesCreated }
        });

    } catch (err) {
        console.error("SCAN ERROR:", err);
        res.status(500).json({ status: 500, message: err.message });
    }
};

exports.getAllMatches = async (req, res) => {
    try {
        const result = await matchModel.getAllMatches();
        res.status(200).json({ status: 200, message: "success", data: result });
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message });
    }
};

exports.getUserMatches = async (req, res) => {
    try {
        const result = await matchModel.getUserMatches(req.user.id);
        res.status(200).json({ status: 200, message: "success", data: result });
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message });
    }
};

exports.getMatchDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await matchModel.getMatchById(id);
        if (!result) {
            return res.status(404).json({ status: 404, message: "Match not found" });
        }
        res.status(200).json({ status: 200, message: "success", data: result });
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message });
    }
};

exports.sendMatchToUser = async (req, res) => {
    try {
        const { matchId, userId } = req.body;
        const result = await matchModel.markMatchAsSent(matchId, userId);
        if (!result) {
            return res.status(404).json({ status: 404, message: "Match not found" });
        }
        res.status(200).json({ status: 200, message: "Match sent to user", data: result });
    } catch (err) {
        res.status(500).json({ status: 500, message: err.message });
    }
};