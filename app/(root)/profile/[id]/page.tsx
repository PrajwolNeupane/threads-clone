import ProfileHeader from "@/components/cards/ProfileHeader";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { redirect } from "next/navigation";
import { profileTabs } from "@/const";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";

const Page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();

  if (!user) null;

  if (typeof user?.id != "undefined") {
    const userInfo = await fetchUser(params.id );
    if (!userInfo?.onboarded) redirect("/onboarding");
    else {
      return (
        <section>
          <ProfileHeader
            accountId={userInfo.id}
            authUserId={user.id}
            name={userInfo.name}
            username={userInfo.username}
            imgUrl={userInfo.image}
            bio={userInfo.bio}
          />
          <div className="mt-9">
            <Tabs defaultValue="threads" className="w-full">
              <TabsList className="tab">
                {profileTabs.map((tab) => (
                  <TabsTrigger
                    value={tab.value}
                    key={tab.label}
                    className="tab"
                  >
                    <Image
                      src={tab.icon}
                      alt="Tab Icons"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                    <p className="max-sm:hidden">{tab.label}</p>
                    {tab.label === "Threads" && (
                      <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                        {userInfo?.threads?.length}
                      </p>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
              {profileTabs.map((tab) => (
                <TabsContent
                  key={`content-${tab.label}`}
                  value={tab.value}
                  className="w-full text-light-1"
                >
                  <ThreadsTab
                    currentUserId={user.id}
                    accountId={userInfo.id}
                    accountType="User"
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
      );
    }
  }
};

export default Page;
