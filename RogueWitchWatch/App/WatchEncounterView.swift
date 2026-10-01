import SwiftUI
import WatchKit

struct WatchEncounterView: View {
    @ObservedObject var store: RogueWitchStore
    let onClaimed: (WatchEncounterClaimResponse) -> Void

    @State private var errorMessage: String?

    var body: some View {
        if let encounter = store.pendingEncounter {
            VStack(spacing: 8) {
                Text("ROAD ENCOUNTER")
                    .font(.system(size: 9, weight: .semibold, design: .rounded))
                    .tracking(1.1)
                    .foregroundStyle(.purple)

                Text(encounter.glyph)
                    .font(.title)
                    .foregroundStyle(.white)
                    .shadow(color: .purple.opacity(0.9), radius: 7)

                Text(encounter.title)
                    .font(.headline)
                    .fontDesign(.serif)
                    .multilineTextAlignment(.center)

                Text(encounter.copy)
                    .font(.caption2)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)

                Text(encounter.rewardLabel)
                    .font(.caption.bold())
                    .foregroundStyle(.purple)

                Button {
                    Task { await claimEncounter() }
                } label: {
                    if store.isClaimingEncounter {
                        ProgressView()
                    } else {
                        Label("Claim", systemImage: "sparkles")
                    }
                }
                .buttonStyle(.borderedProminent)
                .tint(.purple)
                .disabled(store.isClaimingEncounter)

                if let errorMessage {
                    Text(errorMessage)
                        .font(.caption2)
                        .foregroundStyle(.red)
                        .multilineTextAlignment(.center)
                }
            }
            .padding(10)
            .background(
                RoundedRectangle(cornerRadius: 15)
                    .fill(Color.purple.opacity(0.12))
                    .overlay(
                        RoundedRectangle(cornerRadius: 15)
                            .stroke(Color.purple.opacity(0.35), lineWidth: 1)
                    )
            )
        }
    }

    private func claimEncounter() async {
        errorMessage = nil

        do {
            let response = try await store.claimPendingEncounter()
            WKInterfaceDevice.current().play(.success)
            onClaimed(response)
        } catch {
            WKInterfaceDevice.current().play(.failure)
            errorMessage = error.localizedDescription
        }
    }
}
