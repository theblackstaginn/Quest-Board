import Foundation

struct WatchQuest: Identifiable, Hashable {
    let id: String
    let title: String
    let category: String
    let time: String
    let systemImage: String
}

enum WatchQuestCatalog {
    static let all: [WatchQuest] = [
        WatchQuest(id: "there-back", title: "There and Back", category: "Endurance", time: "15–25 min", systemImage: "figure.walk"),
        WatchQuest(id: "keep", title: "The Keep", category: "Strength", time: "10–20 min", systemImage: "dumbbell.fill"),
        WatchQuest(id: "dragonstrength", title: "DragonStrength", category: "Strength", time: "10–20 min", systemImage: "flame.fill"),
        WatchQuest(id: "iron-gate", title: "The Iron Gate", category: "Strength", time: "20–30 min", systemImage: "shield.fill"),
        WatchQuest(id: "smiths-circuit", title: "The Smith's Circuit", category: "Strength", time: "12–18 min", systemImage: "hammer.fill"),
        WatchQuest(id: "sentinels-stand", title: "Sentinel's Stand", category: "Strength", time: "15–25 min", systemImage: "dumbbell"),
        WatchQuest(id: "rogue", title: "Rogue Mode", category: "Mixed", time: "10 min", systemImage: "moon.stars.fill"),
        WatchQuest(id: "restoration", title: "Restoration", category: "Recovery", time: "10–20 min", systemImage: "leaf.fill"),
        WatchQuest(id: "unbinding-ritual", title: "The Unbinding Ritual", category: "Recovery", time: "8–12 min", systemImage: "sparkles"),
        WatchQuest(id: "wayfarers-reset", title: "Wayfarer's Reset", category: "Recovery", time: "10–15 min", systemImage: "figure.cooldown"),
        WatchQuest(id: "moonlit-mobility", title: "Moonlit Mobility", category: "Recovery", time: "10–15 min", systemImage: "moon.fill"),
        WatchQuest(id: "ranger", title: "Ranger Training", category: "Endurance", time: "20–30 min", systemImage: "figure.hiking"),
        WatchQuest(id: "emergency", title: "Emergency Quest", category: "Emergency", time: "5 min", systemImage: "bolt.fill")
    ]

    static func quest(id: String) -> WatchQuest? {
        all.first { $0.id == id }
    }
}
