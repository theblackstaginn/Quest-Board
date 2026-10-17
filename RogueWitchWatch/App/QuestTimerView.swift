import SwiftUI
import WatchKit

struct QuestTimerView: View {
    @ObservedObject var store: RogueWitchStore
    let onCompleted: (WatchQuestCompletionResponse) -> Void

    @State private var showCompleteConfirmation = false
    @State private var showAbandonConfirmation = false
    @State private var errorMessage: String?

    var body: some View {
        if let quest = store.activeQuest,
           let session = store.activeSession {
            VStack(spacing: 9) {
                HStack(spacing: 8) {
                    Image(systemName: quest.systemImage)
                        .foregroundStyle(.purple)

                    VStack(alignment: .leading, spacing: 1) {
                        Text(quest.title)
                            .font(.headline)
                            .fontDesign(.serif)

                        Text("\(quest.category) · \(quest.time)")
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                    }

                    Spacer(minLength: 0)
                }

                TimelineView(.periodic(from: .now, by: 1)) { context in
                    Text(formattedElapsed(session.elapsed(at: context.date)))
                        .font(.system(.title2, design: .monospaced).bold())
                        .foregroundStyle(.white)
                }

                HStack(spacing: 6) {
                    Button {
                        if session.isRunning {
                            store.pauseActiveQuest()
                        } else {
                            store.resumeActiveQuest()
                        }
                        WKInterfaceDevice.current().play(.click)
                    } label: {
                        Image(systemName: session.isRunning ? "pause.fill" : "play.fill")
                    }
                    .buttonStyle(.bordered)
                    .tint(.purple)

                    Button {
                        showCompleteConfirmation = true
                    } label: {
                        Image(systemName: "checkmark")
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.purple)
                    .disabled(store.isCompleting)

                    Button {
                        showAbandonConfirmation = true
                    } label: {
                        Image(systemName: "xmark")
                    }
                    .buttonStyle(.bordered)
                    .tint(.secondary)
                    .disabled(store.isCompleting)
                }

                if store.isCompleting {
                    HStack(spacing: 6) {
                        ProgressView()
                            .controlSize(.small)
                        Text("Sealing the quest…")
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                    }
                }

                if let errorMessage {
                    Text(errorMessage)
                        .font(.caption2)
                        .foregroundStyle(.red)
                        .multilineTextAlignment(.center)
                }
            }
            .padding(9)
            .background(
                RoundedRectangle(cornerRadius: 14)
                    .fill(Color.white.opacity(0.06))
            )
            .confirmationDialog(
                "Complete this quest?",
                isPresented: $showCompleteConfirmation,
                titleVisibility: .visible
            ) {
                Button("Complete Quest") {
                    Task { await complete() }
                }
                Button("Cancel", role: .cancel) {}
            }
            .confirmationDialog(
                "Abandon this quest?",
                isPresented: $showAbandonConfirmation,
                titleVisibility: .visible
            ) {
                Button("Abandon Quest", role: .destructive) {
                    store.abandonActiveQuest()
                    WKInterfaceDevice.current().play(.click)
                }
                Button("Keep Quest", role: .cancel) {}
            }
        }
    }

    private func complete() async {
        errorMessage = nil

        do {
            let response = try await store.completeActiveQuest()
            WKInterfaceDevice.current().play(.success)
            onCompleted(response)
        } catch {
            WKInterfaceDevice.current().play(.failure)
            errorMessage = error.localizedDescription
        }
    }

    private func formattedElapsed(_ seconds: TimeInterval) -> String {
        let total = max(0, Int(seconds.rounded(.down)))
        let hours = total / 3600
        let minutes = (total % 3600) / 60
        let remainingSeconds = total % 60

        if hours > 0 {
            return String(format: "%d:%02d:%02d", hours, minutes, remainingSeconds)
        }

        return String(format: "%02d:%02d", minutes, remainingSeconds)
    }
}
