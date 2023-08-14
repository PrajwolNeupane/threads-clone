import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function page() {
  const user = await currentUser();

  if (!user) null;

  if (typeof user?.id != "undefined") {
    const userInfo = await fetchUser({ userId: user.id });
    if (!userInfo?.onboarded) redirect("/onboarding");
    else {
      return (
        <section>
          <h1 className="head-text mb-10">Activity</h1>
          <div className="mt-14 flex flex-col gap-9">
           
          </div>
        </section>
      );
    }
  }
}

export default page;
