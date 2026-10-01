import Foundation

struct QuestCompletion: Codable, Hashable {
    let questId: String?
    let completedAt: String?
}

struct QuestXPState: Codable, Hashable {
    let strength: Int?
    let endurance: Int?
    let restoration: Int?
}

struct QuestBoardState: Codable, Hashable {
    let weekKey: String?
    let weeklyCompleted: [QuestCompletion]?
    let xp: QuestXPState?
    let gold: Int?
    let crystals: Int?
    let bossDefeatedWeek: String?
    let bossRewardsClaimedWeek: String?
}

struct QuestBoardSettings: Codable, Hashable {
    let playerName: String?
    let weeklyGoal: Int?
    let reducedMotion: Bool?
    let soundEnabled: Bool?
}

struct DeviceSyncClaim: Decodable {
    let syncId: UUID
    let profileId: String
    let state: QuestBoardState
    let settings: QuestBoardSettings
    let updatedAt: String?

    enum CodingKeys: String, CodingKey {
        case syncId = "sync_id"
        case profileId = "profile_id"
        case state
        case settings
        case updatedAt = "updated_at"
    }
}

struct DeviceSyncRow: Decodable {
    let profileId: String
    let state: QuestBoardState
    let settings: QuestBoardSettings
    let updatedAt: String?

    enum CodingKeys: String, CodingKey {
        case profileId = "profile_id"
        case state
        case settings
        case updatedAt = "updated_at"
    }
}

struct RogueWitchSnapshot: Codable, Hashable {
    let displayName: String
    let className: String
    let completedThisWeek: Int
    let weeklyGoal: Int
    let bossUnlocked: Bool
    let bossDefeated: Bool
    let gold: Int
    let crystals: Int
    let updatedAt: Date

    static let empty = RogueWitchSnapshot(
        displayName: "Jess",
        className: "Rogue Witch Assassin",
        completedThisWeek: 0,
        weeklyGoal: 3,
        bossUnlocked: false,
        bossDefeated: false,
        gold: 0,
        crystals: 0,
        updatedAt: .distantPast
    )

    var progressFraction: Double {
        guard weeklyGoal > 0 else { return 0 }
        return min(1, Double(completedThisWeek) / Double(weeklyGoal))
    }
}

enum QuestBoardWeek {
    static func currentKey(for date: Date = Date()) -> String {
        let localParts = Calendar.current.dateComponents(
            [.year, .month, .day],
            from: date
        )

        var iso = Calendar(identifier: .iso8601)
        iso.timeZone = TimeZone(secondsFromGMT: 0)!

        var normalizedParts = DateComponents()
        normalizedParts.timeZone = iso.timeZone
        normalizedParts.year = localParts.year
        normalizedParts.month = localParts.month
        normalizedParts.day = localParts.day

        guard let normalizedDate = iso.date(from: normalizedParts) else {
            return ""
        }

        let week = iso.component(.weekOfYear, from: normalizedDate)
        let year = iso.component(.yearForWeekOfYear, from: normalizedDate)

        return String(format: "%04d-W%02d", year, week)
    }
}
