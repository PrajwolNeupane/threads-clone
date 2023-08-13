import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPost } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {

  const result = await fetchPost(1,30);
  const user = await currentUser();

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {
          result?.post.length === 0 ? <p className="no-result">No Threads Found</p>  :
          result?.post.map((curr,indx) => (
            <ThreadCard key={indx} id={curr?._id} currentUserId={user?.id!} parentId={curr?.parentId} content={curr?.text} author={curr?.author} community={curr?.community} createdAt={curr?.createdAt} comments={curr?.comments}/>
          ))
        }
      </section>
    </>
  )
} 