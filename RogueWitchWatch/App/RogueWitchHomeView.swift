import SwiftUI

struct RogueWitchHomeView: View {
    @StateObject private var store = RogueWitchStore()

    @State private var showingQuestPicker = false
    @State private var rewardText: String?

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [
                    Color.black,
                    Color.purple.opacity(0.3),
                    Color.black
                ],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()

            content
        }
        .task {
            await store.bootstrap()
        }
        .sheet(isPresented: $showingQuestPicker) {
            QuestPickerView(store: store)
        }
    }

    @ViewBuilder
    private var content: some View {
        switch store.phase {
        case .starting, .loading:
            VStack(spacing: 8) {
                ProgressView()
                    .tint(.purple)

                Text("Reading the runes…")
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            }

        case .needsPairing:
            PairingView(store: store)

        case .connected:
            connectedView

        case .failed:
            if store.isPaired {
                errorView
            } else {
                PairingView(store: store)
            }
        }
    }

    private var connectedView: some View {
        ScrollView {
            VStack(spacing: 10) {
                HStack(spacing: 8) {
                    progressSigil

                    VStack(alignment: .leading, spacing: 1) {
                        Text(store.snapshot.displayName)
                            .font(.headline)
                            .fontDesign(.serif)

                        Text("Rogue Witch Assassin")
                            .font(.caption2)
                            .foregroundStyle(.purple)

                        Text("\(store.snapshot.completedThisWeek)/\(store.snapshot.weeklyGoal) quests")
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                    }

                    Spacer(minLength: 0)
                }

                statusCard

                if let rewardText {
                    rewardCard(rewardText)
                }

                if store.activeSession != nil {
                    QuestTimerView(store: store) { response in
                        var message = "+\(response.earnedXp) XP · +\(response.earnedGold) Gold"

                        if response.weekConquered {
                            message += " · Week Conquered!"
                        }

                        if response.duplicate {
                            message = "Quest already sealed."
                        }

                        rewardText = message
                    }
                } else {
                    Button {
                        rewardText = nil
                        showingQuestPicker = true
                    } label: {
                        Label("Begin Quest", systemImage: "moon.stars.fill")
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.purple)
                }

                HStack {
                    Label("\(store.snapshot.gold)", systemImage: "circle.fill")
                    Spacer()
                    Label("\(store.snapshot.crystals)", systemImage: "diamond.fill")
                }
                .font(.caption2)
                .foregroundStyle(.secondary)

                Button {
                    Task { try? await store.refresh() }
                } label: {
                    Label("Refresh", systemImage: "arrow.clockwise")
                }
                .buttonStyle(.bordered)
                .tint(.purple)
            }
            .padding(.horizontal, 6)
        }
    }

    private var progressSigil: some View {
        ZStack {
            Circle()
                .stroke(Color.purple.opacity(0.22), lineWidth: 5)

            Circle()
                .trim(from: 0, to: store.snapshot.progressFraction)
                .stroke(
                    AngularGradient(
                        colors: [.purple, .white, .purple],
                        center: .center
                    ),
                    style: StrokeStyle(lineWidth: 5, lineCap: .round)
                )
                .rotationEffect(.degrees(-90))

            Image(systemName: "moon.stars.fill")
                .foregroundStyle(.white)
        }
        .frame(width: 54, height: 54)
    }

    private var statusCard: some View {
        Group {
            if store.snapshot.bossDefeated {
                Label("Boss vanquished", systemImage: "checkmark.seal.fill")
                    .foregroundStyle(.green)
            } else if store.snapshot.bossUnlocked {
                Label("Boss battle unlocked", systemImage: "crown.fill")
                    .foregroundStyle(.purple)
            } else {
                let remaining = max(
                    0,
                    store.snapshot.weeklyGoal - store.snapshot.completedThisWeek
                )

                Label("\(remaining) until the Boss", systemImage: "sparkles")
                    .foregroundStyle(.secondary)
            }
        }
        .font(.caption)
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(9)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.white.opacity(0.06))
        )
    }

    private func rewardCard(_ text: String) -> some View {
        HStack(spacing: 7) {
            Image(systemName: "sparkles")
                .foregroundStyle(.purple)

            Text(text)
                .font(.caption2)
                .multilineTextAlignment(.leading)

            Spacer(minLength: 0)
        }
        .padding(8)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.purple.opacity(0.12))
        )
    }

    private var errorView: some View {
        VStack(spacing: 10) {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundStyle(.orange)

            if case let .failed(message) = store.phase {
                Text(message)
                    .font(.caption2)
                    .multilineTextAlignment(.center)
            }

            Button("Try Again") {
                Task { await store.bootstrap() }
            }
            .buttonStyle(.borderedProminent)
            .tint(.purple)

            Button("Pair Again") {
                store.clearLocalPairing()
            }
            .buttonStyle(.bordered)
        }
        .padding(.horizontal, 8)
    }
}
