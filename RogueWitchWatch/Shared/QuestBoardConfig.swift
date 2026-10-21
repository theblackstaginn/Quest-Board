import Foundation
import Supabase

enum QuestBoardConfig {
    static let projectURL = URL(string: "https://pqifpislzljilqatmtly.supabase.co")!

    // Public client key. Authorization is enforced by Supabase Auth, RLS,
    // and Quest Board's pairing functions. Never place a service-role key here.
    static let publishableKey = "sb_publishable_16wAhIyuMsClbOYoAZt6aQ_unXWTJ_n"

    static let client = SupabaseClient(
        supabaseURL: projectURL,
        supabaseKey: publishableKey
    )
}
