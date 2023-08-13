import ProfileHeader from "@/components/cards/ProfileHeader";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({params}:{params:{id:string}}) => {

  const user = await currentUser();

  if (!user) null;

  if (typeof user?.id != "undefined") {
    const userInfo = await fetchUser({ userId: params.id });
    if (!userInfo?.onboarded) redirect("/onboarding");
    else {
      return <section>
        <ProfileHeader 
          accountId={userInfo.id}
          authUserId={user.id}
          name={userInfo.name}
          username={userInfo.username}
          imgUrl={userInfo.image}
          bio={userInfo.bio}
        />
        <div className="mt-9">

        </div>
        </section>;
    }
  }
};

export default Page;
