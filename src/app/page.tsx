import { auth } from "@/auth";
import { getSessionsAction, getStatsAction } from "@/lib/actions";
import MainDashboard from "@/components/MainDashboard";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [sessionsData, statsData] = await Promise.all([
    getSessionsAction(),
    getStatsAction(),
  ]);

  return (
    <MainDashboard
      initialSessions={sessionsData}
      initialStats={statsData}
      user={session.user}
    />
  );
}
