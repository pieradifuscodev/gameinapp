import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileHeader } from "@/components/profile/ProfileHeader";

import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { ProfileContent } from "@/components/profile/ProfileContent";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const userId = (session.user as any).id;
  const currentTab = resolvedSearchParams.tab || "partecipazioni";

  const userProfile = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      participations: { include: { gym: true } },
      createdEvents: { include: { gym: true } },
      circles: true,
      ownedCircles: true,
      followedBy: true,
      following: true,
    }
  });

  if (!userProfile) return <div>Utente non trovato</div>;

  return (
    <div className="flex flex-col h-full bg-[#0C0C0E] relative">
      <ProfileHeader 
        user={userProfile} 
        stats={{
          createdCount: userProfile.createdEvents.length,
          followersCount: userProfile.followedBy.length,
          followingCount: userProfile.following.length,
        }}
        favoriteSports={userProfile.favoriteSports}
      />

      <ProfileTabs currentTab={currentTab} />

      <ProfileContent 
        currentTab={currentTab}
        participations={userProfile.participations}
        createdEvents={userProfile.createdEvents}
        circles={userProfile.circles}
        ownedCircles={userProfile.ownedCircles}
      />
    </div>
  );
}
