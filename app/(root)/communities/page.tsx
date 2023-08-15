import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

async function page() {
  const user = await currentUser();

  if (!user) null;

  if (typeof user?.id != "undefined") {
    const userInfo = await fetchUser({ userId: user.id });
    if (!userInfo?.onboarded) redirect("/onboarding");
    else {
      const activity = await getActivity(userInfo?._id);

      return (
        <section>
          <h1 className="head-text mb-10">Communities</h1>
          <section className="mt-10 flex flex-col gap-5">
            {activity?.length! > 0 ? (
              <>
                {activity?.map((curr) => (
                  <Link key={curr?._id} href={`/thread/${curr.parentId}`}>
                    <article className="activity-card">
                      <Image
                        src={curr.author.image}
                        alt="Profile Picture"
                        width={30}
                        height={20}
                        className="rounded-full object-cover"
                      />
                      <p className="!text-small-regular text-light-1">
                        <span className="mr-1 text-primary-500">
                          {
                            curr.author.name
                          }
                        </span>
                        <span>
                          {" "}replied to your thread
                        </span>
                      </p>
                    </article>
                  </Link>
                ))}
              </>
            ) : (
              <p className="!text-base-regular text-light-3">No activity yet</p>
            )}
          </section>
        </section>
      );
    }
  }
}

export default page;
