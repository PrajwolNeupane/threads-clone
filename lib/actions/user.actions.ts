"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.models";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.models";
import { FilterQuery, SortOrder } from "mongoose";

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

export async function fetchUser({ userId }: { userId: string }): Promise<any> {
  try {
    connectToDB();
    return await User.findOne({ id: userId });
    // .populate({
    //   path:'communities',
    //   modal:"communities"
    // })
  } catch (error: any) {
    console.log(
      `A new error has occured on fetch user action ${error.message}`
    );
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      options: { sort: { createdAt: "desc" } },
      populate: {
        path: "children",
        model: Thread,
        options: { sort: { createdAt: "desc" } },
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });
    return threads;
  } catch (error: any) {
    console.log(
      `A new error has occured on fetchUserPosts user action ${error.message}`
    );
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();
    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $refex: regex } },
      ];
    }

    const sortOption = { createdAt: sortBy };
    const usersQuery = User.find(query)
      .sort(sortOption)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
    console.log(
      `A new error has occured on fetchUsers user action ${error.message}`
    );
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();
    const userThreads = await Thread.find(({author:userId}));

    const childThreadIds = userThreads.reduce((acc,thread) => {
        return acc.concat(thread.children)
    })

    const replies = await Thread.find({
      _id:{$in:childThreadIds},
      author:{$ne:userId}
    }).populate({
      path:'author',
      model:User,
      select:'name image _id'
    })

  } catch (error: any) {
    console.log(
      `A new error has occured on getActivity user action ${error.message}`
    );
  }
}
