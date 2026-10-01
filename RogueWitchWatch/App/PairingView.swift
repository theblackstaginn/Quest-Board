import SwiftUI

struct PairingView: View {
    @ObservedObject var store: RogueWitchStore

    var body: some View {
        ScrollView {
            VStack(spacing: 12) {
                ZStack {
                    Circle()
                        .fill(
                            RadialGradient(
                                colors: [
                                    Color.purple.opacity(0.72),
                                    Color.black.opacity(0.12)
                                ],
                                center: .center,
                                startRadius: 4,
                                endRadius: 34
                            )
                        )
                        .frame(width: 64, height: 64)

                    Image(systemName: "moon.stars.fill")
                        .font(.title2)
                        .foregroundStyle(.white)
                }

                Text("Rogue Witch")
                    .font(.headline)
                    .fontDesign(.serif)

                Text("Bind this watch to Jess's Quest Board.")
                    .font(.caption2)
                    .multilineTextAlignment(.center)
                    .foregroundStyle(.secondary)

                TextField("8-character code", text: $store.pairingCode)
                    .textInputAutocapitalization(.characters)
                    .autocorrectionDisabled()
                    .multilineTextAlignment(.center)

                Button {
                    Task {
                        await store.pair()
                    }
                } label: {
                    Label("Bind the Sigil", systemImage: "link")
                }
                .buttonStyle(.borderedProminent)
                .tint(.purple)

                if case let .failed(message) = store.phase {
                    Text(message)
                        .font(.caption2)
                        .foregroundStyle(.red)
                        .multilineTextAlignment(.center)
                }

                Text("Generate the code in Jess's Quest Board Settings first.")
                    .font(.caption2)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
            }
            .padding(.horizontal, 8)
        }
    }
}
