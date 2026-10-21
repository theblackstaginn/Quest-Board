import Foundation

enum RogueWitchSharedState {
    static let suiteName = "group.com.blackstag.questboard.roguewitch"
    static let snapshotKey = "rogueWitchSnapshot"

    private static var defaults: UserDefaults {
        UserDefaults(suiteName: suiteName) ?? .standard
    }

    static func save(_ snapshot: RogueWitchSnapshot) throws {
        let data = try JSONEncoder().encode(snapshot)
        defaults.set(data, forKey: snapshotKey)
    }

    static func load() -> RogueWitchSnapshot {
        guard
            let data = defaults.data(forKey: snapshotKey),
            let snapshot = try? JSONDecoder().decode(
                RogueWitchSnapshot.self,
                from: data
            )
        else {
            return .empty
        }

        return snapshot
    }
}
