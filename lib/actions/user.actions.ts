"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.models";
import { connectToDB } from "../mongoose";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  try {
    connectToDB();  
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name: name,
        image,
        bio,
        onboarded: true,
      },
      {
        upsert: true,
      }
    );
    //Next JS function
    if (path == "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    console.log(`A new error has occured on user action ${error.message}`);
  }
}

export async function fetchUser({userId}:{userId:string}): Promise<any> {
  try {
    connectToDB();  
    return await User.findOne({id:userId})
    // .populate({
    //   path:'communities',
    //   modal:"communities"
    // })
  } catch (error: any) {
    console.log(`A new error has occured on fetch user action ${error.message}`);
  }
}
