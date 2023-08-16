import UserCard from "@/components/cards/UserCard";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function page() {
  const user = await currentUser();

  if (!user) null;

  if (typeof user?.id != "undefined") {
    const userInfo = await fetchUser(user.id );
    if (!userInfo?.onboarded) redirect("/onboarding");
    else {
      const result = await fetchUsers({
        userId: user.id,
        searchString: "",
        pageNumber: 1,
        pageSize: 25,
      });
      

      return (
        <section>
          <h1 className="head-text mb-10">Search</h1>
          <div className="mt-14 flex flex-col gap-9">
            {result?.users.length === 0 ? (
              <p className="no-result">No Users</p>
            ) : (
              <>
                {result?.users.map((user) => (
                  <UserCard
                    key={user.id}
                    id={user.id}
                    name={user.name}
                    username={user.username}
                    image={user.image}
                    personType="User"
                  />
                ))}
              </>
            )}
          </div>
        </section>
      );
    }
  }
}

export default page;
