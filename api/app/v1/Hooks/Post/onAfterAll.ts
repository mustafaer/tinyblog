import { IAfterAllContext } from "axe-api";
import PostService from "../../Services/PostService";

export default async ({ req, result }: IAfterAllContext) => {
  // Who am I?
  const userId = req.original.auth?.userId;

  if (userId) {
    // Which posts should I check?
    const postIds = [
      ...result.map((item: any) => item.id),
      ...result.map((item: any) => item.parent?.id),
      ...result.map((item: any) => item.reshare?.id),
    ].filter((id) => id);

    // The posts that I liked
    const myLikedPostIds = await PostService.getMyLikedPostIds(userId, postIds);

    // The post ids that I already shared
    const mySharedPostIds = await PostService.getMySharedPostIds(
      userId,
      postIds
    );

    result.forEach((item: any) => {
      // Set the like status for the pot
      item.is_liked_by_you = myLikedPostIds.includes(item.id);

      // Check if the post is already shared by yourself
      item.is_shared_by_you = mySharedPostIds.includes(item.id);

      // Set the like status for the parent if there is any
      if (item.parent) {
        item.parent.is_liked_by_you = myLikedPostIds.includes(item.parent.id);
        item.parent.is_shared_by_you = mySharedPostIds.includes(item.parent.id);
      }

      // Set the like status for the parent if there is any
      if (item.reshare) {
        item.reshare.is_liked_by_you = myLikedPostIds.includes(item.reshare.id);
        item.reshare.is_shared_by_you = mySharedPostIds.includes(
          item.reshare.id
        );
      }

      item.links = (item?.links || []).map((postLink: any) => {
        return {
          code: postLink.link.code,
          link: postLink.link.link,
        };
      });
    });
  }
};
