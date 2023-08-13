"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.models";
import User from "../models/user.models";
import { connectToDB } from "../mongoose";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function fetchPost(pageNumber = 1, pageSize = 20) {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const postQuery = Thread.find({
      parentId: { $in: [null, undefined] },
    })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: "User",
          select: "__id name parentId image",
        },
      });

    const totalPostCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const post = await postQuery.exec();

    const isNext = totalPostCount > skipAmount + post.length;

    return {
      post,isNext
    }

  } catch (error: any) {
    console.log(
      `A new error has occured on  createThread action ${error.message}`
    );
  }
}

export async function createThread({ text, author, communityId, path }: Params
  ) {
    try {
      connectToDB();
  
      const createdThread = await Thread.create({
        text,
        author,
        community: null, // Assign communityId if provided, or leave it null for personal account
      });
  
      // Update User model
      await User.findByIdAndUpdate(author, {
        $push: { threads: createdThread._id },
      });
  
      revalidatePath(path);
    } catch (error: any) {
      throw new Error(`Failed to create thread: ${error.message}`);
    }
  }

