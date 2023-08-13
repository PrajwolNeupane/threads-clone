import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";


async function Page() {
  const user = await currentUser();

  if (!user) null;

  if (typeof user?.id != "undefined") {
    const userInfo = await fetchUser({ userId: user.id });
    if (!userInfo?.onboarded) redirect("/onboarding");
    else {
      return (
        <>
          <h1 className="head-text">Create Thread</h1>
          <PostThread userId={userInfo?._id} />
        </>
      );
    }
  }
}

export default Page;
