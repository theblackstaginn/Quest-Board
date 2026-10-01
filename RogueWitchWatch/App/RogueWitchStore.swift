import Foundation
import SwiftUI
import Supabase
import WidgetKit

private struct ClaimParams: Encodable {
    let p_pair_code: String
    let p_profile_id: String
}

private struct JoinSyncedPartyParams: Encodable {
    let p_sync_id: UUID
}

private struct CompleteWatchQuestParams: Encodable {
    let p_sync_id: UUID
    let p_quest_id: String
    let p_idempotency_key: UUID
}

@MainActor
final class RogueWitchStore: ObservableObject {
    enum Phase: Equatable {
        case starting
        case needsPairing
        case loading
        case connected
        case failed(String)
    }

    @Published private(set) var phase: Phase = .starting
    @Published private(set) var snapshot = RogueWitchSharedState.load()
    @Published private(set) var activeSession: WatchQuestSession?
    @Published private(set) var isCompleting = false
    @Published var pairingCode = ""

    private let client = QuestBoardConfig.client
    private let syncIdKey = "rogueWitchDeviceSyncId"
    private let activeQuestKey = "rogueWitchActiveQuest"

    init() {
        activeSession = Self.loadActiveSession()
    }

    private var syncID: UUID? {
        get {
            guard let raw = UserDefaults.standard.string(forKey: syncIdKey) else {
                return nil
            }
            return UUID(uuidString: raw)
        }
        set {
            if let newValue {
                UserDefaults.standard.set(newValue.uuidString, forKey: syncIdKey)
            } else {
                UserDefaults.standard.removeObject(forKey: syncIdKey)
            }
        }
    }

    var isPaired: Bool {
        syncID != nil
    }

    var activeQuest: WatchQuest? {
        guard let questID = activeSession?.questID else {
            return nil
        }
        return WatchQuestCatalog.quest(id: questID)
    }

    func bootstrap() async {
        phase = .starting

        do {
            try await ensureSession()

            guard syncID != nil else {
                phase = .needsPairing
                return
            }

            try await refresh()
        } catch {
            phase = .failed(error.localizedDescription)
        }
    }

    func pair() async {
        let code = pairingCode
            .trimmingCharacters(in: .whitespacesAndNewlines)
            .uppercased()

        guard code.count == 8 else {
            phase = .failed("Enter the 8-character Quest Board pairing code.")
            return
        }

        phase = .loading

        do {
            try await ensureSession()

            let claim: DeviceSyncClaim = try await client
                .rpc(
                    "claim_device_sync_channel",
                    params: ClaimParams(
                        p_pair_code: code,
                        p_profile_id: "jess"
                    )
                )
                .single()
                .execute()
                .value

            guard claim.profileId == "jess" else {
                throw RogueWitchError.wrongProfile
            }

            syncID = claim.syncId

            try? await client
                .rpc(
                    "join_synced_party",
                    params: JoinSyncedPartyParams(p_sync_id: claim.syncId)
                )
                .execute()

            apply(state: claim.state, settings: claim.settings)

            pairingCode = ""
            phase = .connected
        } catch {
            syncID = nil
            phase = .failed(error.localizedDescription)
        }
    }

    func refresh() async throws {
        guard let syncID else {
            phase = .needsPairing
            return
        }

        phase = .loading

        let row: DeviceSyncRow = try await client
            .from("device_sync")
            .select("profile_id,state,settings,updated_at")
            .eq("sync_id", value: syncID.uuidString)
            .single()
            .execute()
            .value

        guard row.profileId == "jess" else {
            self.syncID = nil
            throw RogueWitchError.wrongProfile
        }

        apply(state: row.state, settings: row.settings)
        phase = .connected
    }

    func startQuest(_ quest: WatchQuest) {
        guard activeSession == nil else {
            return
        }

        activeSession = WatchQuestSession(questID: quest.id)
        persistActiveSession()
    }

