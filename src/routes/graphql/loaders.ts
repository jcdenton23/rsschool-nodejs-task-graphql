import DataLoader from 'dataloader';
import { MemberType, Post, PrismaClient, Profile, User } from '@prisma/client';

export const createLoaders = (prisma: PrismaClient) => {
  return {
    user: new DataLoader<string, User>(async (ids) => {
      const users = await prisma.user.findMany({
        where: { id: { in: ids as string[] } },
      });
      const userMap = new Map(users.map((user) => [user.id, user]));
      return ids.map((id) => userMap.get(id) as User);
    }),

    post: new DataLoader<string, Post>(async (postIds) => {
      const fetchedPosts = await prisma.post.findMany({
        where: { id: { in: postIds as string[] } },
      });
      const postMap = new Map(fetchedPosts.map((post) => [post.id, post]));
      return postIds.map((postId) => postMap.get(postId) as Post);
    }),

    postsByUser: new DataLoader<string, Post[]>(async (userIds) => {
      const fetchedPosts = await prisma.post.findMany({
        where: { authorId: { in: userIds as string[] } },
      });
      const postsMap: Record<string, Post[]> = {};
      fetchedPosts.forEach((post) => {
        if (!postsMap[post.authorId]) {
          postsMap[post.authorId] = [];
        }
        postsMap[post.authorId].push(post);
      });
      return userIds.map((userId) => postsMap[userId] || []);
    }),

    profile: new DataLoader<string, Profile>(async (profileIds) => {
      const fetchedProfiles = await prisma.profile.findMany({
        where: { id: { in: profileIds as string[] } },
      });
      const profileMap = new Map(fetchedProfiles.map((profile) => [profile.id, profile]));
      return profileIds.map((profileId) => profileMap.get(profileId) as Profile);
    }),

    profilesByMemberType: new DataLoader<string, Profile[]>(async (memberTypeIds) => {
      const fetchedProfiles = await prisma.profile.findMany({
        where: { memberTypeId: { in: memberTypeIds as string[] } },
      });
      const profilesMap: Record<string, Profile[]> = {};
      fetchedProfiles.forEach((profile) => {
        if (!profilesMap[profile.memberTypeId]) {
          profilesMap[profile.memberTypeId] = [];
        }
        profilesMap[profile.memberTypeId].push(profile);
      });
      return memberTypeIds.map((memberTypeId) => profilesMap[memberTypeId] || []);
    }),

    profileByUser: new DataLoader<string, Profile>(async (userIds) => {
      const fetchedProfiles = await prisma.profile.findMany({
        where: { userId: { in: userIds as string[] } },
      });
      const profileMap = new Map(
        fetchedProfiles.map((profile) => [profile.userId, profile]),
      );
      return userIds.map((userId) => profileMap.get(userId) as Profile);
    }),

    memberType: new DataLoader<string, MemberType>(async (memberTypeIds) => {
      const fetchedMemberTypes = await prisma.memberType.findMany({
        where: { id: { in: memberTypeIds as string[] } },
      });
      const memberTypeMap = new Map(
        fetchedMemberTypes.map((memberType) => [memberType.id, memberType]),
      );
      return memberTypeIds.map(
        (memberTypeId) => memberTypeMap.get(memberTypeId) as MemberType,
      );
    }),

    userSubscribedTo: new DataLoader<string, User[]>(async (subscriberIds) => {
      const fetchedUsers = await prisma.user.findMany({
        where: {
          subscribedToUser: {
            some: {
              subscriberId: { in: subscriberIds as string[] },
            },
          },
        },
        include: {
          subscribedToUser: true,
        },
      });

      const userMap: Record<string, User[]> = {};
      fetchedUsers.forEach((user) => {
        user.subscribedToUser.forEach((sub) => {
          if (!userMap[sub.subscriberId]) {
            userMap[sub.subscriberId] = [];
          }
          userMap[sub.subscriberId].push(user);
        });
      });

      return subscriberIds.map((subscriberId) => userMap[subscriberId] || []);
    }),

    subscribedToUser: new DataLoader<string, User[]>(async (authorIds) => {
      const fetchedUsers = await prisma.user.findMany({
        where: {
          userSubscribedTo: {
            some: {
              authorId: { in: authorIds as string[] },
            },
          },
        },
        include: {
          userSubscribedTo: true,
        },
      });

      const userMap: Record<string, User[]> = {};
      fetchedUsers.forEach((user) => {
        user.userSubscribedTo.forEach((sub) => {
          if (!userMap[sub.authorId]) {
            userMap[sub.authorId] = [];
          }
          userMap[sub.authorId].push(user);
        });
      });

      return authorIds.map((authorId) => userMap[authorId] || []);
    }),
  };
};
