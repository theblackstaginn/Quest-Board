import Foundation

struct WatchQuestSession: Codable, Hashable {
    let questID: String
    var startedAt: Date?
    var accumulatedSeconds: TimeInterval
    var isRunning: Bool
    let idempotencyKey: UUID

    init(
        questID: String,
        startedAt: Date = Date(),
        accumulatedSeconds: TimeInterval = 0,
        isRunning: Bool = true,
        idempotencyKey: UUID = UUID()
    ) {
        self.questID = questID
        self.startedAt = startedAt
        self.accumulatedSeconds = accumulatedSeconds
        self.isRunning = isRunning
        self.idempotencyKey = idempotencyKey
    }

    func elapsed(at date: Date = Date()) -> TimeInterval {
        guard isRunning, let startedAt else {
            return max(0, accumulatedSeconds)
        }

        return max(
            0,
            accumulatedSeconds + date.timeIntervalSince(startedAt)
        )
    }
}