    func pauseActiveQuest() {
        guard var session = activeSession, session.isRunning else {
            return
        }

        session.accumulatedSeconds = session.elapsed()
        session.startedAt = nil
        session.isRunning = false

        activeSession = session
        persistActiveSession()
    }

    func resumeActiveQuest() {
        guard var session = activeSession, !session.isRunning else {
            return
        }

        session.startedAt = Date()
        session.isRunning = true

        activeSession = session
        persistActiveSession()
    }

    func abandonActiveQuest() {
        activeSession = nil
        persistActiveSession()
    }

    func completeActiveQuest() async throws -> WatchQuestCompletionResponse {
        guard let syncID else {
            throw RogueWitchError.notPaired
        }

        guard let session = activeSession else {
            throw RogueWitchError.noActiveQuest
        }

        guard WatchQuestCatalog.quest(id: session.questID) != nil else {
            throw RogueWitchError.unsupportedQuest
        }

        isCompleting = true
        defer { isCompleting = false }

        try await ensureSession()

        let response: WatchQuestCompletionResponse = try await client
            .rpc(
                "complete_watch_quest",
                params: CompleteWatchQuestParams(
                    p_sync_id: syncID,
                    p_quest_id: session.questID,
                    p_idempotency_key: session.idempotencyKey
                )
            )
            .execute()
            .value

        apply(state: response.state, settings: response.settings)

        activeSession = nil
        persistActiveSession()
        phase = .connected

        return response
    }

    func clearLocalPairing() {
        syncID = nil
        pairingCode = ""
        phase = .needsPairing
    }

    private func ensureSession() async throws {
        if client.auth.currentUser == nil {
            _ = try await client.auth.signInAnonymously()
        }
    }

    private static func loadActiveSession() -> WatchQuestSession? {
        guard
            let data = UserDefaults.standard.data(forKey: "rogueWitchActiveQuest"),
            let session = try? JSONDecoder().decode(WatchQuestSession.self, from: data)
        else {
            return nil
        }

        return session
    }

    private func persistActiveSession() {
        guard let activeSession else {
            UserDefaults.standard.removeObject(forKey: activeQuestKey)
            return
        }

        do {
            let data = try JSONEncoder().encode(activeSession)
            UserDefaults.standard.set(data, forKey: activeQuestKey)
        } catch {
            print("Could not save active Rogue Witch quest: \(error)")
        }
    }

    private func apply(state: QuestBoardState, settings: QuestBoardSettings) {
        let weekKey = QuestBoardWeek.currentKey()
        let isCurrentWeek = state.weekKey == weekKey

        let completed = isCurrentWeek
            ? (state.weeklyCompleted?.count ?? 0)
            : 0

        let goal = max(1, settings.weeklyGoal ?? 3)

        let name: String
        if let playerName = settings.playerName,
           !playerName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            name = playerName
        } else {
            name = "Jess"
        }

        let next = RogueWitchSnapshot(
            displayName: name,
            className: "Rogue Witch Assassin",
            completedThisWeek: completed,
            weeklyGoal: goal,
            bossUnlocked: completed >= goal,
            bossDefeated: state.bossDefeatedWeek == weekKey,
            gold: state.gold ?? 0,
            crystals: state.crystals ?? 0,
            updatedAt: Date()
        )

        snapshot = next

        do {
            try RogueWitchSharedState.save(next)
            WidgetCenter.shared.reloadTimelines(ofKind: "RogueWitchWidget")
        } catch {
            print("Rogue Witch widget snapshot save failed: \(error)")
        }
    }
}

enum RogueWitchError: LocalizedError {
    case wrongProfile
    case notPaired
    case noActiveQuest
    case unsupportedQuest

    var errorDescription: String? {
        switch self {
        case .wrongProfile:
            return "That sync channel belongs to the other adventurer."
        case .notPaired:
            return "Pair this watch with Jess's Quest Board first."
        case .noActiveQuest:
            return "There is no active quest to complete."
        case .unsupportedQuest:
            return "That quest cannot be completed from the watch."
        }
    }
}
