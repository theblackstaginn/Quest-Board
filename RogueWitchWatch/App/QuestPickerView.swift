import SwiftUI

struct QuestPickerView: View {
    @ObservedObject var store: RogueWitchStore
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            List(WatchQuestCatalog.all) { quest in
                Button {
                    store.startQuest(quest)
                    dismiss()
                } label: {
                    HStack(spacing: 9) {
                        ZStack {
                            Circle()
                                .fill(Color.purple.opacity(0.18))
                                .frame(width: 34, height: 34)

                            Image(systemName: quest.systemImage)
                                .foregroundStyle(.purple)
                        }

                        VStack(alignment: .leading, spacing: 2) {
                            Text(quest.title)
                                .font(.headline)
                                .foregroundStyle(.primary)

                            Text("\(quest.category) · \(quest.time)")
                                .font(.caption2)
                                .foregroundStyle(.secondary)
                        }
                    }
                }
            }
            .navigationTitle("Choose Quest")
        }
    }
}
