import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";

interface Props{
    currentUserId:string,
    accountId:string,
    accountType:string
}

const ThreadsTab = async ({ currentUserId,accountId,accountType}:Props) => {

    let result = await fetchUserPosts(accountId);
    if(!result) redirect('/');

    return (
        <section className="mt-9 flex flex-col gap-10">
            {
                result.threads.map((curr:any,indx:number) => (
                    <ThreadCard  key={indx} id={curr?._id} currentUserId={currentUserId} parentId={curr?.parentId} content={curr?.text} author={accountType === 'User' ? 
                    {name:result.name,image:result.image,id:result.id} : 
                    {name:curr.author.name,image:curr.author.image, id:curr.author.id}} community={curr?.community} createdAt={curr?.createdAt} comments={curr?.comments}/>
                ))
            }
        </section>
    )
}

export default ThreadsTab;