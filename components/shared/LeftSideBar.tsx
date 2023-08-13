"use client"
import Link from "next/link";
import { sidebarLinks } from '../../const/index.js'
import Image from "next/image";
import { usePathname, useRouter } from 'next/navigation'
import { currentUser, SignedIn,SignOutButton ,useAuth} from "@clerk/nextjs";

function LeftSideBar() {

    const router = useRouter();
    const pathname = usePathname();
    const {userId} = useAuth();

    return (
        <section className="custom-scrollbar leftsidebar">
            <div className="flex flex-col w-full flex-1 gap-6 px-6">
                {
                    sidebarLinks.map((link) => {
                        const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route 
                        if(link.route == "/profile") link.route = `${link.route}/${userId}`
                        return (
                            <Link href={link.route} key={link.label} className={`leftsidebar_link ${isActive && `bg-primary-500`}`}>
                                <Image src={link.imgURL} alt={link.label} width={24} height={24} />
                                <p className="text-light-1 max-lg:hidden">{link.label}</p>
                            </Link>
                        )
                    })
                }
            </div>
            <div className="mt-10 px-6">
                <SignedIn>
                    <SignOutButton signOutCallback={()=>{
                        router.push("/signin")
                    }}>
                        <div className="flex cursor-pointer gap-4 p-4">
                            <Image src={"/assets/logout.svg"} alt="logout" width={24} height={24} />
                            <p className="text-light-2 max-lg:hidden">LogOut</p>
                        </div>
                    </SignOutButton>
                </SignedIn>
            </div>
        </section>
    )
}

export default LeftSideBar;