import WidgetKit
import SwiftUI

struct RogueWitchEntry: TimelineEntry {
    let date: Date
    let snapshot: RogueWitchSnapshot
}

struct RogueWitchProvider: TimelineProvider {
    func placeholder(in context: Context) -> RogueWitchEntry {
        RogueWitchEntry(
            date: Date(),
            snapshot: RogueWitchSnapshot(
                displayName: "Jess",
                className: "Rogue Witch Assassin",
                completedThisWeek: 2,
                weeklyGoal: 3,
                bossUnlocked: false,
                bossDefeated: false,
                gold: 87,
                crystals: 3,
                updatedAt: Date()
            )
        )
    }

    func getSnapshot(
        in context: Context,
        completion: @escaping (RogueWitchEntry) -> Void
    ) {
        completion(
            RogueWitchEntry(
                date: Date(),
                snapshot: RogueWitchSharedState.load()
            )
        )
    }

    func getTimeline(
        in context: Context,
        completion: @escaping (Timeline<RogueWitchEntry>) -> Void
    ) {
        let entry = RogueWitchEntry(
            date: Date(),
            snapshot: RogueWitchSharedState.load()
        )

        let next = Calendar.current.date(
            byAdding: .minute,
            value: 15,
            to: Date()
        ) ?? Date().addingTimeInterval(900)

        completion(
            Timeline(
                entries: [entry],
                policy: .after(next)
            )
        )
    }
}

struct RogueWitchWidgetView: View {
    @Environment(\.widgetFamily) private var family
    let entry: RogueWitchEntry

    var body: some View {
        switch family {
        case .accessoryCircular:
            circular

        case .accessoryInline:
            Text(inlineText)

        case .accessoryRectangular:
            rectangular

        default:
            rectangular
        }
    }

    private var circular: some View {
        Gauge(value: entry.snapshot.progressFraction) {
            Image(systemName: "moon.stars.fill")
        } currentValueLabel: {
            Text("\(entry.snapshot.completedThisWeek)")
                .font(.caption2.bold())
        }
        .gaugeStyle(.accessoryCircular)
        .tint(.purple)
    }

    private var rectangular: some View {
        VStack(alignment: .leading, spacing: 2) {
            HStack(spacing: 4) {
                Image(systemName: "moon.stars.fill")
                Text("ROGUE WITCH")
                    .font(.caption2.bold())
            }

            Text(statusText)
                .font(.caption)

            ProgressView(value: entry.snapshot.progressFraction)
                .tint(.purple)
        }
    }

    private var inlineText: String {
        if entry.snapshot.bossDefeated {
            return "Rogue Witch · Boss vanquished"
        }

        if entry.snapshot.bossUnlocked {
            return "Rogue Witch · Boss unlocked"
        }

        return "Rogue Witch · \(entry.snapshot.completedThisWeek)/\(entry.snapshot.weeklyGoal)"
    }

    private var statusText: String {
        if entry.snapshot.bossDefeated {
            return "Boss vanquished"
        }

        if entry.snapshot.bossUnlocked {
            return "Boss battle unlocked"
        }

        return "\(entry.snapshot.completedThisWeek)/\(entry.snapshot.weeklyGoal) quests"
    }
}

struct RogueWitchWidget: Widget {
    let kind = "RogueWitchWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(
            kind: kind,
            provider: RogueWitchProvider()
        ) { entry in
            RogueWitchWidgetView(entry: entry)
                .containerBackground(.black, for: .widget)
        }
        .configurationDisplayName("Rogue Witch")
        .description("Jess's Quest Board progress and Boss state.")
        .supportedFamilies([
            .accessoryCircular,
            .accessoryRectangular,
            .accessoryInline
        ])
    }
}

@main
struct RogueWitchWidgetBundle: WidgetBundle {
    var body: some Widget {
        RogueWitchWidget()
    }
}
